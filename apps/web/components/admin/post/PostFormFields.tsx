"use client";

import type { Country } from "@repo/types";
import { cn } from "@/lib/utils";

interface PostFormFieldsProps {
  countryCode: string;
  published: boolean;
  countries: Country[];
  onCountryChange: (code: string) => void;
  onPublishedChange: (published: boolean) => void;
}

export function PostFormFields({
  countryCode,
  published,
  countries,
  onCountryChange,
  onPublishedChange,
}: PostFormFieldsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Country */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-label text-secondary-600 mb-1">Country</label>
        <select
          value={countryCode}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full h-10 px-3 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors"
        >
          <option value="">Select country…</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag_url} {c.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* Published toggle */}
      <div className="flex flex-col justify-end">
        <label className="block text-label text-secondary-600 mb-1">Status</label>
        <button
          type="button"
          role="switch"
          aria-checked={published}
          onClick={() => onPublishedChange(!published)}
          className={cn(
            "flex items-center gap-2 h-10 px-3 rounded-sm border text-body-sm transition-colors",
            published
              ? "border-accent-400 bg-accent-50 text-accent-700"
              : "border-muted-300 bg-surface text-secondary-500",
          )}
        >
          <span
            className={cn(
              "w-3.5 h-3.5 rounded-full transition-colors",
              published ? "bg-accent-500" : "bg-muted-300",
            )}
          />
          {published ? "Published" : "Draft"}
        </button>
      </div>
    </div>
  );
}
