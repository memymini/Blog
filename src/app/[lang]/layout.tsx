// app/[lang]/layout.tsx
import type { ReactNode } from "react";
import I18nProvider from "./provider";
import { getDictionary } from "./dictionaries";
import Navbar from "@/components/navbar/Navbar";
import PageTransition from "@/components/PageTransition";

// export default async function LangLayout({
//   children,
//   params,
// }: {
//   children: ReactNode;
//   params: Promise<{ lang: "en" | "ko" }>;
// }) {
//   const { lang } = await params;
//   const dict = await getDictionary(lang);
//   return (
//     <I18nProvider locale={lang} dict={dict}>
//       <Navbar />
//       {children}
//     </I18nProvider>
//   );
// }

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
    </I18nProvider>
  );
}
