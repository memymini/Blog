import React from "react";
import { Home, FolderOpen, BookOpen, Moon, Sun, Globe } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { useI18n } from "@/app/[lang]/provider";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Page = "home" | "projects" | "blog";

interface NavbarProps {
  lang: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Navbar = ({ lang, isDarkMode, toggleTheme }: NavbarProps) => {
  const pathname = usePathname();
  const { t, toggle } = useI18n();

  // Helper to check if a path is active
  const isActive = (id: Page) => {
    if (id === "home") return pathname === `/${lang}`;
    return pathname.startsWith(`/${lang}/${id}`);
  };

  const navItems: {
    id: Page;
    label: string;
    icon: React.ReactNode;
    href: string;
  }[] = [
    {
      id: "home",
      label: t("nav_home"),
      icon: <Home size={18} />,
      href: `/${lang}`,
    },
    {
      id: "projects",
      label: t("nav_projects"),
      icon: <FolderOpen size={18} />,
      href: `/${lang}/projects`,
    },
    {
      id: "blog",
      label: t("nav_blog"),
      icon: <BookOpen size={18} />,
      href: `/${lang}/blog`,
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4">
      {/* Navigation Pills */}
      <nav className="flex items-center rounded-full border border-white/25 bg-white/10 p-1.5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
        {navItems.map((item) => {
          const active = isActive(item.id);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-black dark:text-white"
                  : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/40 shadow-sm dark:bg-white/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Pills */}
      <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 p-1.5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
        <button
          onClick={toggleTheme}
          className="rounded-full p-2.5 text-black/70 hover:bg-white/20 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white transition-all"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="h-4 w-[1px] bg-white/20" />
        <button
          onClick={toggle}
          className="rounded-full p-2.5 text-black/70 hover:bg-white/20 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white transition-all"
          aria-label="Change language"
        >
          <Globe size={18} />
        </button>
      </div>
    </div>
  );
};
