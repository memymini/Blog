import type { ApiResponse, PaginatedResponse } from '@repo/types';

/** Wrap a successful result in the standard ApiResponse envelope. */
export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null };
}

/** Wrap a paginated list in the standard PaginatedResponse envelope. */
export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  return { success: true, data, error: null, meta: { total, page, limit } };
}
