"use client";
import LanguageToggle from "@/components/navbar/LanguageToggle";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";
import Link from "next/link";
import { useI18n } from "./provider";
import { Github, Linkedin, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function Page() {
  const { t, locale } = useI18n();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("minhi0614@gmail.com").then(() => {
      toast.success(t("email_copied"));
    });
  };

  return (
    <main className="flex h-screen w-full items-center justify-between flex-col lg:p-20 p-10">
      <div className="flex justify-between w-full font-bold text-lg sm:text-2xl items-start flex-col h-full">
        <div className="flex gap-4">
          <button
            aria-label="minhi0614@gmail.com"
            title="minhi0614@gmail.com"
            onClick={handleCopyEmail}
            className="flex flex-col items-center justify-center glass w-9 h-9 hover:bg-white/10"
          >
            <Mail className="size-5" />
          </button>
          <Link
            aria-label="Github"
            title="GitHub"
            href="https://github.com/memymini"
            className="flex flex-col items-center justify-center glass w-9 h-9 hover:bg-white/10"
          >
            <Github className="size-5" />
          </Link>
          <Link
            aria-label="LinkedIn"
            title="LinkedIn"
            href="https://www.linkedin.com/in/minhee-jung-000417348"
            className="flex flex-col items-center justify-center glass w-9 h-9 hover:bg-white/10"
          >
            <Linkedin className="size-5" />
          </Link>
          <ThemeToggle />
          <LanguageToggle />
        </div>
        <div className="flex flex-col items-start">
          <nav className="flex items-center text-start h-full mb-12">
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
                  href={`/${locale}/projects`}
                  className="opacity-80 hover:opacity-100 accet-underline inline-block transition-transform hover:scale-110 hover:font-black"
                >
                  {t("nav_projects")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/experiences`}
                  className="opacity-80 hover:opacity-100 accet-underline inline-block transition-transform hover:scale-110 hover:font-black"
                >
                  {t("nav_experience")}
                </Link>
              </li>
              <li>
                <Link
                  href="/이력서_정민희.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="opacity-80 hover:opacity-100 accet-underline inline-block transition-transform hover:scale-110 hover:font-black"
                >
                  {t("resume")}
                </Link>
              </li>
            </ul>
          </nav>

          <h1 className="text-[5vw] font-black leading-tight font-anton text-start">
            {t("role")}
          </h1>
          <h1 className="text-[15vw] font-black leading-none font-anton">
            {t("title")}
          </h1>
        </div>
      </div>
    </main>
  );
}
