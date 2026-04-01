import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { Lang } from "@repo/types";

const VALID_LANGS: Lang[] = ["ko", "en"];

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;

  if (!VALID_LANGS.includes(lang as Lang)) {
    notFound();
  }

  return <>{children}</>;
}
