// app/[lang]/layout.tsx
import type { ReactNode } from "react";
import I18nProvider from "./provider";
import { getDictionary } from "./dictionaries";
import PageTransition from "@/components/PageTransition";
import { Toaster } from "react-hot-toast";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: "en" | "ko" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <I18nProvider locale={lang} dict={dict}>
      <PageTransition>{children}</PageTransition>
      <Toaster />
    </I18nProvider>
  );
}
