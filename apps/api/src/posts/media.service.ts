import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { PostMedia } from '@repo/types';
import { throwOnError } from '../common/supabase-error.util';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMediaDto } from './dto/create-media.dto';

const COVER_BUCKET = 'post-images';

@Injectable()
export class MediaService {
  constructor(private readonly supabase: SupabaseService) {}

  async list(postId: number): Promise<PostMedia[]> {
    const { data, error } = await this.supabase.client
      .from('post_media')
      .select('*')
      .eq('post_id', postId)
      .order('display_order');

    throwOnError(error);
    return data as PostMedia[];
  }

  async add(postId: number, dto: CreateMediaDto): Promise<PostMedia> {
    const { data, error } = await this.supabase.adminClient
      .from('post_media')
      .insert({
        post_id: postId,
        type: dto.type,
        url: dto.url,
        alt_text: dto.alt_text ?? null,
        caption: dto.caption ?? null,
        display_order: dto.display_order ?? 0,
      })
      .select()
      .single();

    throwOnError(error);
    return data as PostMedia;
  }

  async remove(postId: number, mediaId: number): Promise<void> {
    const { error } = await this.supabase.adminClient
      .from('post_media')
      .delete()
      .eq('id', mediaId)
      .eq('post_id', postId);

    throwOnError(error);
  }

  /** Uploads a media image to Supabase Storage and returns the public URL (does not touch posts table). */
  async uploadMediaFile(
    postId: number,
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const ext = file.originalname.split('.').pop();
    const path = `${postId}/media-${Date.now()}.${ext}`;

    const { error: uploadError } = await this.supabase.adminClient.storage
      .from(COVER_BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

    if (uploadError) {
      throw new InternalServerErrorException(uploadError.message);
    }

    const { data: urlData } = this.supabase.adminClient.storage
      .from(COVER_BUCKET)
      .getPublicUrl(path);

    return { url: urlData.publicUrl };
  }

  /** Uploads cover image to Supabase Storage and persists the public URL in posts.cover_url. */
  async uploadCover(
    postId: number,
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const ext = file.originalname.split('.').pop();
    const path = `${postId}/cover.${ext}`;

    const { error: uploadError } = await this.supabase.adminClient.storage
      .from(COVER_BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });

    if (uploadError) {
      throw new InternalServerErrorException(uploadError.message);
    }

    const { data: urlData } = this.supabase.adminClient.storage
      .from(COVER_BUCKET)
      .getPublicUrl(path);

    const { error: updateError } = await this.supabase.adminClient
      .from('posts')
      .update({ cover_url: urlData.publicUrl })
      .eq('id', postId);

    if (updateError) {
      throw new InternalServerErrorException(updateError.message);
    }

    return { url: urlData.publicUrl };
  }
}
