import Link from "next/link";
import type { PostListItem, Lang } from "@repo/types";
import { formatDate } from "@/utils/utils";
import { EmptyState } from "./EmptyState";

const EMPTY_T: Record<Lang, { title: string; description: string }> = {
  ko: {
    title: "게시물이 없어요.",
    description: "다른 나라나 언어를 선택해 보세요.",
  },
  en: {
    title: "No posts found",
    description: "Try selecting a different country or language.",
  },
};

interface PostListProps {
  posts: PostListItem[];
  lang: Lang;
}


export function PostList({ posts, lang }: PostListProps) {
  if (posts.length === 0) {
    const t = EMPTY_T[lang];
    return (
      <div className="py-16">
        <EmptyState title={t.title} description={t.description} />
      </div>
    );
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id} className="border-b border-muted-100 last:border-b-0">
          <Link
            href={`/${lang}/posts/${post.id}`}
            className="block px-8 py-7 hover:bg-muted-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-700"
          >
            <time
              dateTime={post.created_at}
              className="block text-caption text-secondary-400 mb-2"
            >
              {formatDate(post.created_at)} {post.country.flag_url}
            </time>
            <p className="text-h4 font-bold text-primary-900 leading-editorial-snug">
              {post.translation.title}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
