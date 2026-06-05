"use client";

import Link from "next/link";
import type { Country, Lang } from "@repo/types";
import { BackArrowIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

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
    <div className="sticky top-0 z-20 bg-surface border-b border-muted-200 flex flex-wrap items-center gap-2 px-5 py-2.5">
      {/* Left group: Back + Lang tabs — always row 1 */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/posts"
          className="flex items-center justify-center w-9 h-9 text-secondary-400 hover:text-primary-900 hover:bg-muted-100 rounded-sm transition-colors"
          aria-label="Back to posts"
        >
          <BackArrowIcon />
        </Link>

        <div className="w-px h-5 bg-muted-200" />

        {LANGS.map((l) => (
          <Button
            key={l.code}
            variant={activeLang === l.code ? "primary" : "ghost"}
            size="sm"
            onClick={() => onLangChange(l.code)}
            className={activeLang !== l.code ? "text-secondary-500 hover:text-primary-900" : undefined}
          >
            {l.label}
          </Button>
        ))}
      </div>

      {/* Middle group: Country + Published — row 2 on mobile, inline on sm+ */}
      <div className="flex items-center gap-2 order-last w-full sm:order-none sm:w-auto">
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

        <Button
          variant="outline"
          size="sm"
          onClick={onPublishedToggle}
          className={published ? "border-accent-400 bg-accent-50 text-accent-700" : "text-secondary-500 hover:border-muted-400"}
        >
          {published ? "● Published" : "○ Draft"}
        </Button>
      </div>

      {/* Right group: Preview + Save + Delete — always row 1, pushed to far right */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviewToggle}
          className="text-secondary-500 hover:text-primary-900"
        >
          {isPreview ? "Edit" : "Preview"}
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving…" : isEditMode ? "Save" : "Create"}
        </Button>

        {isEditMode && postId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={isDeleting}
            aria-label="Delete post"
            className="text-secondary-400 hover:text-red-600"
          >
            <TrashIcon />
          </Button>
        )}
      </div>
    </div>
  );
}
