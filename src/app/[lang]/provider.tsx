// app/[lang]/provider.tsx
"use client";
import { createContext, useContext, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

type Locale = "en" | "ko";
type Ctx = {
  locale: Locale;
  t: <T = string>(k: string) => T;
  toggle: () => void;
  setLocale: (l: Locale) => void;
};

const I18nCtx = createContext<Ctx | null>(null);

export default function I18nProvider({
  children,
  locale,
  dict,
}: {
  children: React.ReactNode;
  locale: Locale;
  dict: Record<string, unknown>; // 네 딕셔너리 타입에 맞게 좁혀도 OK
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";

  const t = useCallback(
    <T = string,>(k: string): T => (dict[k] as T) ?? (k as unknown as T),
    [dict]
  );

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      // 사용자 선택 기억
      document.cookie = `NEXT_LOCALE=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;

      // /en 또는 /ko 세그먼트를 제거하고 교체
      const rest = pathname.replace(/^\/(en|ko)(?=\/|$)/, "");
      router.replace(`/${next}${rest || "/"}`);
    },
    [locale, pathname, router]
  );

  const toggle = useCallback(() => setLocale(locale === "en" ? "ko" : "en"), [
    locale,
    setLocale,
  ]);

  const value = useMemo(
    () => ({ locale, t, toggle, setLocale }),
    [locale, t, toggle, setLocale]
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => {
  const v = useContext(I18nCtx);
  if (!v) throw new Error("Wrap with <I18nProvider>");
  return v;
};
