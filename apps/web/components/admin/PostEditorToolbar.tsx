"use client";

import Link from "next/link";
import type { Country, Lang } from "@repo/types";
import { cn } from "@/lib/utils";
import { BackArrowIcon, TrashIcon } from "@/components/icons";

const LANGS: { code: Lang; label: string }[] = [
  { code: "ko", label: "KO" },
  { code: "en", label: "EN" },
];

interface PostEditorToolbarProps {
  activeLang: Lang;
  onLangChange: (lang: Lang) => void;
  countryCode: string;
  onCountryChange: (code: string) => void;
  countries: Country[];
  published: boolean;
  onPublishedToggle: () => void;
  isPreview: boolean;
  onPreviewToggle: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  isEditMode: boolean;
  postId: number | undefined;
  onSave: () => void;
  onDelete: () => void;
}

export function PostEditorToolbar({
  activeLang,
  onLangChange,
  countryCode,
  onCountryChange,
  countries,
  published,
  onPublishedToggle,
  isPreview,
  onPreviewToggle,
  isSaving,
  isDeleting,
  isEditMode,
  postId,
  onSave,
  onDelete,
}: PostEditorToolbarProps) {
  return (
    <div className="sticky top-0 z-20 bg-surface border-b border-muted-200 flex items-center gap-2 px-5 py-2.5">
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
          onClick={() => onLangChange(l.code)}
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
        onChange={(e) => onCountryChange(e.target.value)}
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
        onClick={onPublishedToggle}
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
        onClick={onPreviewToggle}
        className="h-8 px-3 text-caption border border-muted-300 rounded-sm text-secondary-500 hover:bg-muted-100 hover:text-primary-900 transition-colors"
      >
        {isPreview ? "Edit" : "Preview"}
      </button>

      {/* Save */}
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="h-8 px-4 text-caption font-medium bg-primary-900 text-white rounded-sm hover:bg-primary-800 disabled:opacity-50 transition-colors"
      >
        {isSaving ? "Saving…" : isEditMode ? "Save" : "Create"}
      </button>

      {/* Delete (edit mode only) */}
      {isEditMode && postId && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center justify-center w-9 h-9 text-secondary-400 hover:text-red-600 hover:bg-muted-100 rounded-sm transition-colors disabled:opacity-50"
          aria-label="Delete post"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
