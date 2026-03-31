import { type ButtonHTMLAttributes, type Ref } from "react";
import { cn } from "@/lib/utils";

// ── Variants ──────────────────────────────────────────────────────────────────

const variantClasses = {
  /** Solid — primary CTAs */
  primary:
    "bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-950 focus-visible:ring-primary-900",
  /** Ghost — secondary actions, icon buttons */
  ghost:
    "bg-transparent text-primary-700 hover:bg-muted-100 active:bg-muted-200 focus-visible:ring-primary-700",
  /** Outline — bordered, used in forms */
  outline:
    "border border-muted-300 text-primary-800 hover:border-primary-400 hover:bg-muted-50 active:bg-muted-100 focus-visible:ring-primary-700",
  /** Accent — highlighted actions (e.g. publish) */
  accent:
    "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 focus-visible:ring-accent-500",
  /** Danger — destructive actions (e.g. delete post) */
  danger:
    "text-red-600 hover:bg-red-50 active:bg-red-100 focus-visible:ring-red-500",
} as const;

const sizeClasses = {
  sm: "h-8 px-3 text-label gap-1.5",
  md: "h-10 px-4 text-body-sm gap-2",
  lg: "h-12 px-6 text-body-base gap-2.5",
  /** Square icon button — pair with an SVG child */
  icon: "h-9 w-9 p-0",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show a loading spinner and prevent interaction */
  loading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Button — accessible, multi-variant button.
 *
 * @example
 * <Button variant="primary">Publish</Button>
 * <Button variant="danger" size="icon" aria-label="Delete post">
 *   <TrashIcon />
 * </Button>
 * <Button loading>Saving…</Button>
 */
export function Button({
  ref,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={cn(
        // Base
        "inline-flex items-center justify-center rounded-sm font-medium select-none",
        "transition-colors duration-150",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        // Disabled state
        "disabled:opacity-40 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
}

// ── Internal spinner ──────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
