"use client";

import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useParams } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  useEffect(() => {
    setMounted(true);
    // Check system preference or localStorage here if needed
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
        {/* Render a static shell or nothing */}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-500 bg-background text-foreground",
        isDarkMode && "dark"
      )}
    >
      {/* Mesh Gradients Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-blue-400/30 blur-[100px] dark:bg-blue-600/20" />
        <div className="absolute -right-[10%] top-[20%] h-[40vw] w-[40vw] rounded-full bg-purple-400/30 blur-[100px] dark:bg-purple-600/20" />
        <div className="absolute bottom-[10%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-pink-400/30 blur-[100px] dark:bg-pink-600/20" />
      </div>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-32 pt-12 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navbar lang={lang} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </div>
  );
}
