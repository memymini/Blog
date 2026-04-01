import type {
  PostListItem,
  PostDetail,
  PaginatedResponse,
  ListPostsQuery,
} from "@repo/types";
import { apiFetch } from "./client";
import { getMockPosts, getMockPost } from "@/lib/mock-data";

const USE_MOCK =
  process.env.USE_MOCK === "true" || process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function listPosts(
  params: ListPostsQuery,
): Promise<PaginatedResponse<PostListItem>> {
  if (USE_MOCK) return getMockPosts(params);

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
  if (USE_MOCK) return getMockPost(id, lang);

  try {
    return await apiFetch<PostDetail>(`/posts/${id}?lang=${lang}`);
  } catch {
    return null;
  }
}
