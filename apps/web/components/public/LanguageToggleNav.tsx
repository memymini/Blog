"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Lang } from "@repo/types";

interface LanguageToggleNavProps {
  currentLang: Lang;
}

export function LanguageToggleNav({ currentLang }: LanguageToggleNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const nextLang: Lang = currentLang === "ko" ? "en" : "ko";

  function toggle() {
    const newPath = pathname.replace(/^\/(ko|en)/, `/${nextLang}`);
    router.push(newPath);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${nextLang === "en" ? "English" : "Korean"}`}
      className="flex-none h-9 px-2.5 text-caption font-medium text-secondary-500 hover:text-primary-900 hover:bg-muted-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
    >
      {currentLang === "ko" ? "EN" : "KR"}
    </button>
  );
}
