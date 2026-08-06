import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  AdminPostDetail,
  AdminPostListItem,
  Lang,
  Post,
  PostDetail,
  PostListItem,
  PostListTranslation,
  TranslationUpsertItem,
} from '@repo/types';
import { throwOnError } from '../common/supabase-error.util';
import { SupabaseService } from '../supabase/supabase.service';
import { WebhookService } from '../webhook/webhook.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MediaService } from './media.service';
import { extractImageUrls } from './utils/extract-image-urls.util';

// Shape returned by Supabase before we normalize translation[] → translation
type RawPostListItem = Omit<PostListItem, 'translation'> & {
  translation: PostListTranslation[];
};

type RawAdminListItem = Omit<AdminPostListItem, 'available_langs'> & {
  translations: { lang: Lang }[];
};

@Injectable()
export class PostsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly webhook: WebhookService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Published posts with one lean translation (title + excerpt) and country.
   * Used by GET /posts — public, paginated, filterable by country.
   */
  async listPublished(
    lang: Lang,
    page: number,
    limit: number,
    country?: string,
  ): Promise<{ data: PostListItem[]; total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase.client
      .from('posts')
      .select(
        '*, translation:post_translations!inner(post_id,lang,title,excerpt), country:countries(*)',
        { count: 'exact' },
      )
      .eq('post_translations.lang', lang)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (country) {
      query = query.eq('country_code', country);
    }

    const { data, count, error } = await query;

    throwOnError(error);

    const items = (data as unknown as RawPostListItem[]).map(
      ({ translation, ...rest }) => ({ ...rest, translation: translation[0] }),
    );

    return { data: items as PostListItem[], total: count ?? 0 };
  }

  /**
   * All posts (including unpublished) with available language list.
   * Used by GET /admin/posts.
   */
  async listAll(
    page: number,
    limit: number,
  ): Promise<{ data: AdminPostListItem[]; total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await this.supabase.adminClient
      .from('posts')
      .select('*, country:countries(*), translations:post_translations(lang)', {
        count: 'exact',
      })
      .order('created_at', { ascending: false })
      .range(from, to);

    throwOnError(error);

    const items = (data as unknown as RawAdminListItem[]).map(
      ({ translations, ...rest }) => ({
        ...rest,
        available_langs: translations.map((t) => t.lang),
      }),
    );

    return { data: items as AdminPostListItem[], total: count ?? 0 };
  }

  /**
   * Single published post with one translation and media.
   * Used by GET /posts/:id?lang= — for SSG detail pages.
   */
  async findOne(id: number, lang: Lang): Promise<PostDetail> {
    const { data, error } = await this.supabase.client
      .from('posts')
      .select(
        '*, translation:post_translations!inner(*), country:countries(*), media:post_media(*)',
      )
      .eq('id', id)
      .eq('post_translations.lang', lang)
      .eq('published', true)
      .order('display_order', { referencedTable: 'post_media' })
      .single();

    throwOnError(error, `Post ${id} not found`);

    const raw = data as unknown as Omit<PostDetail, 'translation'> & {
      translation: PostDetail['translation'][];
    };
    return { ...raw, translation: raw.translation[0] } as PostDetail;
  }

  /**
   * Single post with all translations and media for the admin edit screen.
   * Used by GET /admin/posts/:id.
   */
  async findOneAdmin(id: number): Promise<AdminPostDetail> {
    const { data, error } = await this.supabase.adminClient
      .from('posts')
      .select(
        '*, translations:post_translations(*), country:countries(*), media:post_media(*)',
      )
      .eq('id', id)
      .order('display_order', { referencedTable: 'post_media' })
      .single();

    throwOnError(error, `Post ${id} not found`);
    return data as unknown as AdminPostDetail;
  }

  async create(dto: CreatePostDto): Promise<AdminPostDetail> {
    const { data, error } = await this.supabase.adminClient
      .from('posts')
      .insert({ country_code: dto.country_code, published: dto.published ?? false })
      .select()
      .single();

    throwOnError(error);
    const post = data as Post;

    if (dto.translations?.length) {
      await this.upsertTranslations(post.id, dto.translations);
    }

    return this.findOneAdmin(post.id);
  }

  async update(id: number, dto: UpdatePostDto): Promise<AdminPostDetail> {
    // Capture current cover URL before overwriting, so we can clean up storage
    // if the caller explicitly nulls it out (cover removed, not replaced).
    let oldCoverUrl: string | null | undefined;
    if (dto.cover_url === null) {
      const { data } = await this.supabase.adminClient
        .from('posts')
        .select('cover_url')
        .eq('id', id)
        .single();
      oldCoverUrl = (data as { cover_url?: string | null } | null)?.cover_url;
    }

    const payload: Partial<{ country_code: string; published: boolean; cover_url: string | null }> = {};
    if (dto.country_code !== undefined) payload.country_code = dto.country_code;
    if (dto.published !== undefined) payload.published = dto.published;
    if (dto.cover_url !== undefined) payload.cover_url = dto.cover_url;

    const { error } = await this.supabase.adminClient
      .from('posts')
      .update(payload)
      .eq('id', id);

    throwOnError(error, `Post ${id} not found`);

    if (dto.translations?.length) {
      await this.upsertTranslations(id, dto.translations);
    }

    // Orphan GC: always run against the full translation set so saves that
    // don't touch translations (e.g. cover-only saves) still clean up dirty
    // post_media rows and orphan storage files.
    await this.purgeOrphanedMedia(id, dto.translations ?? null);

    // Cover cleanup: if cover_url was explicitly set to null and an old file existed,
    // delete the storage object (uploadCover handles replacement; this handles removal).
    if (dto.cover_url === null && oldCoverUrl) {
      await this.mediaService.deleteCoverFromStorage(id);
    }

    const result = await this.findOneAdmin(id);
    try { await this.webhook.triggerRevalidation(id); } catch { /* never block the response */ }
    return result;
  }

  private async purgeOrphanedMedia(
    postId: number,
    incomingTranslations: TranslationUpsertItem[] | null,
  ): Promise<void> {
    // When the DTO doesn't include translations (e.g. cover-only save), fetch
    // the current translation contents from the DB so GC still runs.
    const translationContents: string[] = incomingTranslations?.length
      ? incomingTranslations.map((t) => t.contents)
      : await this.supabase.adminClient
          .from('post_translations')
          .select('contents')
          .eq('post_id', postId)
          .then(({ data }) => ((data as { contents: string }[] | null) ?? []).map((r) => r.contents));

    const referencedUrls = new Set(
      translationContents.flatMap((c) => extractImageUrls(c)),
    );
    // 1. Delete storage files no longer referenced in any translation.
    await this.mediaService.purgeOrphanStorageFiles(postId, referencedUrls);
    // 2. Remove post_media rows whose URL IS embedded inline in the markdown.
    //    These were inserted by the old uploadMediaFile() bug and would otherwise
    //    render as a duplicate gallery section below the post body.
    await this.purgeInlinePostMediaRows(postId, referencedUrls);
  }

  private async purgeInlinePostMediaRows(
    postId: number,
    inlineUrls: Set<string>,
  ): Promise<void> {
    if (!inlineUrls.size) return;
    // adminClient bypasses RLS — works for both published and unpublished posts.
    await this.supabase.adminClient
      .from('post_media')
      .delete()
      .eq('post_id', postId)
      .in('url', [...inlineUrls]);
  }

  async remove(id: number): Promise<void> {
    const { error } = await this.supabase.adminClient
      .from('posts')
      .delete()
      .eq('id', id);

    throwOnError(error);
    try { await this.webhook.triggerRevalidation(id); } catch { /* never block the response */ }
  }

  private async upsertTranslations(
    postId: number,
    translations: TranslationUpsertItem[],
  ): Promise<void> {
    const rows = translations.map((t) => ({
      post_id: postId,
      lang: t.lang,
      title: t.title,
      contents: t.contents,
    }));

    const { error } = await this.supabase.adminClient
      .from('post_translations')
      .upsert(rows, { onConflict: 'post_id,lang' });

    if (error) {
      throw new BadRequestException(`Translation upsert failed: ${error.message}`);
    }
  }
}
