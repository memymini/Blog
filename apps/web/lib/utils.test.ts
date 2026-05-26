import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

// ── cn() ──────────────────────────────────────────────────────────────────────

describe('cn()', () => {
  it('joins two plain class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('resolves Tailwind conflicts — last declaration wins', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('includes classes whose condition is true', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active')
  })

  it('excludes classes whose condition is false', () => {
    expect(cn('base', { hidden: false })).toBe('base')
  })

  it('handles undefined, null, and empty string gracefully', () => {
    expect(() => cn(undefined, null, '')).not.toThrow()
    expect(cn(undefined, 'ok')).toBe('ok')
  })

  it('deduplicates identical class names', () => {
    expect(cn('flex', 'flex')).toBe('flex')
  })
})

// ── formatDate() ──────────────────────────────────────────────────────────────

describe('formatDate()', () => {
  it('returns a string matching YYYY.MM.DD', () => {
    // Use a local-time Date to avoid timezone-shift edge cases
    const d = new Date(2026, 4, 21, 12, 0, 0) // May 21 2026 at noon, local time
    expect(formatDate(d.toISOString())).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
  })

  it('extracts the correct year', () => {
    const d = new Date(2026, 5, 15, 12, 0, 0) // June 15 2026, local noon
    expect(formatDate(d.toISOString())).toMatch(/^2026\./)
  })

  it('pads single-digit months with a leading zero', () => {
    const d = new Date(2026, 0, 15, 12, 0, 0) // January 15 2026, local noon
    const [, month] = formatDate(d.toISOString()).split('.')
    expect(month).toBe('01')
  })

  it('pads single-digit days with a leading zero', () => {
    const d = new Date(2026, 2, 5, 12, 0, 0) // March 5 2026, local noon
    const [,, day] = formatDate(d.toISOString()).split('.')
    expect(day).toBe('05')
  })
})
