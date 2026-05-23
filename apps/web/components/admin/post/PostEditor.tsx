"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Country, Lang } from "@repo/types";
import { MarkdownRenderer } from "@/components/client/MarkdownRenderer";
import { ImagePlusIcon } from "@/components/icons";
import { usePostEditor, type TranslationState } from "@/lib/hooks/usePostEditor";
import { PostEditorToolbar } from "./PostEditorToolbar";

const RichTextEditor = dynamic(
  () => import("../editor/RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false },
);

export interface PostEditorProps {
  /** undefined → create mode; number → edit mode */
  postId?: number;
  initialCountryCode?: string;
  initialPublished?: boolean;
  initialCoverUrl?: string | null;
  initialTranslations?: Partial<Record<Lang, TranslationState>>;
  countries: Country[];
}

export function PostEditor(props: PostEditorProps) {
  const ed = usePostEditor(props);
  const editorToolbarRef = useRef<HTMLDivElement>(null);
  const translation = ed.getTranslation(ed.activeLang);
  const displayTitle = translation.title || "Untitled";

  return (
    <div className="min-h-screen bg-muted-100 flex justify-center">
      <div className="max-w-200 w-full bg-surface min-h-screen flex flex-col">

        <PostEditorToolbar
          activeLang={ed.activeLang}
          onLangChange={ed.setActiveLang}
          countryCode={ed.countryCode}
          onCountryChange={ed.setCountryCode}
          countries={props.countries}
          published={ed.published}
          onPublishedToggle={() => ed.setPublished((p) => !p)}
          isPreview={ed.isPreview}
          onPreviewToggle={() => ed.setIsPreview((p) => !p)}
          isSaving={ed.isSaving}
          isDeleting={ed.isDeleting}
          isEditMode={ed.isEditMode}
          postId={ed.postId}
          onSave={ed.handleSave}
          onDelete={ed.handleDelete}
        />

        {/* Sticky editor toolbar slot — EditorToolbar portals into here */}
        <div
          ref={editorToolbarRef}
          className="sticky top-[57px] z-10 bg-surface border-b border-muted-200 empty:hidden"
        />

        <article className="flex-1">
          {ed.isPreview ? (
            ed.coverUrl ? (
              <div className="relative aspect-[16/9] overflow-hidden bg-muted-200">
                <Image src={ed.coverUrl} alt={displayTitle} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <header className="absolute bottom-0 left-0 p-6">
                  <h1 className="text-h2 font-bold text-white leading-editorial-snug">
                    {ed.flagFor(ed.countryCode)} {displayTitle}
                  </h1>
                </header>
              </div>
            ) : (
              <header className="px-5 pt-8 pb-4">
                <h1 className="text-h2 font-bold text-primary-900 leading-editorial-snug">
                  {ed.flagFor(ed.countryCode)} {displayTitle}
                </h1>
              </header>
            )
          ) : (
            <>
              {ed.coverUrl ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-muted-200 group">
                  <Image src={ed.coverUrl} alt={displayTitle} fill className="object-cover" priority />
                  {ed.isUploadingCover && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                    <button
                      type="button"
                      onClick={() => ed.coverInputRef.current?.click()}
                      className="bg-white/90 text-primary-900 text-caption px-3 py-1.5 rounded-sm hover:bg-white transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => ed.setCoverUrl(null)}
                      className="bg-white/90 text-red-600 text-caption px-3 py-1.5 rounded-sm hover:bg-white transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => ed.coverInputRef.current?.click()}
                  className="aspect-[16/9] bg-muted-100 border-b border-muted-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted-200 transition-colors"
                >
                  <ImagePlusIcon className="text-muted-400" />
                  <span className="text-caption text-secondary-400">Click to add cover image</span>
                </div>
              )}

              <header className="px-5 pt-8 pb-4">
                <input
                  value={translation.title}
                  onChange={(e) => ed.setTranslationField(ed.activeLang, "title", e.target.value)}
                  placeholder="Post title"
                  className="w-full text-h2 font-bold text-primary-900 leading-editorial-snug bg-transparent border-0 border-b border-muted-200 focus:outline-none focus:border-primary-400 placeholder:text-muted-300 transition-colors pb-1"
                />
              </header>
            </>
          )}

          <input
            ref={ed.coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) ed.handleCoverFile(f); e.target.value = ""; }}
          />

          <div className="px-5 py-8">
            {ed.isPreview ? (
              <MarkdownRenderer content={translation.contents} />
            ) : (
              <RichTextEditor
                value={translation.contents}
                onChange={(md) => ed.setTranslationField(ed.activeLang, "contents", md)}
                postId={ed.postId}
                placeholder="Write here…"
                toolbarContainerRef={editorToolbarRef}
              />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
