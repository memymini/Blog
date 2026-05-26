import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, usePathname } from 'next/navigation'
import { LanguageToggleNav } from '@/components/client/LanguageToggleNav'

// ── Helpers ───────────────────────────────────────────────────────────────────

function setupRouterMock(path: string) {
  const push = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    push,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  } as ReturnType<typeof useRouter>)
  vi.mocked(usePathname).mockReturnValue(path)
  return { push }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('LanguageToggleNav', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockClear()
    vi.mocked(usePathname).mockClear()
  })

  it('displays "EN" and aria-label "Switch to English" when currentLang is "ko"', () => {
    setupRouterMock('/ko/posts')
    render(<LanguageToggleNav currentLang="ko" />)
    const btn = screen.getByRole('button', { name: /Switch to English/i })
    expect(btn).toHaveTextContent('EN')
  })

  it('displays "KR" and aria-label "Switch to Korean" when currentLang is "en"', () => {
    setupRouterMock('/en/posts')
    render(<LanguageToggleNav currentLang="en" />)
    const btn = screen.getByRole('button', { name: /Switch to Korean/i })
    expect(btn).toHaveTextContent('KR')
  })

  it('navigates to the /en/ path when toggling from ko', async () => {
    const { push } = setupRouterMock('/ko/posts/1')
    render(<LanguageToggleNav currentLang="ko" />)
    await userEvent.click(screen.getByRole('button'))
    expect(push).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith('/en/posts/1')
  })

  it('navigates to the /ko/ path when toggling from en', async () => {
    const { push } = setupRouterMock('/en/posts/5')
    render(<LanguageToggleNav currentLang="en" />)
    await userEvent.click(screen.getByRole('button'))
    expect(push).toHaveBeenCalledWith('/ko/posts/5')
  })

  it('replaces only the lang prefix, not a lang string elsewhere in the path', async () => {
    // "/ko/posts/en-style" — "en" in the slug must NOT be touched
    const { push } = setupRouterMock('/ko/posts/en-style')
    render(<LanguageToggleNav currentLang="ko" />)
    await userEvent.click(screen.getByRole('button'))
    expect(push).toHaveBeenCalledWith('/en/posts/en-style')
  })

  it('works correctly for nested paths like /ko/posts/3', async () => {
    const { push } = setupRouterMock('/ko/posts/3')
    render(<LanguageToggleNav currentLang="ko" />)
    await userEvent.click(screen.getByRole('button'))
    expect(push).toHaveBeenCalledWith('/en/posts/3')
  })
})
