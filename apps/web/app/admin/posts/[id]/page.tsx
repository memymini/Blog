"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Country, PostMedia } from "@repo/types";
import { getAdminPost, updatePost, deletePost } from "@/lib/api/admin";
import { getCountries } from "@/lib/api/countries";
import { ApiError } from "@/lib/api/types";
import { Button } from "@/components/ui";
import { H2, BodySm } from "@/components/ui/typography";
import { PostFormFields } from "@/components/admin/PostFormFields";
import { TranslationEditor, type TranslationsMap } from "@/components/admin/TranslationEditor";
import { CoverUploader } from "@/components/admin/CoverUploader";
import { MediaManager } from "@/components/admin/MediaManager";
import { useToast } from "@/components/admin/Toast";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const { showToast } = useToast();

  const [countries, setCountries] = useState<Country[]>([]);
  const [countryCode, setCountryCode] = useState("");
  const [published, setPublished] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [media, setMedia] = useState<PostMedia[]>([]);
  const [translations, setTranslations] = useState<TranslationsMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    try {
      const [post, countryList] = await Promise.all([
        getAdminPost(postId),
        getCountries(),
      ]);
      setCountries(countryList);
      setCountryCode(post.country_code);
      setPublished(post.published);
      setCoverUrl(post.cover_url);
      setMedia(post.media);

      const map: TranslationsMap = {};
      for (const t of post.translations) {
        map[t.lang] = { title: t.title, contents: t.contents };
      }
      setTranslations(map);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load post");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const translationItems = (Object.entries(translations) as [string, { title: string; contents: string }][])
        .filter(([, t]) => t.title.trim())
        .map(([lang, t]) => ({ lang: lang as "ko" | "en", title: t.title, contents: t.contents }));

      await updatePost(postId, {
        country_code: countryCode,
        published,
        cover_url: coverUrl,
        translations: translationItems,
      });
      showToast("Saved!", "success");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Save failed";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deletePost(postId);
      showToast("Post deleted", "success");
      router.push("/admin/posts");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Delete failed", "error");
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted-200 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="text-secondary-500 hover:text-primary-900 transition-colors"
            aria-label="Back to posts"
          >
            ←
          </button>
          <H2>Edit Post #{postId}</H2>
        </div>
        <Button
          variant="danger"
          size="sm"
          loading={isDeleting}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <PostFormFields
          countryCode={countryCode}
          published={published}
          countries={countries}
          onCountryChange={setCountryCode}
          onPublishedChange={setPublished}
        />

        <CoverUploader
          postId={postId}
          currentUrl={coverUrl}
          onUploaded={setCoverUrl}
        />

        <TranslationEditor value={translations} onChange={setTranslations} />

        <MediaManager postId={postId} media={media} onChange={setMedia} />

        {error && <BodySm className="text-red-600">{error}</BodySm>}

        <div className="flex gap-3 pb-8">
          <Button type="submit" variant="primary" loading={isSaving}>
            Save Changes
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/posts")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
