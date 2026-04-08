"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
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
import { useToast } from "@/components/admin/Toast";
import { ImagePlusIcon } from "@/components/icons";
import { PostEditorToolbar } from "@/components/admin/PostEditorToolbar";
import { MediaItem } from "@/components/admin/MediaItem";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false },
);

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

  const [postId, setPostId] = useState<number | undefined>(initialPostId);
  const [activeLang, setActiveLang] = useState<Lang>("ko");
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [published, setPublished] = useState(initialPublished);
  const [isPreview, setIsPreview] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl ?? null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [translations, setTranslations] = useState<Partial<Record<Lang, TranslationState>>>(initialTranslations);
  const [media, setMedia] = useState<PostMedia[]>(initialMedia);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const mediaFileRef = useRef<HTMLInputElement>(null);

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

  function flagFor(code: string) {
    return countries.find((c) => c.code === code)?.flag_url ?? "";
  }

  // ---------------------------------------------------------------------------
  // Handlers
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

  async function handleSave() {
    if (!countryCode) {
      showToast("Please select a country first.", "error");
      return;
    }
    setIsSaving(true);
    try {
      const translationItems = buildTranslationItems();
      if (postId) {
        await updatePost(postId, { country_code: countryCode, published, cover_url: coverUrl, translations: translationItems });
        showToast("Saved!", "success");
      } else {
        const post = await createPost({ country_code: countryCode, published, translations: translationItems });
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

  async function handleAddMediaUrl() {
    if (!postId || !mediaUrl.trim()) return;
    try {
      const added = await addMedia(postId, { type: "embed", url: mediaUrl.trim(), caption: mediaCaption.trim() || undefined });
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
      const type = file.type.startsWith("video/") ? "video" : "image";
      const added = await addMedia(postId, { type, url });
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

        <PostEditorToolbar
          activeLang={activeLang}
          onLangChange={setActiveLang}
          countryCode={countryCode}
          onCountryChange={setCountryCode}
          countries={countries}
          published={published}
          onPublishedToggle={() => setPublished((p) => !p)}
          isPreview={isPreview}
          onPreviewToggle={() => setIsPreview((p) => !p)}
          isSaving={isSaving}
          isDeleting={isDeleting}
          isEditMode={isEditMode}
          postId={postId}
          onSave={handleSave}
          onDelete={handleDelete}
        />

        <article className="flex-1">
          {/* Preview mode */}
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
            /* Edit mode */
            <>
              {coverUrl ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-muted-200 group">
                  <Image src={coverUrl} alt={displayTitle} fill className="object-cover" priority />
                  {isUploadingCover && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                    <button type="button" onClick={() => coverInputRef.current?.click()} className="bg-white/90 text-primary-900 text-caption px-3 py-1.5 rounded-sm hover:bg-white transition-colors">
                      Change
                    </button>
                    <button type="button" onClick={() => setCoverUrl(null)} className="bg-white/90 text-red-600 text-caption px-3 py-1.5 rounded-sm hover:bg-white transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={() => coverInputRef.current?.click()} className="aspect-[16/9] bg-muted-100 border-b border-muted-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted-200 transition-colors">
                  <ImagePlusIcon className="text-muted-400" />
                  <span className="text-caption text-secondary-400">Click to add cover image</span>
                </div>
              )}

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

          <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverFile(f); e.target.value = ""; }}
          />

          {/* Content */}
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

          {/* Media section */}
          <div className="px-5 pb-12 space-y-6">
            {media.map((m) => (
              <MediaItem
                key={m.id}
                item={m}
                postId={postId!}
                onWidthChange={(id, width) => setMedia((prev) => prev.map((x) => (x.id === id ? { ...x, width } : x)))}
                onDelete={handleDeleteMedia}
              />
            ))}

            {postId ? (
              <div className="border border-dashed border-muted-300 rounded-sm p-4 space-y-3">
                <p className="text-caption text-secondary-400 font-medium uppercase tracking-wide">Add Media</p>

                {isAddingMedia ? (
                  <div className="space-y-2">
                    <input type="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Embed URL (YouTube, etc.)" className="w-full h-9 px-3 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors" />
                    <input type="text" value={mediaCaption} onChange={(e) => setMediaCaption(e.target.value)} placeholder="Caption (optional)" className="w-full h-9 px-3 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors" />
                    <div className="flex gap-2">
                      <button type="button" onClick={handleAddMediaUrl} className="h-8 px-4 text-caption font-medium bg-primary-900 text-white rounded-sm hover:bg-primary-800 transition-colors">Add Embed</button>
                      <button type="button" onClick={() => { setIsAddingMedia(false); setMediaUrl(""); setMediaCaption(""); }} className="h-8 px-3 text-caption text-secondary-500 hover:text-primary-900 transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => mediaFileRef.current?.click()} className="h-8 px-4 text-caption border border-muted-300 rounded-sm text-secondary-600 hover:bg-muted-100 transition-colors">Upload Image / Video</button>
                    <button type="button" onClick={() => setIsAddingMedia(true)} className="h-8 px-4 text-caption border border-muted-300 rounded-sm text-secondary-600 hover:bg-muted-100 transition-colors">Add Embed URL</button>
                  </div>
                )}

                <input ref={mediaFileRef} type="file" accept="image/*,video/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMediaFile(f); e.target.value = ""; }}
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
