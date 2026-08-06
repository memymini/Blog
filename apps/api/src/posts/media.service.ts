import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { PostMedia } from '@repo/types';
import { throwOnError } from '../common/supabase-error.util';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMediaDto, UpdateMediaDto } from './dto/create-media.dto';

const COVER_BUCKET = 'post-images';
export const COVER_MAX_BYTES = 10 * 1024 * 1024;  // 10 MB
export const MEDIA_MAX_BYTES = 50 * 1024 * 1024;  // 50 MB

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
        width: dto.width ?? null,
      })
      .select()
      .single();

    throwOnError(error);
    return data as PostMedia;
  }

  async update(postId: number, mediaId: number, dto: UpdateMediaDto): Promise<PostMedia> {
    const patch: Record<string, unknown> = {};
    if (dto.width !== undefined) patch.width = dto.width;
    if (dto.caption !== undefined) patch.caption = dto.caption;
    if (dto.alt_text !== undefined) patch.alt_text = dto.alt_text;

    const { data, error } = await this.supabase.adminClient
      .from('post_media')
      .update(patch)
      .eq('id', mediaId)
      .eq('post_id', postId)
      .select()
      .single();

    throwOnError(error);
    return data as PostMedia;
  }

  async remove(postId: number, mediaId: number): Promise<void> {
    const { data } = await this.supabase.adminClient
      .from('post_media')
      .select('url')
      .eq('id', mediaId)
      .eq('post_id', postId)
      .single();

    const mediaUrl = (data as { url?: string } | null)?.url;
    if (mediaUrl) {
      const marker = `/public/${COVER_BUCKET}/`;
      const idx = mediaUrl.indexOf(marker);
      if (idx !== -1) {
        const storagePath = mediaUrl.slice(idx + marker.length);
        try {
          await this.supabase.adminClient.storage.from(COVER_BUCKET).remove([storagePath]);
        } catch {
          // non-critical: storage file may already be absent
        }
      }
    }

    const { error } = await this.supabase.adminClient
      .from('post_media')
      .delete()
      .eq('id', mediaId)
      .eq('post_id', postId);

    throwOnError(error);
  }

  /** Uploads a media file to Supabase Storage and returns the public URL. */
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

  /**
   * Deletes one inline media file from storage by its public URL.
   * Only removes files whose storage path belongs to this post and starts with
   * `media-`, so cover images and other posts' files can never be deleted here.
   * Also purges any stale post_media row with the same URL (created by old bug).
   */
  async deleteFileByUrl(postId: number, url: string): Promise<void> {
    const marker = `/public/${COVER_BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      const storagePath = url.slice(idx + marker.length);
      if (storagePath.startsWith(`${postId}/media-`)) {
        try {
          await this.supabase.adminClient.storage.from(COVER_BUCKET).remove([storagePath]);
        } catch {
          // file may already be absent — not an error
        }
      }
    }
    // Belt-and-suspenders: remove any leftover post_media row with this URL.
    await this.supabase.adminClient
      .from('post_media')
      .delete()
      .eq('post_id', postId)
      .eq('url', url);
  }

  /**
   * Lists all inline-uploaded media files (media-* prefix) in storage for a post.
   * Used by the admin gallery panel and the orphan GC — avoids touching post_media,
   * which is reserved for curated display gallery items only.
   */
  async listUploadedFiles(postId: number): Promise<{ url: string }[]> {
    const { data } = await this.supabase.adminClient.storage
      .from(COVER_BUCKET)
      .list(String(postId), { limit: 200 });

    if (!data?.length) return [];

    return data
      .filter((f) => f.name.startsWith('media-'))
      .map((f) => {
        const { data: urlData } = this.supabase.adminClient.storage
          .from(COVER_BUCKET)
          .getPublicUrl(`${postId}/${f.name}`);
        return { url: urlData.publicUrl };
      });
  }

  /**
   * Deletes inline storage files that are no longer referenced in any translation markdown.
   * Compares storage objects (media-* prefix) against the provided set of referenced URLs.
   */
  async purgeOrphanStorageFiles(postId: number, referencedUrls: Set<string>): Promise<void> {
    const { data } = await this.supabase.adminClient.storage
      .from(COVER_BUCKET)
      .list(String(postId), { limit: 200 });

    if (!data?.length) return;

    const orphanPaths = data
      .filter((f) => f.name.startsWith('media-'))
      .map((f) => ({ path: `${postId}/${f.name}` }))
      .filter(({ path }) => {
        const { data: urlData } = this.supabase.adminClient.storage
          .from(COVER_BUCKET)
          .getPublicUrl(path);
        return !referencedUrls.has(urlData.publicUrl);
      })
      .map(({ path }) => path);

    if (orphanPaths.length) {
      await this.supabase.adminClient.storage.from(COVER_BUCKET).remove(orphanPaths);
    }
  }

  /** Removes all candidate cover files from storage for the given post (best-effort). */
  async deleteCoverFromStorage(postId: number): Promise<void> {
    const candidates = ['jpg', 'jpeg', 'png', 'webp'].map((e) => `${postId}/cover.${e}`);
    try {
      await this.supabase.adminClient.storage.from(COVER_BUCKET).remove(candidates);
    } catch {
      // best-effort: no existing cover is fine
    }
  }

  /** Uploads cover image to Supabase Storage and persists the public URL in posts.cover_url. */
  async uploadCover(
    postId: number,
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const ext = file.originalname.split('.').pop();
    const path = `${postId}/cover.${ext}`;

    // Remove any previously uploaded cover files — extension may differ on replacement
    try {
      const candidates = ['jpg', 'jpeg', 'png', 'webp'].map(e => `${postId}/cover.${e}`);
      await this.supabase.adminClient.storage.from(COVER_BUCKET).remove(candidates);
    } catch {
      // best-effort: no existing cover is fine
    }

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
