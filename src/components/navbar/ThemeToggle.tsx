"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  // 초기값: localStorage → 없으면 시스템 선호
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const ls = localStorage.getItem("theme");
    if (ls === "dark") return true;
    if (ls === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 적용 + 저장
  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle("dark", dark);
    el.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // 시스템 테마 변경 시(사용자가 저장 안 했을 때만) 따라가기
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const ls = localStorage.getItem("theme");
      if (!ls) setDark(e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <button
      className="p-2 rounded-xl glass hover:bg-white/10"
      onClick={() => setDark(!dark)}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
