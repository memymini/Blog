import Image from "next/image";
import type { PostDetail, Lang } from "@repo/types";
import { formatDate } from "@/lib/utils";
import { blurPlaceholder } from "@/lib/image";
import { MarkdownRenderer } from "@/components/client/MarkdownRenderer";
import { PostDetailToolbar } from "@/components/client/PostDetailToolbar";

interface PostDetailViewProps {
  post: PostDetail;
  lang: Lang;
}

export function PostDetailView({ post, lang }: PostDetailViewProps) {
  return (
    <>
      <PostDetailToolbar postId={post.id} lang={lang} />

      <article>
        {post.cover_url ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-muted-200">
            <Image
              src={post.cover_url}
              alt={post.translation.title}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={blurPlaceholder}
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
              {post.media.map((m) => {
                const w = m.width ?? 100;
                return (
                  <figure key={m.id} style={{ width: `${w}%` }}>
                    {m.type === "image" && (
                      <div className="overflow-hidden bg-muted-200 relative aspect-[4/3]">
                        <Image
                          src={m.url}
                          alt={m.alt_text ?? ""}
                          fill
                          sizes="(max-width: 1024px) 100vw, 800px"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={blurPlaceholder}
                        />
                      </div>
                    )}
                    {m.type === "video" && (
                      <video src={m.url} controls className="w-full" />
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
                );
              })}
            </div>
          )}
        </div>
      </article>
    </>
  );
}
