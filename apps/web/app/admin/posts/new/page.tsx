"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Country } from "@repo/types";
import { createPost } from "@/lib/api/admin";
import { getCountries } from "@/lib/api/countries";
import { ApiError } from "@/lib/api/types";
import { Button } from "@/components/ui";
import { H2, BodySm } from "@/components/ui/typography";
import { PostFormFields } from "@/components/admin/PostFormFields";
import { TranslationEditor, type TranslationsMap } from "@/components/admin/TranslationEditor";
import { useToast } from "@/components/admin/Toast";

export default function NewPostPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [countries, setCountries] = useState<Country[]>([]);
  const [countryCode, setCountryCode] = useState("");
  const [published, setPublished] = useState(false);
  const [translations, setTranslations] = useState<TranslationsMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCountries().then(setCountries).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!countryCode) {
      setError("Please select a country.");
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const translationItems = (Object.entries(translations) as [string, { title: string; contents: string }][])
        .filter(([, t]) => t.title.trim())
        .map(([lang, t]) => ({ lang: lang as "ko" | "en", title: t.title, contents: t.contents }));

      const post = await createPost({ country_code: countryCode, published, translations: translationItems });
      showToast("Post created!", "success");
      router.push(`/admin/posts/${post.id}`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create post";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-secondary-500 hover:text-primary-900 transition-colors"
          aria-label="Go back"
        >
          ←
        </button>
        <H2>New Post</H2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PostFormFields
          countryCode={countryCode}
          published={published}
          countries={countries}
          onCountryChange={setCountryCode}
          onPublishedChange={setPublished}
        />

        <TranslationEditor value={translations} onChange={setTranslations} />

        {error && <BodySm className="text-red-600">{error}</BodySm>}

        <div className="flex gap-3">
          <Button type="submit" variant="primary" loading={isSaving}>
            Create Post
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
