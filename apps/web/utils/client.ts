import type { ApiResponse, PaginatedResponse } from "@repo/types";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip cookie-based auth injection (for public endpoints) */
  skipAuth?: boolean;
}

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
 * - Client-side: reads JWT from localStorage and sends as Authorization: Bearer header
 * - Server-side (RSC): plain fetch, no auth injected
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

  // Browser: attach JWT from localStorage as Bearer token
  if (isClient() && !headers["Authorization"]) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...init,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  const targetUrl = `${getBaseUrl()}${path}`;
  let res: Response;
  try {
    res = await fetch(targetUrl, fetchOptions);
  } catch (firstErr) {
    // One automatic retry after 1 s — covers transient failures such as the
    // NestJS hot-reload restart window (~1-2 s) without masking real outages.
    await new Promise((r) => setTimeout(r, 1000));
    try {
      res = await fetch(targetUrl, fetchOptions);
    } catch (err) {
      const cause = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Network request failed — ${fetchOptions.method ?? 'GET'} ${targetUrl}: ${cause}`,
        { cause: err instanceof Error ? err : firstErr },
      );
    }
  }

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
