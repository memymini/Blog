"use client";

import { useRouter } from "next/navigation";
import type { Country, Lang } from "@repo/types";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/Button";

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
    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center gap-2 min-w-max">
        <FilterButton
          active={!currentCountry}
          onClick={() => select(null)}
          label="🌎"
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
    <Button
      variant="ghost"
      title={title}
      onClick={onClick}
      className={cn(
        "h-8 w-8 px-4 rounded-full text-body-base text-secondary-500 hover:bg-muted-200",
        active && "bg-muted-200 text-primary-900 font-medium",
      )}
    >
      {label}
    </Button>
  );
}
