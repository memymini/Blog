"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Lang } from "@repo/types";
import { Button } from "@/components/ui/Button";

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
    <Button
      variant="ghost"
      onClick={toggle}
      aria-label={`Switch to ${nextLang === "en" ? "English" : "Korean"}`}
      className="flex-none px-2.5 text-caption font-medium text-secondary-500 hover:text-primary-900 rounded-full"
    >
      {currentLang === "ko" ? "EN" : "KR"}
    </Button>
  );
}
