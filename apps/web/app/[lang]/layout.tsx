import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { VALID_LANGS } from "@/lib/constants";
import type { Lang } from "@repo/types";

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    alternates: {
      languages: {
        ko: `/ko/posts`,
        en: `/en/posts`,
      },
    },
    other: {
      "content-language": lang,
    },
  };
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
