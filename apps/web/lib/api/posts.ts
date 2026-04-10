import type {
  PostListItem,
  PostDetail,
  PaginatedResponse,
  ListPostsQuery,
} from "@repo/types";
import { apiFetch } from "./client";
import { ApiError } from "./types";
import { getMockPosts, getMockPost } from "@/__mocks__/mock-posts";
import { USE_MOCK } from "@/lib/constants";

export async function listPosts(
  params: ListPostsQuery,
): Promise<PaginatedResponse<PostListItem>> {
  if (USE_MOCK) return getMockPosts(params);

  const query = new URLSearchParams();
  query.set("lang", params.lang);
  if (params.country) query.set("country", params.country);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  // Let errors propagate — callers rely on error.tsx boundary,
  // not on a silent empty list, to signal server failures.
  return await apiFetch<PaginatedResponse<PostListItem>>(`/posts?${query}`);
}

export async function getPost(
  id: number,
  lang: string,
): Promise<PostDetail | null> {
  if (USE_MOCK) return getMockPost(id, lang);

  try {
    return await apiFetch<PostDetail>(`/posts/${id}?lang=${lang}`);
  } catch (err) {
    // 404 → genuine "not found"; page should call notFound()
    if (err instanceof ApiError && err.statusCode === 404) return null;
    // Everything else (5xx, network) → propagate to error boundary
    throw err;
  }
}
