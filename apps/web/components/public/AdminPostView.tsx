"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { PostDetail, Lang } from "@repo/types";
import { MarkdownRenderer } from "@/components/public/MarkdownRenderer";
import { LanguageToggleNav } from "@/components/public/LanguageToggleNav";

interface AdminPostViewProps {
  post: PostDetail;
  lang: Lang;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function AdminPostView({ post, lang }: AdminPostViewProps) {
  const router = useRouter();

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-muted-200">
        <Link
          href={`/${lang}/posts`}
          className="flex items-center gap-1.5 text-body-sm text-secondary-500 hover:text-primary-900 transition-colors"
          aria-label="Back to posts"
        >
          <BackArrowIcon />
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => router.push(`/admin/posts/${post.id}`)}
            className="flex items-center justify-center w-9 h-9 text-secondary-400 hover:text-primary-900 hover:bg-muted-100 rounded-sm transition-colors"
            aria-label="Edit post"
          >
            <EditIcon />
          </button>
          <LanguageToggleNav currentLang={lang} />
        </div>
      </div>

      {/* Content */}
      <article>
        {post.cover_url ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-muted-200">
            <Image
              src={post.cover_url}
              alt={post.translation.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <header className="absolute bottom-0 left-0 p-6">
              <time
                dateTime={post.created_at}
                className="block text-caption text-white/65 mb-1.5"
              >
                {formatDate(post.created_at)}
              </time>
              <h1 className="text-h2 font-bold text-white leading-editorial-snug">
                {post.country.flag_url} {post.translation.title}
              </h1>
            </header>
          </div>
        ) : (
          <header className="px-5 pt-8 pb-4">
            <time
              dateTime={post.created_at}
              className="block text-caption text-secondary-400 mb-2"
            >
              {formatDate(post.created_at)}
            </time>
            <h1 className="text-h2 font-bold text-primary-900 leading-editorial-snug">
              {post.country.flag_url} {post.translation.title}
            </h1>
          </header>
        )}

        <div className="px-5 py-8">
          <MarkdownRenderer content={post.translation.contents} />

          {post.media.length > 0 && (
            <div className="mt-10 space-y-6">
              {post.media.map((m) => (
                <figure key={m.id}>
                  {m.type === "image" && (
                    <div className="overflow-hidden bg-muted-200 relative aspect-[4/3]">
                      <Image
                        src={m.url}
                        alt={m.alt_text ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {m.type === "embed" && (
                    <iframe
                      src={m.url}
                      className="w-full aspect-video"
                      allowFullScreen
                      title={m.alt_text ?? "Embedded content"}
                    />
                  )}
                  {m.caption && (
                    <figcaption className="mt-2 text-caption text-secondary-400 text-center">
                      {m.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  );
}

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
