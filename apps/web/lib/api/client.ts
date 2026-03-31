import type { ApiResponse, PaginatedResponse } from "@repo/types";
import { ApiError, type RequestOptions } from "./types";

const SERVER_URL = process.env.API_URL ?? "http://localhost:4000";
const CLIENT_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function isClient() {
  return typeof window !== "undefined";
}

function getBaseUrl() {
  return isClient() ? CLIENT_URL : SERVER_URL;
}

/**
 * Core typed fetch wrapper. Unwraps ApiResponse<T> and PaginatedResponse<T>
 * envelopes automatically — callers receive T directly.
 *
 * - Client-side: sends cookies automatically via `credentials: 'include'`
 * - Server-side (RSC): plain fetch, no credentials injected here
 *
 * Throws ApiError on non-2xx responses.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, skipAuth: _skipAuth, ...init } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  const fetchOptions: RequestInit = {
    ...init,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  // Browser: include cookies so NestJS receives the httpOnly token cookie
  if (isClient()) {
    fetchOptions.credentials = "include";
  }

  const res = await fetch(`${getBaseUrl()}${path}`, fetchOptions);

  if (!res.ok) {
    let errorBody: unknown;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text();
    }
    const message =
      typeof errorBody === "object" &&
      errorBody !== null &&
      "message" in errorBody
        ? String((errorBody as { message: unknown }).message)
        : res.statusText;
    throw new ApiError(res.status, message, errorBody);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  const json = (await res.json()) as ApiResponse<T> | PaginatedResponse<T> | T;

  // Unwrap ApiResponse / PaginatedResponse envelopes
  if (json !== null && typeof json === "object" && "success" in json) {
    const envelope = json as ApiResponse<T>;
    if (!envelope.success) {
      throw new ApiError(res.status, envelope.error ?? "Unknown error");
    }
    // PaginatedResponse — return the full object so callers can read .meta
    if ("meta" in json) return json as unknown as T;
    return envelope.data as T;
  }

  return json as T;
}

/**
 * Authenticated fetch for server-side RSC calls (Route Handlers, Server Components).
 * Reads the `token` httpOnly cookie via next/headers and forwards it as Bearer.
 */
export async function authFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return apiFetch<T>(path, { ...options, headers });
}
