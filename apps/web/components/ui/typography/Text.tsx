import { type ElementType } from "react";
import { cn } from "@/lib/utils";
import type { PolymorphicProps, PolymorphicRef, TypographyOwnProps } from "./types";

// ── Shared prop type factory ──────────────────────────────────────────────────

type TextProps<C extends ElementType> = PolymorphicProps<C, TypographyOwnProps> & {
  ref?: PolymorphicRef<C>;
};

// ── Lead ──────────────────────────────────────────────────────────────────────

/**
 * Lead — introductory paragraph, slightly larger and muted. Defaults to `<p>`.
 */
export function Lead<C extends ElementType = "p">({
  as,
  ref,
  balance = false,
  className,
  ...props
}: TextProps<C>) {
  const Tag = (as ?? "p") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-body-lg font-normal leading-editorial-loose text-secondary-600",
        balance && "text-balance",
        className,
      )}
      {...props}
    />
  );
}

// ── Body ──────────────────────────────────────────────────────────────────────

/**
 * Body — standard paragraph text. Defaults to `<p>`.
 */
export function Body<C extends ElementType = "p">({
  as,
  ref,
  balance = false,
  className,
  ...props
}: TextProps<C>) {
  const Tag = (as ?? "p") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-body-base font-normal leading-editorial-relaxed text-primary-900",
        balance && "text-balance",
        className,
      )}
      {...props}
    />
  );
}

// ── BodySm ────────────────────────────────────────────────────────────────────

/**
 * BodySm — slightly smaller body copy. Defaults to `<p>`.
 */
export function BodySm<C extends ElementType = "p">({
  as,
  ref,
  balance = false,
  className,
  ...props
}: TextProps<C>) {
  const Tag = (as ?? "p") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-body-sm font-normal leading-editorial-relaxed text-primary-800",
        balance && "text-balance",
        className,
      )}
      {...props}
    />
  );
}

// ── Muted ─────────────────────────────────────────────────────────────────────

/**
 * Muted — de-emphasised inline text (dates, bylines, secondary info).
 * Defaults to `<span>`.
 */
export function Muted<C extends ElementType = "span">({
  as,
  ref,
  balance: _balance,
  className,
  ...props
}: TextProps<C>) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn("text-body-sm text-secondary-500", className)}
      {...props}
    />
  );
}

// ── Caption ───────────────────────────────────────────────────────────────────

/**
 * Caption — image captions, fine print. Defaults to `<span>`.
 */
export function Caption<C extends ElementType = "span">({
  as,
  ref,
  balance: _balance,
  className,
  ...props
}: TextProps<C>) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-caption tracking-editorial-wide uppercase text-secondary-400",
        className,
      )}
      {...props}
    />
  );
}

// ── Label ─────────────────────────────────────────────────────────────────────

/**
 * Label — form labels, tags, category badges. Defaults to `<span>`.
 */
export function Label<C extends ElementType = "span">({
  as,
  ref,
  balance: _balance,
  className,
  ...props
}: TextProps<C>) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-label font-medium tracking-editorial-wider uppercase text-secondary-500",
        className,
      )}
      {...props}
    />
  );
}
