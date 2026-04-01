"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Country, Lang, PostMedia } from "@repo/types";
import {
  createPost,
  updatePost,
  deletePost,
  uploadCover,
  uploadMediaFile,
  addMedia,
  deleteMedia,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/types";
import { MarkdownRenderer } from "@/components/public/MarkdownRenderer";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useToast } from "@/components/admin/Toast";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TranslationState {
  title: string;
  contents: string;
}

export interface PostEditorProps {
  /** undefined → create mode; number → edit mode */
  postId?: number;
  initialCountryCode?: string;
  initialPublished?: boolean;
  initialCoverUrl?: string | null;
  initialMedia?: PostMedia[];
  initialTranslations?: Partial<Record<Lang, TranslationState>>;
  countries: Country[];
}

const LANGS: { code: Lang; label: string }[] = [
  { code: "ko", label: "KO" },
  { code: "en", label: "EN" },
];

// ---------------------------------------------------------------------------
// PostEditor
// ---------------------------------------------------------------------------

export function PostEditor({
  postId: initialPostId,
  initialCountryCode = "",
  initialPublished = false,
  initialCoverUrl = null,
  initialMedia = [],
  initialTranslations = {},
  countries,
}: PostEditorProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const isEditMode = initialPostId !== undefined;

  // Mutable post id — becomes set after first save in create mode
  const [postId, setPostId] = useState<number | undefined>(initialPostId);

  // Toolbar state
  const [activeLang, setActiveLang] = useState<Lang>("ko");
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [published, setPublished] = useState(initialPublished);
  const [isPreview, setIsPreview] = useState(false);

  // Cover
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl ?? null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Translations
  const [translations, setTranslations] = useState<Partial<Record<Lang, TranslationState>>>(
    initialTranslations,
  );

  // Media
  const [media, setMedia] = useState<PostMedia[]>(initialMedia);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const mediaFileRef = useRef<HTMLInputElement>(null);

  // Action states
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function getTranslation(lang: Lang): TranslationState {
    return translations[lang] ?? { title: "", contents: "" };
  }

  function setTranslationField(lang: Lang, field: keyof TranslationState, value: string) {
    const current = translations[lang] ?? { title: "", contents: "" };
    setTranslations((prev) => ({ ...prev, [lang]: { ...current, [field]: value } }));
  }

  function buildTranslationItems() {
    return (Object.entries(translations) as [Lang, TranslationState][])
      .filter(([, t]) => t.title.trim() && t.contents.trim())
      .map(([lang, t]) => ({ lang, title: t.title, contents: t.contents }));
  }

  function activeTitle() {
    return getTranslation(activeLang).title;
  }

  function flagFor(code: string) {
    return countries.find((c) => c.code === code)?.flag_url ?? "";
  }

  // ---------------------------------------------------------------------------
  // Cover upload
  // ---------------------------------------------------------------------------

  async function handleCoverFile(file: File) {
    if (!postId) {
      showToast("Save the post first, then upload a cover.", "error");
      return;
    }
    setIsUploadingCover(true);
    const local = URL.createObjectURL(file);
    setCoverUrl(local);
    try {
      const { url } = await uploadCover(postId, file);
      setCoverUrl(url);
    } catch {
      setCoverUrl(coverUrl);
      showToast("Cover upload failed", "error");
    } finally {
      setIsUploadingCover(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  async function handleSave() {
    if (!countryCode) {
      showToast("Please select a country first.", "error");
      return;
    }
    setIsSaving(true);
    try {
      const translationItems = buildTranslationItems();
      if (postId) {
        await updatePost(postId, {
          country_code: countryCode,
          published,
          cover_url: coverUrl,
          translations: translationItems,
        });
        showToast("Saved!", "success");
      } else {
        const post = await createPost({
          country_code: countryCode,
          published,
          translations: translationItems,
        });
        setPostId(post.id);
        showToast("Post created!", "success");
        router.replace(`/admin/posts/${post.id}`);
      }
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  async function handleDelete() {
    if (!postId) return;
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

  // ---------------------------------------------------------------------------
  // Media
  // ---------------------------------------------------------------------------

  async function handleAddMediaUrl() {
    if (!postId || !mediaUrl.trim()) return;
    try {
      const added = await addMedia(postId, {
        type: "embed",
        url: mediaUrl.trim(),
        caption: mediaCaption.trim() || undefined,
      });
      setMedia((prev) => [...prev, added]);
      setMediaUrl("");
      setMediaCaption("");
      setIsAddingMedia(false);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to add media", "error");
    }
  }

  async function handleMediaFile(file: File) {
    if (!postId) {
      showToast("Save the post first, then add media.", "error");
      return;
    }
    try {
      const { url } = await uploadMediaFile(postId, file);
      const added = await addMedia(postId, { type: "image", url });
      setMedia((prev) => [...prev, added]);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to upload media", "error");
    }
  }

  async function handleDeleteMedia(mediaId: number) {
    if (!postId) return;
    try {
      await deleteMedia(postId, mediaId);
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to delete media", "error");
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const translation = getTranslation(activeLang);
  const displayTitle = translation.title || "Untitled";

  return (
    <div className="min-h-screen bg-muted-100 flex justify-center">
      <div className="max-w-200 w-full bg-surface min-h-screen flex flex-col">

        {/* ── Top toolbar ────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-20 bg-surface border-b border-muted-200 flex items-center gap-2 px-5 py-2.5">
          {/* Back */}
          <Link
            href="/admin/posts"
            className="flex items-center justify-center w-9 h-9 text-secondary-400 hover:text-primary-900 hover:bg-muted-100 rounded-sm transition-colors"
            aria-label="Back to posts"
          >
            <BackArrowIcon />
          </Link>

          <div className="w-px h-5 bg-muted-200 mx-0.5" />

          {/* Lang tabs */}
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code)}
              className={cn(
                "h-8 px-3 text-caption font-medium rounded-sm transition-colors",
                activeLang === l.code
                  ? "bg-primary-900 text-white"
                  : "text-secondary-500 hover:bg-muted-100 hover:text-primary-900",
              )}
            >
              {l.label}
            </button>
          ))}

          <div className="w-px h-5 bg-muted-200 mx-0.5" />

          {/* Country select */}
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="h-8 px-2 text-caption border border-muted-300 rounded-sm bg-surface text-primary-900 focus:outline-none focus:border-primary-400 transition-colors"
          >
            <option value="">Country…</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag_url} {c.name_en}
              </option>
            ))}
          </select>

          {/* Published toggle */}
          <button
            type="button"
            onClick={() => setPublished((p) => !p)}
            className={cn(
              "h-8 px-3 text-caption rounded-sm border transition-colors",
              published
                ? "border-accent-400 bg-accent-50 text-accent-700"
                : "border-muted-300 text-secondary-500 hover:border-muted-400",
            )}
          >
            {published ? "● Published" : "○ Draft"}
          </button>

          <div className="flex-1" />

          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setIsPreview((p) => !p)}
            className="h-8 px-3 text-caption border border-muted-300 rounded-sm text-secondary-500 hover:bg-muted-100 hover:text-primary-900 transition-colors"
          >
            {isPreview ? "Edit" : "Preview"}
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 px-4 text-caption font-medium bg-primary-900 text-white rounded-sm hover:bg-primary-800 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving…" : isEditMode ? "Save" : "Create"}
          </button>

          {/* Delete (edit mode only) */}
          {isEditMode && postId && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center justify-center w-9 h-9 text-secondary-400 hover:text-red-600 hover:bg-muted-100 rounded-sm transition-colors disabled:opacity-50"
              aria-label="Delete post"
            >
              <TrashIcon />
            </button>
          )}
        </div>

        {/* ── Article body ───────────────────────────────────────────────── */}
        <article className="flex-1">

          {/* ── PREVIEW MODE: looks exactly like public view ── */}
          {isPreview ? (
            coverUrl ? (
              <div className="relative aspect-[16/9] overflow-hidden bg-muted-200">
                <Image src={coverUrl} alt={displayTitle} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <header className="absolute bottom-0 left-0 p-6">
                  <h1 className="text-h2 font-bold text-white leading-editorial-snug">
                    {flagFor(countryCode)} {displayTitle}
                  </h1>
                </header>
              </div>
            ) : (
              <header className="px-5 pt-8 pb-4">
                <h1 className="text-h2 font-bold text-primary-900 leading-editorial-snug">
                  {flagFor(countryCode)} {displayTitle}
                </h1>
              </header>
            )
          ) : (
            /* ── EDIT MODE: cover and title are always separate sections ── */
            <>
              {/* Cover section */}
              {coverUrl ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-muted-200 group">
                  <Image src={coverUrl} alt={displayTitle} fill className="object-cover" priority />
                  {isUploadingCover && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {/* Hover controls */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="bg-white/90 text-primary-900 text-caption px-3 py-1.5 rounded-sm hover:bg-white transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverUrl(null)}
                      className="bg-white/90 text-red-600 text-caption px-3 py-1.5 rounded-sm hover:bg-white transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="aspect-[16/9] bg-muted-100 border-b border-muted-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted-200 transition-colors"
                >
                  <ImagePlusIcon />
                  <span className="text-caption text-secondary-400">Click to add cover image</span>
                </div>
              )}

              {/* Title section — always below cover in edit mode */}
              <header className="px-5 pt-8 pb-4">
                <input
                  value={translation.title}
                  onChange={(e) => setTranslationField(activeLang, "title", e.target.value)}
                  placeholder="Post title"
                  className="w-full text-h2 font-bold text-primary-900 leading-editorial-snug bg-transparent border-0 border-b border-muted-200 focus:outline-none focus:border-primary-400 placeholder:text-muted-300 transition-colors pb-1"
                />
              </header>
            </>
          )}

          {/* Hidden file input */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCoverFile(file);
              e.target.value = "";
            }}
          />

          {/* Content area */}
          <div className="px-5 py-8">
            {isPreview ? (
              <MarkdownRenderer content={translation.contents} />
            ) : (
              <RichTextEditor
                value={translation.contents}
                onChange={(md) => setTranslationField(activeLang, "contents", md)}
                postId={postId}
                placeholder="Write here…"
              />
            )}
          </div>

          {/* ── Media section ─────────────────────────────────────────── */}
          <div className="px-5 pb-12 space-y-6">
            {/* Existing media */}
            {media.map((m) => (
              <div key={m.id} className="relative group">
                {m.type === "image" && (
                  <div className="overflow-hidden bg-muted-200 relative aspect-[4/3]">
                    <Image
                      src={m.url}
                      alt={m.alt_text ?? ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {m.type === "embed" && (
                  <iframe
                    src={m.url}
                    className="w-full aspect-video"
                    allowFullScreen
                    title={m.alt_text ?? "Embedded content"}
                  />
                )}
                {m.caption && (
                  <p className="mt-2 text-caption text-secondary-400 text-center">
                    {m.caption}
                  </p>
                )}
                {/* Delete overlay */}
                <button
                  type="button"
                  onClick={() => handleDeleteMedia(m.id)}
                  className="absolute top-2 right-2 bg-primary-900/70 text-white text-caption px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add media controls */}
            {postId ? (
              <div className="border border-dashed border-muted-300 rounded-sm p-4 space-y-3">
                <p className="text-caption text-secondary-400 font-medium uppercase tracking-wide">
                  Add Media
                </p>

                {isAddingMedia ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="Embed URL (YouTube, etc.)"
                      className="w-full h-9 px-3 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors"
                    />
                    <input
                      type="text"
                      value={mediaCaption}
                      onChange={(e) => setMediaCaption(e.target.value)}
                      placeholder="Caption (optional)"
                      className="w-full h-9 px-3 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddMediaUrl}
                        className="h-8 px-4 text-caption font-medium bg-primary-900 text-white rounded-sm hover:bg-primary-800 transition-colors"
                      >
                        Add Embed
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsAddingMedia(false); setMediaUrl(""); setMediaCaption(""); }}
                        className="h-8 px-3 text-caption text-secondary-500 hover:text-primary-900 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => mediaFileRef.current?.click()}
                      className="h-8 px-4 text-caption border border-muted-300 rounded-sm text-secondary-600 hover:bg-muted-100 transition-colors"
                    >
                      Upload Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingMedia(true)}
                      className="h-8 px-4 text-caption border border-muted-300 rounded-sm text-secondary-600 hover:bg-muted-100 transition-colors"
                    >
                      Add Embed URL
                    </button>
                  </div>
                )}

                <input
                  ref={mediaFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMediaFile(file);
                    e.target.value = "";
                  }}
                />
              </div>
            ) : (
              <p className="text-caption text-secondary-300 text-center py-4">
                Save the post first to add media and a cover image.
              </p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function ImagePlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-muted-400"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
