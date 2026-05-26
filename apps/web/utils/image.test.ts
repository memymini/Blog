import { describe, it, expect } from 'vitest'
import { canOptimizeImage } from '@/utils/image'

describe('canOptimizeImage()', () => {
  it('returns true for a *.supabase.co subdomain', () => {
    expect(canOptimizeImage('https://abc.supabase.co/storage/v1/object/photo.jpg')).toBe(true)
  })

  it('returns true for a *.supabase.in subdomain', () => {
    expect(canOptimizeImage('https://xyz.supabase.in/photo.jpg')).toBe(true)
  })

  it('returns true for picsum.photos', () => {
    expect(canOptimizeImage('https://picsum.photos/200/300')).toBe(true)
  })

  it('returns false for an unrecognised external host', () => {
    expect(canOptimizeImage('https://cdn.example.com/photo.jpg')).toBe(false)
  })

  it('returns true for a relative path (no hostname to validate)', () => {
    expect(canOptimizeImage('/images/profile.jpg')).toBe(true)
  })

  it('does not match a URL that contains a known domain only in the path, not hostname', () => {
    expect(canOptimizeImage('https://proxy.evil.com/mirror/supabase.co/photo.jpg')).toBe(false)
  })

  it('returns false for an unknown bare domain without a recognised TLD', () => {
    expect(canOptimizeImage('https://supabase.net/photo.jpg')).toBe(false)
  })
})
