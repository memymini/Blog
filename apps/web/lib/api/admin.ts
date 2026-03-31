import type {
  AdminPostListItem,
  AdminPostDetail,
  CreatePostPayload,
  UpdatePostPayload,
  CreateMediaPayload,
  PostMedia,
  PaginatedResponse,
} from "@repo/types";
import { apiFetch } from "./client";

// All admin calls go directly to NestJS. The httpOnly cookie is sent
// automatically via credentials: 'include' (set in apiFetch for browser).

const BASE = "/admin/posts";

export async function listAdminPosts(
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<AdminPostListItem>> {
  return apiFetch<PaginatedResponse<AdminPostListItem>>(
    `${BASE}?page=${page}&limit=${limit}`,
  );
}

export async function getAdminPost(id: number): Promise<AdminPostDetail> {
  return apiFetch<AdminPostDetail>(`${BASE}/${id}`);
}

export async function createPost(
  payload: CreatePostPayload,
): Promise<AdminPostDetail> {
  return apiFetch<AdminPostDetail>(BASE, { method: "POST", body: payload });
}

export async function updatePost(
  id: number,
  payload: UpdatePostPayload,
): Promise<AdminPostDetail> {
  return apiFetch<AdminPostDetail>(`${BASE}/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deletePost(id: number): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
}

export async function uploadCover(
  id: number,
  file: File,
): Promise<{ url: string }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${apiUrl}${BASE}/${id}/cover`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) throw new Error("Cover upload failed");
  return res.json() as Promise<{ url: string }>;
}

export async function listMedia(id: number): Promise<PostMedia[]> {
  return apiFetch<PostMedia[]>(`${BASE}/${id}/media`);
}

export async function addMedia(
  id: number,
  payload: CreateMediaPayload,
): Promise<PostMedia> {
  return apiFetch<PostMedia>(`${BASE}/${id}/media`, {
    method: "POST",
    body: payload,
  });
}

export async function deleteMedia(
  postId: number,
  mediaId: number,
): Promise<void> {
  return apiFetch<void>(`${BASE}/${postId}/media/${mediaId}`, {
    method: "DELETE",
  });
}
