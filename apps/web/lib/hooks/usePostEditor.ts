"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/components/admin/Toast";

export interface TranslationState {
  title: string;
  contents: string;
}

interface UsePostEditorOptions {
  initialPostId?: number;
  initialCountryCode?: string;
  initialPublished?: boolean;
  initialCoverUrl?: string | null;
  initialMedia?: PostMedia[];
  initialTranslations?: Partial<Record<Lang, TranslationState>>;
  countries: Country[];
}

/**
 * Encapsulates all state and async handlers for the PostEditor page.
 * The component itself handles only rendering.
 */
export function usePostEditor({
  initialPostId,
  initialCountryCode = "",
  initialPublished = false,
  initialCoverUrl = null,
  initialMedia = [],
  initialTranslations = {},
  countries,
}: UsePostEditorOptions) {
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

  function getTranslation(lang: Lang): TranslationState {
    return translations[lang] ?? { title: "", contents: "" };
  }

  function setTranslationField(lang: Lang, field: keyof TranslationState, value: string) {
    const current = translations[lang] ?? { title: "", contents: "" };
    setTranslations((prev) => ({ ...prev, [lang]: { ...current, [field]: value } }));
  }

  function flagFor(code: string) {
    return countries.find((c) => c.code === code)?.flag_url ?? "";
  }

  function buildTranslationItems() {
    return (Object.entries(translations) as [Lang, TranslationState][])
      .filter(([, t]) => t.title.trim() && t.contents.trim())
      .map(([lang, t]) => ({ lang, title: t.title, contents: t.contents }));
  }

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

  function handleMediaWidthChange(id: number, width: number) {
    setMedia((prev) => prev.map((x) => (x.id === id ? { ...x, width } : x)));
  }

  return {
    postId,
    activeLang,
    setActiveLang,
    countryCode,
    setCountryCode,
    published,
    setPublished,
    isPreview,
    setIsPreview,
    coverUrl,
    setCoverUrl,
    isUploadingCover,
    media,
    isAddingMedia,
    setIsAddingMedia,
    mediaUrl,
    setMediaUrl,
    mediaCaption,
    setMediaCaption,
    isSaving,
    isDeleting,
    isEditMode,
    coverInputRef,
    mediaFileRef,
    getTranslation,
    flagFor,
    setTranslationField,
    handleCoverFile,
    handleSave,
    handleDelete,
    handleAddMediaUrl,
    handleMediaFile,
    handleDeleteMedia,
    handleMediaWidthChange,
  };
}
