import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton, Black_Han_Sans } from "next/font/google";
import "./globals.css";

// console/retro font

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-han-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "minhee.dev",
  description: "frontend developer protfolio",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${blackHanSans.variable} ${geistMono.variable} ${anton.variable}`}
    >
      <body>
        <main className="min-h-screen w-screen">{children}</main>
      </body>
    </html>
  );
}
