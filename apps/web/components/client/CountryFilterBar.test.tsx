import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { CountryFilterBar } from '@/components/client/CountryFilterBar'
import type { Country } from '@repo/types'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const COUNTRIES: Country[] = [
  { code: 'KR', name_en: 'Korea', flag_url: '🇰🇷' },
  { code: 'JP', name_en: 'Japan', flag_url: '🇯🇵' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function setupRouter() {
  const push = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    push,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  } as ReturnType<typeof useRouter>)
  return { push }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CountryFilterBar', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockClear()
  })

  it('renders the "All" button plus one button per country', () => {
    setupRouter()
    render(
      <CountryFilterBar countries={COUNTRIES} currentCountry={undefined} lang="ko" />,
    )
    // "All" (🌎) + Korea + Japan = 3 buttons
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getByTitle('Korea')).toBeInTheDocument()
    expect(screen.getByTitle('Japan')).toBeInTheDocument()
  })

  it('navigates to /{lang}/posts?country={code} when a country is clicked', async () => {
    const { push } = setupRouter()
    render(
      <CountryFilterBar countries={COUNTRIES} currentCountry={undefined} lang="ko" />,
    )
    await userEvent.click(screen.getByTitle('Korea'))
    expect(push).toHaveBeenCalledWith('/ko/posts?country=KR')
  })

  it('navigates to /{lang}/posts (no query) when "All" is clicked', async () => {
    const { push } = setupRouter()
    render(
      <CountryFilterBar countries={COUNTRIES} currentCountry="KR" lang="en" />,
    )
    await userEvent.click(screen.getByRole('button', { name: '🌎' }))
    expect(push).toHaveBeenCalledWith('/en/posts')
  })

  it('applies the active style to the selected country button', () => {
    setupRouter()
    render(
      <CountryFilterBar countries={COUNTRIES} currentCountry="JP" lang="ko" />,
    )
    expect(screen.getByTitle('Japan')).toHaveClass('bg-muted-200')
    expect(screen.getByTitle('Korea')).not.toHaveClass('bg-muted-200')
  })

  it('applies the active style to "All" when no country is selected', () => {
    setupRouter()
    render(
      <CountryFilterBar countries={COUNTRIES} currentCountry={undefined} lang="ko" />,
    )
    const allBtn = screen.getByRole('button', { name: '🌎' })
    expect(allBtn).toHaveClass('bg-muted-200')
  })

  it('uses the correct lang segment in the URL for English locale', async () => {
    const { push } = setupRouter()
    render(
      <CountryFilterBar countries={COUNTRIES} currentCountry={undefined} lang="en" />,
    )
    await userEvent.click(screen.getByTitle('Japan'))
    expect(push).toHaveBeenCalledWith('/en/posts?country=JP')
  })
})
