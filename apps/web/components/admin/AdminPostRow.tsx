"use client";

import { useRouter } from "next/navigation";
import type { AdminPostListItem } from "@repo/types";
import { cn } from "@/lib/utils";

interface AdminPostRowProps {
  post: AdminPostListItem;
  onDelete: (id: number) => void;
}

export function AdminPostRow({ post, onDelete }: AdminPostRowProps) {
  const router = useRouter();

  const title =
    post.country.name_en || `Post #${post.id}`;

  function handleDelete() {
    if (window.confirm(`Delete post #${post.id}? This cannot be undone.`)) {
      onDelete(post.id);
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b border-muted-200 group">
      {/* Flag */}
      <span className="text-body-lg w-8 shrink-0 text-center">
        {post.country.flag_url}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-medium text-primary-900 truncate">
          Post #{post.id} — {post.country.name_en}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={cn(
              "text-label px-1.5 py-0.5 rounded-sm",
              post.published
                ? "bg-accent-100 text-accent-700"
                : "bg-muted-200 text-secondary-500",
            )}
          >
            {post.published ? "Published" : "Draft"}
          </span>
          {post.available_langs.map((l) => (
            <span
              key={l}
              className="text-label px-1.5 py-0.5 rounded-sm bg-muted-100 text-secondary-500"
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => router.push(`/admin/posts/${post.id}`)}
          aria-label="Edit post"
          className="p-2 rounded-sm hover:bg-muted-100 text-secondary-500 hover:text-primary-900 transition-colors"
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Delete post"
          className="p-2 rounded-sm hover:bg-red-50 text-secondary-500 hover:text-red-600 transition-colors"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
