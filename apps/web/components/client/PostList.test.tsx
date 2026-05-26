import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostList } from '@/components/client/PostList'
import type { PostListItem } from '@repo/types'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const POSTS: PostListItem[] = [
  {
    id: 1,
    country_code: 'JP',
    published: true,
    cover_url: null,
    created_at: new Date(2026, 4, 21, 12, 0, 0).toISOString(),
    updated_at: new Date(2026, 4, 21, 12, 0, 0).toISOString(),
    translation: { post_id: 1, lang: 'ko', title: '도쿄 여행기', excerpt: null },
    country: { code: 'JP', name_en: 'Japan', flag_url: '🇯🇵' },
  },
  {
    id: 2,
    country_code: 'KR',
    published: true,
    cover_url: null,
    created_at: new Date(2026, 3, 10, 12, 0, 0).toISOString(),
    updated_at: new Date(2026, 3, 10, 12, 0, 0).toISOString(),
    translation: { post_id: 2, lang: 'ko', title: '서울 산책', excerpt: null },
    country: { code: 'KR', name_en: 'Korea', flag_url: '🇰🇷' },
  },
]

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PostList — with posts', () => {
  it('renders a list item for every post', () => {
    render(<PostList posts={POSTS} lang="ko" />)
    expect(screen.getByText('도쿄 여행기')).toBeInTheDocument()
    expect(screen.getByText('서울 산책')).toBeInTheDocument()
  })

  it('generates the correct href for each post link', () => {
    render(<PostList posts={POSTS} lang="ko" />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/ko/posts/1')
    expect(links[1]).toHaveAttribute('href', '/ko/posts/2')
  })

  it('includes the country flag emoji alongside the formatted date', () => {
    render(<PostList posts={POSTS} lang="ko" />)
    expect(screen.getByText(/🇯🇵/)).toBeInTheDocument()
    expect(screen.getByText(/🇰🇷/)).toBeInTheDocument()
  })

  it('formats dates as YYYY.MM.DD', () => {
    render(<PostList posts={POSTS} lang="ko" />)
    expect(screen.getAllByText(/2026\.\d{2}\.\d{2}/)).toHaveLength(2)
  })

  it('passes lang="en" links correctly for English locale', () => {
    render(<PostList posts={POSTS} lang="en" />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/en/posts/1')
  })
})

describe('PostList — empty state', () => {
  it('shows the Korean empty message when lang="ko"', () => {
    render(<PostList posts={[]} lang="ko" />)
    expect(screen.getByText('게시물이 없어요.')).toBeInTheDocument()
    expect(screen.getByText('다른 나라나 언어를 선택해 보세요.')).toBeInTheDocument()
  })

  it('shows the English empty message when lang="en"', () => {
    render(<PostList posts={[]} lang="en" />)
    expect(screen.getByText('No posts found')).toBeInTheDocument()
    expect(
      screen.getByText('Try selecting a different country or language.'),
    ).toBeInTheDocument()
  })

  it('does not render any list items when posts is empty', () => {
    render(<PostList posts={[]} lang="ko" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
