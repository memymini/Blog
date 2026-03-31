import { type ElementType } from "react";
import { cn } from "@/lib/utils";
import type {
  PolymorphicProps,
  PolymorphicRef,
  TypographyOwnProps,
} from "./types";

type DisplayProps<C extends ElementType = "h1"> = PolymorphicProps<
  C,
  TypographyOwnProps
> & {
  ref?: PolymorphicRef<C>;
};

/**
 * Display — largest editorial heading. Defaults to `<h1>`.
 *
 * In React 19, ref is a plain prop — no forwardRef needed.
 *
 * @example
 * <Display>My Travel Journal</Display>
 * <Display as="h2">Visually display but semantically h2</Display>
 * <Display ref={myRef}>Animated heading</Display>
 */
export function Display<C extends ElementType = "h1">({
  as,
  ref,
  balance = true,
  className,
  ...props
}: DisplayProps<C>) {
  const Tag = (as ?? "h1") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-display font-extrabold leading-editorial-tight tracking-editorial-tight text-primary-950",
        balance && "text-balance",
        className,
      )}
      {...props}
    />
  );
}
