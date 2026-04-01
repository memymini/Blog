"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import type { Country, Lang, PostMedia } from "@repo/types";
import { getAdminPost } from "@/lib/api/admin";
import { getCountries } from "@/lib/api/countries";
import { ApiError } from "@/lib/api/types";
import { PostEditor } from "@/components/admin/PostEditor";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);

  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial values for PostEditor
  const [initialCountryCode, setInitialCountryCode] = useState("");
  const [initialPublished, setInitialPublished] = useState(false);
  const [initialCoverUrl, setInitialCoverUrl] = useState<string | null>(null);
  const [initialMedia, setInitialMedia] = useState<PostMedia[]>([]);
  const [initialTranslations, setInitialTranslations] = useState<
    Partial<Record<Lang, { title: string; contents: string }>>
  >({});

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [post, countryList] = await Promise.all([getAdminPost(postId), getCountries()]);
      setCountries(countryList);
      setInitialCountryCode(post.country_code);
      setInitialPublished(post.published);
      setInitialCoverUrl(post.cover_url);
      setInitialMedia(post.media);

      const map: Partial<Record<Lang, { title: string; contents: string }>> = {};
      for (const t of post.translations) {
        map[t.lang as Lang] = { title: t.title, contents: t.contents };
      }
      setInitialTranslations(map);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load post");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted-100 flex justify-center">
        <div className="max-w-200 w-full bg-surface min-h-screen">
          <div className="h-14 border-b border-muted-200 bg-surface animate-pulse" />
          <div className="aspect-[16/9] bg-muted-200 animate-pulse" />
          <div className="px-5 py-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted-200 rounded animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted-100 flex items-center justify-center">
        <p className="text-body-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <PostEditor
      postId={postId}
      initialCountryCode={initialCountryCode}
      initialPublished={initialPublished}
      initialCoverUrl={initialCoverUrl}
      initialMedia={initialMedia}
      initialTranslations={initialTranslations}
      countries={countries}
    />
  );
}
