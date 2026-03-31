import { type HTMLAttributes, type Ref } from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PostCardProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  /** ISO-style date string displayed above the title, e.g. "2026.02.01" */
  date: string;
  /** Country flag emoji shown beside the date, e.g. "🇬🇭" */
  flag?: string;
  title: string;
  /** Short excerpt shown below the title */
  excerpt?: string;
  /** Cover image URL — centred and full-width when provided */
  coverUrl?: string;
  coverAlt?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * PostCard — blog post preview card matching the reference design.
 *
 * Renders metadata (date + flag), an optional centred cover image,
 * the post title, and an optional excerpt. Generous vertical padding,
 * bottom border separating list items, hover background shift.
 *
 * Rendered as `<article>` for semantics; interactive via `onClick`.
 *
 * @example
 * <PostCard
 *   date="2026.02.01"
 *   flag="🇬🇭"
 *   title="큰 제목이 여기에"
 *   onClick={() => router.push(`/ko/posts/1`)}
 * />
 */
export function PostCard({
  ref,
  date,
  flag,
  title,
  excerpt,
  coverUrl,
  coverAlt,
  className,
  ...props
}: PostCardProps) {
  return (
    <article
      ref={ref}
      className={cn(
        "group cursor-pointer py-6",
        "border-b border-muted-200 last:border-b-0",
        "transition-colors duration-150 hover:bg-muted-50",
        className,
      )}
      {...props}
    >
      {/* Metadata: date + flag */}
      <time
        dateTime={date}
        className="block text-body-sm text-secondary-400 mb-1.5"
      >
        {date}
        {flag && <span className="ml-1.5">{flag}</span>}
      </time>

      {/* Cover image — centred, full-width */}
      {coverUrl && (
        <div className="my-4 overflow-hidden rounded-sm bg-muted-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={coverAlt ?? title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Title */}
      <p className="text-h4 font-semibold text-primary-900 leading-editorial-snug group-hover:text-accent-600 transition-colors duration-150">
        {title}
      </p>

      {/* Excerpt */}
      {excerpt && (
        <p className="mt-1.5 text-body-sm text-secondary-500 leading-editorial-normal line-clamp-2">
          {excerpt}
        </p>
      )}
    </article>
  );
}
