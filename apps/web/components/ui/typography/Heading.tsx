import { type ElementType } from "react";
import { cn } from "@/lib/utils";
import type { PolymorphicProps, PolymorphicRef, TypographyOwnProps } from "./types";

// ── Shared prop type factory ──────────────────────────────────────────────────

type HeadingProps<C extends ElementType> = PolymorphicProps<C, TypographyOwnProps> & {
  ref?: PolymorphicRef<C>;
};

// ── H1 ────────────────────────────────────────────────────────────────────────

/**
 * H1 — primary page heading. Defaults to `<h1>`.
 *
 * @example
 * <H1>[Fontys University] 교환학생 후기</H1>
 * <H1 as="h2">Visually H1 but semantically h2 for SEO</H1>
 */
export function H1<C extends ElementType = "h1">({
  as,
  ref,
  balance = true,
  className,
  ...props
}: HeadingProps<C>) {
  const Tag = (as ?? "h1") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-h1 font-bold leading-editorial-tight tracking-editorial-snug text-primary-900",
        balance && "text-balance",
        className,
      )}
      {...props}
    />
  );
}

// ── H2 ────────────────────────────────────────────────────────────────────────

/**
 * H2 — section heading. Defaults to `<h2>`.
 */
export function H2<C extends ElementType = "h2">({
  as,
  ref,
  balance = true,
  className,
  ...props
}: HeadingProps<C>) {
  const Tag = (as ?? "h2") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-h2 font-bold leading-editorial-snug tracking-editorial-snug text-primary-900",
        balance && "text-balance",
        className,
      )}
      {...props}
    />
  );
}

// ── H3 ────────────────────────────────────────────────────────────────────────

/**
 * H3 — subsection heading. Defaults to `<h3>`.
 */
export function H3<C extends ElementType = "h3">({
  as,
  ref,
  balance = false,
  className,
  ...props
}: HeadingProps<C>) {
  const Tag = (as ?? "h3") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-h3 font-semibold leading-editorial-snug text-primary-900",
        balance && "text-balance",
        className,
      )}
      {...props}
    />
  );
}

// ── H4 ────────────────────────────────────────────────────────────────────────

/**
 * H4 — minor heading. Defaults to `<h4>`.
 */
export function H4<C extends ElementType = "h4">({
  as,
  ref,
  balance = false,
  className,
  ...props
}: HeadingProps<C>) {
  const Tag = (as ?? "h4") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-h4 font-semibold leading-editorial-normal text-primary-800",
        balance && "text-balance",
        className,
      )}
      {...props}
    />
  );
}
