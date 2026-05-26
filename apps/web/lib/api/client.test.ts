import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch } from '@/lib/api/client'
import { ApiError } from '@/lib/api/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeResponse(
  body: unknown,
  opts: { ok?: boolean; status?: number } = {},
): Response {
  const { ok = true, status = 200 } = opts
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
    text: vi.fn().mockResolvedValue(String(body)),
  } as unknown as Response
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('apiFetch()', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('unwraps { success: true, data: T } and returns T directly', async () => {
    vi.mocked(fetch).mockResolvedValue(
      makeResponse({ success: true, data: { id: 1, title: 'Hello' }, error: null }),
    )
    const result = await apiFetch<{ id: number; title: string }>('/posts/1')
    expect(result).toEqual({ id: 1, title: 'Hello' })
  })

  it('returns the full PaginatedResponse object when the response includes a meta key', async () => {
    const payload = {
      success: true,
      data: [{ id: 1 }],
      error: null,
      meta: { total: 1, page: 1, limit: 20 },
    }
    vi.mocked(fetch).mockResolvedValue(makeResponse(payload))
    const result = await apiFetch('/posts')
    expect(result).toMatchObject({ data: [{ id: 1 }], meta: { total: 1 } })
  })

  it('throws ApiError when the envelope has success: false', async () => {
    vi.mocked(fetch).mockResolvedValue(
      makeResponse({ success: false, data: null, error: 'Post not found' }),
    )
    await expect(apiFetch('/posts/999')).rejects.toThrow(ApiError)
    await expect(apiFetch('/posts/999')).rejects.toThrow('Post not found')
  })

  it('throws ApiError carrying the HTTP status code on a non-2xx response', async () => {
    vi.mocked(fetch).mockResolvedValue(
      makeResponse({ message: 'Unauthorized' }, { ok: false, status: 401 }),
    )
    const err = await apiFetch('/admin/posts').catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).statusCode).toBe(401)
  })

  it('returns undefined for a 204 No Content response', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, status: 204 } as Response)
    await expect(apiFetch('/admin/posts/1')).resolves.toBeUndefined()
  })

  it('attaches Authorization: Bearer header when a token is in localStorage', async () => {
    localStorage.setItem('token', 'jwt-test-token')
    vi.mocked(fetch).mockResolvedValue(
      makeResponse({ success: true, data: { id: 'u1', email: 'a@b.com', role: 'admin' }, error: null }),
    )
    await apiFetch('/auth/me')
    const [, init] = vi.mocked(fetch).mock.calls[0]
    expect((init?.headers as Record<string, string>)['Authorization']).toBe(
      'Bearer jwt-test-token',
    )
  })

  it('sends no Authorization header when localStorage has no token', async () => {
    vi.mocked(fetch).mockResolvedValue(makeResponse({ success: true, data: [], error: null }))
    await apiFetch('/posts')
    const [, init] = vi.mocked(fetch).mock.calls[0]
    expect((init?.headers as Record<string, string>)['Authorization']).toBeUndefined()
  })

  it('passes plain JSON through when the response lacks a success key', async () => {
    vi.mocked(fetch).mockResolvedValue(makeResponse([{ code: 'KR', name_en: 'Korea' }]))
    const result = await apiFetch('/countries')
    expect(result).toEqual([{ code: 'KR', name_en: 'Korea' }])
  })
})
