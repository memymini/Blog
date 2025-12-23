import type { ReactNode } from "react";
import I18nProvider from "./provider";
import { getDictionary } from "./dictionaries";
import { Toaster } from "react-hot-toast";
import AppShell from "@/components/layout/AppShell";
import { Metadata } from "next";

import { ProgressBarProvider } from "./ProgressBarProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Minhee's Portfolio",
    default: "Minhee's Portfolio",
  },
  description:
    "A portfolio and blog built with Next.js, Framer Motion, and Tailwind CSS.",
};

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
      <ProgressBarProvider />
      <AppShell>{children}</AppShell>
      <Toaster />
    </I18nProvider>
  );
}
