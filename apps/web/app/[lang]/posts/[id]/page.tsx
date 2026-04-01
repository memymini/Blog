import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Lang } from "@repo/types";
import { listPosts, getPost } from "@/lib/api/posts";
import { MarkdownRenderer } from "@/components/public/MarkdownRenderer";
import { LanguageToggleNav } from "@/components/public/LanguageToggleNav";
import { AdminPostView } from "@/components/public/AdminPostView";
import Link from "next/link";
import Image from "next/image";

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

  const typedLang = lang as Lang;

  // Detect admin via httpOnly cookie (server-side only)
  const cookieStore = await cookies();
  const isAdmin = !!cookieStore.get("token")?.value;

  return (
    <div className="min-h-screen bg-muted-100 flex justify-center">
      <div className="max-w-200 w-full bg-surface min-h-screen">
        {isAdmin ? (
          /* Admin view — client component for inline editing */
          <AdminPostView post={post} lang={typedLang} />
        ) : (
          /* Public view — static RSC */
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
              <LanguageToggleNav currentLang={typedLang} />
            </div>

            {/* Content */}
            <article>
              {/* Cover image with date + title overlaid at bottom-left */}
              {post.cover_url ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-muted-200">
                  <Image
                    src={post.cover_url}
                    alt={post.translation.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient overlay — dark at bottom, transparent at top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  {/* Date + title pinned to bottom-left */}
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
                /* Fallback when no cover image */
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
        )}
      </div>
    </div>
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
