"use client";

import { useI18n } from "@/app/[lang]/provider";

export default function LanguageToggle() {
  const { toggle, t } = useI18n();
  return (
    <button
      onClick={toggle}
      className="px-3 py-1 rounded-xl glass text-sm hover:bg-white/10"
      aria-label="Toggle language"
      title="Toggle language"
    >
      {t("lang_toggle")}
    </button>
  );
}
