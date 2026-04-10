"use client";

import { useState } from "react";
import type { Lang } from "@repo/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

export interface TranslationState {
  title: string;
  contents: string;
}

export type TranslationsMap = Partial<Record<Lang, TranslationState>>;

interface TranslationEditorProps {
  value: TranslationsMap;
  onChange: (value: TranslationsMap) => void;
}

const LANGS: { code: Lang; label: string }[] = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
];

export function TranslationEditor({ value, onChange }: TranslationEditorProps) {
  const [activeTab, setActiveTab] = useState<Lang>("ko");

  function handleField(lang: Lang, field: keyof TranslationState, text: string) {
    const current = value[lang] ?? { title: "", contents: "" };
    onChange({ ...value, [lang]: { ...current, [field]: text } });
  }

  const translation = value[activeTab] ?? { title: "", contents: "" };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {LANGS.map((l) => (
          <Button
            key={l.code}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveTab(l.code)}
            className={cn(
              activeTab === l.code && "bg-muted-100 border-muted-400",
            )}
          >
            {l.label}
          </Button>
        ))}
      </div>

      {/* Title */}
      <div className="mb-3">
        <label className="block text-label text-secondary-600 mb-1">
          Title
        </label>
        <input
          type="text"
          value={translation.title}
          onChange={(e) => handleField(activeTab, "title", e.target.value)}
          placeholder="Post title…"
          className="w-full h-10 px-3 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors"
        />
      </div>

      {/* Contents */}
      <div>
        <label className="block text-label text-secondary-600 mb-1">
          Content (Markdown)
        </label>
        <textarea
          value={translation.contents}
          onChange={(e) => handleField(activeTab, "contents", e.target.value)}
          placeholder="Write in Markdown…"
          rows={20}
          className="w-full px-3 py-2 text-body-sm font-mono border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors resize-y"
        />
      </div>
    </div>
  );
}
