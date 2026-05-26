import type { Lang } from "@repo/types";

/** All supported UI languages. Add new locales here — all route guards and SSG params read from this. */
export const VALID_LANGS: Lang[] = ["ko", "en"];

/** Public site base URL — used for canonical/OG/sitemap links. */
export const SITE_URL = "https://memymini.vercel.app";

/** Enable mock data instead of real API calls (set USE_MOCK or NEXT_PUBLIC_USE_MOCK env var). */
export const USE_MOCK =
  process.env.USE_MOCK === "true" ||
  process.env.NEXT_PUBLIC_USE_MOCK === "true";
