import Link from "next/link";
import type { PostListItem, Lang } from "@repo/types";
import { EmptyState } from "./EmptyState";

interface PostListProps {
  posts: PostListItem[];
  lang: Lang;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function PostList({ posts, lang }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-16">
        <EmptyState description="Try selecting a different country or language." />
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
