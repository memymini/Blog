"use client";

import { useI18n } from "@/app/[lang]/provider";

export default function LanguageToggle() {
  const { toggle, t } = useI18n();
  return (
    <button
      onClick={toggle}
      className="rounded-xl glass text-sm hover:bg-white/10 w-9 h-9"
      aria-label="Toggle language"
      title="Toggle language"
    >
      {t("lang_toggle")}
    </button>
  );
}
