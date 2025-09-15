"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useI18n } from "@/app/[lang]/provider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t, locale } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sections = [
    { href: `/${locale}/#about`, label: t("nav_about") },
    { href: `/${locale}/#projects`, label: t("nav_projects") },
    { href: `/${locale}/#experience`, label: t("nav_experience") },
    // { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-4 inset-x-4 z-50 transition-all">
      <nav
        className={`mx-auto max-w-6xl px-4 flex items-center justify-between rounded-2xl glass ${
          scrolled ? "" : "bg-white/5"
        }`}
      >
        <Link
          href="/"
          className="font-semibold tracking-tight accent-underline font-console text-2xl"
        >
          minhee.dev
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          {sections.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="opacity-80 hover:opacity-100 accent-underline"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 py-3">
          {/* <a
            href="/resume.pdf"
            className="text-sm opacity-80 hover:opacity-100 accent-underline"
          >
            resume
          </a> */}
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
