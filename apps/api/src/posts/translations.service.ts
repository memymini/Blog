import { Injectable } from '@nestjs/common';
import type { Lang, PostTranslation } from '@repo/types';
import { throwOnError } from '../common/supabase-error.util';
import { SupabaseService } from '../supabase/supabase.service';
import { UpsertTranslationDto } from './dto/upsert-translation.dto';

@Injectable()
export class TranslationsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findOne(postId: number, lang: Lang): Promise<PostTranslation> {
    const { data, error } = await this.supabase.client
      .from('post_translations')
      .select('*')
      .eq('post_id', postId)
      .eq('lang', lang)
      .single();

    throwOnError(error, `Translation [${lang}] for post ${postId} not found`);
    return data as PostTranslation;
  }

  async upsert(
    postId: number,
    lang: Lang,
    dto: UpsertTranslationDto,
  ): Promise<PostTranslation> {
    const { data, error } = await this.supabase.adminClient
      .from('post_translations')
      .upsert(
        { post_id: postId, lang, title: dto.title, contents: dto.contents },
        { onConflict: 'post_id,lang' },
      )
      .select()
      .single();

    throwOnError(error);
    return data as PostTranslation;
  }

  async remove(postId: number, lang: Lang): Promise<void> {
    const { error } = await this.supabase.adminClient
      .from('post_translations')
      .delete()
      .eq('post_id', postId)
      .eq('lang', lang);

    throwOnError(error);
  }
}
