"use client";
import LanguageToggle from "@/components/navbar/LanguageToggle";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";
import Link from "next/link";
import { useI18n } from "./provider";

export default function Page() {
  const { t, locale } = useI18n();

  return (
    <main className="flex h-screen w-full items-center justify-between flex-col lg:p-20 p-10">
      <div className="flex justify-between w-full font-bold text-lg sm:text-2xl">
        <div>
          <p>Frontend Developer</p> <p className="font-black">Minhee Jung</p>
        </div>
        <div className="flex gap-4">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
      <div className="flex items-start justify-between w-full flex-col">
        <nav className="flex items-center text-start h-full">
          <ul className="flex flex-col md:space-y-2 lg:space-y-4 lg:text-2xl font-bold md:text-xl text-lg">
            <li>
              <Link
                href={`/${locale}/about`}
                className="opacity-80 hover:opacity-100 accet-underline inline-block transition-transform hover:scale-110 hover:font-black"
              >
                {t("nav_about")}
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="opacity-80 hover:opacity-100 accet-underline inline-block transition-transform hover:scale-110 hover:font-black"
              >
                {t("nav_projects")}
              </Link>
            </li>
            <li>
              <Link
                href="/experiences"
                className="opacity-80 hover:opacity-100 accet-underline inline-block transition-transform hover:scale-110 hover:font-black"
              >
                {t("nav_experience")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="opacity-80 hover:opacity-100 accet-underline inline-block transition-transform hover:scale-110 hover:font-black"
              >
                {t("nav_contact")}
              </Link>
            </li>
          </ul>
        </nav>
        <h1 className="text-[18vw] font-black leading-tight font-anton">
          PORTFOLIO
        </h1>
      </div>
    </main>
  );
}
