"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Lang } from "@repo/types";
import { LanguageToggle } from "@/components/ui";

const LANG_LABELS: Record<Lang, string> = { ko: "한국어", en: "English" };
const LANGS: Lang[] = ["ko", "en"];

interface LanguageToggleNavProps {
  currentLang: Lang;
}

/**
 * Thin client wrapper around LanguageToggle that handles lang-switch navigation.
 * Replaces the first path segment with the selected language code.
 */
export function LanguageToggleNav({ currentLang }: LanguageToggleNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleLanguageChange(code: string) {
    // Replace /ko/... with /en/... (or vice versa)
    const newPath = pathname.replace(/^\/(ko|en)/, `/${code}`);
    router.push(newPath);
  }

  const languages = LANGS.map((l) => ({ code: l, label: LANG_LABELS[l] }));

  return (
    <LanguageToggle
      languages={languages}
      currentLang={currentLang}
      onLanguageChange={handleLanguageChange}
    />
  );
}
