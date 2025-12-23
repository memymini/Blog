import { Locale } from "@/types";
import "server-only";

const dictionaries = {
  en: () => import("@/lib/i18n/en.json").then((module) => module.default),
  ko: () => import("@/lib/i18n/ko.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  if (locale !== "en" && locale !== "ko") {
    // fallback
    locale = "en";
  }
  return dictionaries[locale as Locale]();
};
