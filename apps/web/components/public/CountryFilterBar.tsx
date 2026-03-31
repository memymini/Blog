"use client";

import { useRouter } from "next/navigation";
import type { Country, Lang } from "@repo/types";
import { cn } from "@/lib/utils";

interface CountryFilterBarProps {
  countries: Country[];
  currentCountry: string | undefined;
  lang: Lang;
}

export function CountryFilterBar({
  countries,
  currentCountry,
  lang,
}: CountryFilterBarProps) {
  const router = useRouter();

  function select(code: string | null) {
    const path = code ? `/${lang}/posts?country=${code}` : `/${lang}/posts`;
    router.push(path);
  }

  return (
    <div className="overflow-x-auto pb-1 -mx-4 px-4">
      <div className="flex items-center gap-2 min-w-max">
        <FilterButton
          active={!currentCountry}
          onClick={() => select(null)}
          label="ALL"
        />
        {countries.map((c) => (
          <FilterButton
            key={c.code}
            active={currentCountry === c.code}
            onClick={() => select(c.code)}
            label={c.flag_url}
            title={c.name_en}
          />
        ))}
      </div>
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  title?: string;
}

function FilterButton({ active, onClick, label, title }: FilterButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded-sm",
        "text-caption text-secondary-500 transition-colors duration-150",
        "hover:bg-muted-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
        active && "bg-muted-200 text-primary-900 font-medium",
      )}
    >
      {label}
    </button>
  );
}
