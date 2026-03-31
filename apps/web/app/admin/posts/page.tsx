"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AdminPostListItem, PaginatedResponse } from "@repo/types";
import { listAdminPosts, deletePost } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/types";
import { Button } from "@/components/ui";
import { H2, BodySm } from "@/components/ui/typography";
import { AdminPostRow } from "@/components/admin/AdminPostRow";
import { useToast } from "@/components/admin/Toast";

const LIMIT = 20;

export default function AdminPostsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [data, setData] = useState<PaginatedResponse<AdminPostListItem> | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (p: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await listAdminPosts(p, LIMIT);
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  async function handleDelete(id: number) {
    try {
      await deletePost(id);
      showToast("Post deleted", "success");
      fetchPosts(page);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Delete failed", "error");
    }
  }

  const posts = data?.data ?? [];
  const totalPages = data?.meta ? Math.ceil(data.meta.total / LIMIT) : 1;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <H2>Posts</H2>
        <Button variant="accent" onClick={() => router.push("/admin/posts/new")}>
          New Post
        </Button>
      </div>

      {/* States */}
      {isLoading && (
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted-200 rounded-sm animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <BodySm className="text-red-600">{error}</BodySm>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <BodySm className="text-secondary-400 py-10 text-center">
          No posts yet. Create your first post.
        </BodySm>
      )}

      {!isLoading && posts.map((post) => (
        <AdminPostRow key={post.id} post={post} onDelete={handleDelete} />
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-body-sm text-secondary-500 self-center">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
