"use client";

import {
  useState,
  useRef,
  useEffect,
  type Ref,
  type KeyboardEvent,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Language {
  code: string;
  label: string;
}

export interface LanguageToggleProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /** Available language options */
  languages: Language[];
  /** Currently active language code */
  currentLang: string;
  /** Called when the user selects a different language */
  onLanguageChange: (code: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * LanguageToggle — globe-icon button that opens an accessible language dropdown.
 *
 * Matches the reference design: globe icon (⊕) fixed to the top-right of
 * both the post list and detail pages.
 *
 * Keyboard support: Enter/Space/↓ open, Escape closes, ↑/↓ navigate,
 * Enter/Space select. Focus returns to trigger on close.
 *
 * @example
 * <LanguageToggle
 *   languages={[{ code: "ko", label: "한국어" }, { code: "en", label: "English" }]}
 *   currentLang="ko"
 *   onLanguageChange={(code) => router.push(`/${code}/posts`)}
 * />
 */
export function LanguageToggle({
  ref,
  languages,
  currentLang,
  onLanguageChange,
  className,
  ...props
}: LanguageToggleProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Reset focused index to current language when menu opens
  useEffect(() => {
    if (open) {
      const idx = languages.findIndex((l) => l.code === currentLang);
      setFocusedIndex(idx >= 0 ? idx : 0);
    }
  }, [open, currentLang, languages]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handleMenuKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    switch (e.key) {
      case "Escape":
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((i) => (i + 1) % languages.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((i) => (i - 1 + languages.length) % languages.length);
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const lang = languages[focusedIndex];
        if (lang) select(lang.code);
        break;
      }
    }
  }

  function select(code: string) {
    onLanguageChange(code);
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div ref={ref} className={cn("relative inline-block", className)} {...props}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-sm",
          "text-secondary-500 hover:text-primary-900 hover:bg-muted-100",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2",
          open && "bg-muted-100 text-primary-900",
        )}
      >
        <GlobeIcon />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          ref={menuRef}
          role="listbox"
          aria-label="Languages"
          onKeyDown={handleMenuKeyDown}
          className={cn(
            "absolute right-0 mt-1 min-w-[9rem] z-50",
            "bg-surface border border-muted-200 rounded-sm shadow-sm py-1",
          )}
        >
          {languages.map((lang, i) => {
            const isSelected = lang.code === currentLang;
            const isFocused = i === focusedIndex;
            return (
              <li
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                tabIndex={isFocused ? 0 : -1}
                ref={(el) => { if (isFocused) el?.focus(); }}
                onClick={() => select(lang.code)}
                onMouseEnter={() => setFocusedIndex(i)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 cursor-pointer",
                  "text-body-sm text-primary-800 leading-editorial-normal",
                  "hover:bg-muted-50 focus:bg-muted-50 focus:outline-none",
                  isSelected && "font-medium text-primary-950",
                )}
              >
                <span>{lang.label}</span>
                {isSelected && <CheckIcon className="ml-2 text-accent-500 shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
