import type { Metadata } from "next";
import { VT323, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// console/retro font
const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-console",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang={lang}>
      <body
        className={`${vt323.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
