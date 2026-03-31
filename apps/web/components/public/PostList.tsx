import Link from "next/link";
import type { PostListItem, Lang } from "@repo/types";
import { PostCard } from "@/components/ui";
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
    return <EmptyState description="Try selecting a different country or language." />;
  }

  return (
    <div>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/${lang}/posts/${post.id}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 rounded-sm"
        >
          <PostCard
            date={formatDate(post.created_at)}
            flag={post.country.flag_url}
            title={post.translation.title}
            excerpt={post.translation.excerpt ?? undefined}
            coverUrl={post.cover_url ?? undefined}
          />
        </Link>
      ))}
    </div>
  );
}
