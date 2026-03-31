import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Lang } from "@repo/types";
import { listPosts, getPost } from "@/lib/api/posts";
import { Muted } from "@/components/ui/typography";
import { H1 } from "@/components/ui/typography";
import { MarkdownRenderer } from "@/components/public/MarkdownRenderer";
import { LanguageToggleNav } from "@/components/public/LanguageToggleNav";

export const revalidate = 3600;

const VALID_LANGS: Lang[] = ["ko", "en"];

export async function generateStaticParams() {
  try {
    const res = await listPosts({ lang: "ko", limit: 1000 });
    const posts = res.data ?? [];
    return posts.flatMap((p) =>
      VALID_LANGS.map((lang) => ({ lang, id: String(p.id) })),
    );
  } catch {
    return [];
  }
}

interface PostPageProps {
  params: Promise<{ lang: string; id: string }>;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { lang, id } = await params;
  const post = await getPost(Number(id), lang);
  if (!post) return {};
  return {
    title: post.translation.title,
    description: post.translation.excerpt ?? undefined,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { lang, id } = await params;

  if (!VALID_LANGS.includes(lang as Lang)) notFound();

  const post = await getPost(Number(id), lang);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-surface border-b border-muted-200">
        <div
          className="mx-auto px-4 h-14 flex items-center justify-between"
          style={{ maxWidth: "var(--max-w-content)" }}
        >
          <Link
            href={`/${lang}/posts`}
            className="flex items-center gap-1.5 text-body-sm text-secondary-500 hover:text-primary-900 transition-colors"
          >
            <BackArrowIcon />
            Posts
          </Link>
          <LanguageToggleNav currentLang={lang as Lang} />
        </div>
      </header>

      <article
        className="mx-auto px-4 py-12"
        style={{ maxWidth: "var(--max-w-content)" }}
      >
        {/* Metadata */}
        <div className="mb-6">
          <Muted className="mb-1">
            {formatDate(post.created_at)}
            {post.country.flag_url && (
              <span className="ml-1.5">{post.country.flag_url}</span>
            )}
          </Muted>
          <H1 className="leading-editorial-snug">{post.translation.title}</H1>
        </div>

        {/* Cover image */}
        {post.cover_url && (
          <div className="mb-8 overflow-hidden rounded-sm bg-muted-200 aspect-[16/9] relative">
            <Image
              src={post.cover_url}
              alt={post.translation.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Body */}
        <MarkdownRenderer content={post.translation.contents} />

        {/* Inline media (images/embeds not in markdown) */}
        {post.media.length > 0 && (
          <div className="mt-10 space-y-6">
            {post.media.map((m) => (
              <figure key={m.id}>
                {m.type === "image" && (
                  <div className="overflow-hidden rounded-sm bg-muted-200 relative aspect-[4/3]">
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
                    className="w-full aspect-video rounded-sm"
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
      </article>
    </div>
  );
}

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
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
