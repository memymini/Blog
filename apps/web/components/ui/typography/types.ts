import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
} from "react";

/**
 * Extracts the ref type for a given element or component.
 * Used to type the `ref` prop on polymorphic components.
 */
export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>["ref"];

/**
 * Props for a polymorphic component.
 *
 * Merges the component's own props (OwnProps) with the underlying
 * element's HTML attributes, omitting conflicts so OwnProps always win.
 * Includes the `as` prop to switch the rendered element.
 *
 * In React 19, `ref` is a plain prop — add it separately at the call site:
 * `PolymorphicProps<C, OwnProps> & { ref?: PolymorphicRef<C> }`
 */
export type PolymorphicProps<
  C extends ElementType,
  OwnProps = {},
> = OwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof OwnProps | "as">;

/**
 * Shared own-props for every Typography variant.
 */
export type TypographyOwnProps = {
  /**
   * Apply `text-wrap: balance` for multi-line headings.
   * @default varies per component
   */
  balance?: boolean;
};
