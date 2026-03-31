import type {
  PostListItem,
  PostDetail,
  PaginatedResponse,
  ListPostsQuery,
} from "@repo/types";
import { apiFetch } from "./client";

export async function listPosts(
  params: ListPostsQuery,
): Promise<PaginatedResponse<PostListItem>> {
  const query = new URLSearchParams();
  query.set("lang", params.lang);
  if (params.country) query.set("country", params.country);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return apiFetch<PaginatedResponse<PostListItem>>(`/posts?${query}`);
}

export async function getPost(
  id: number,
  lang: string,
): Promise<PostDetail | null> {
  try {
    return await apiFetch<PostDetail>(`/posts/${id}?lang=${lang}`);
  } catch {
    return null;
  }
}
