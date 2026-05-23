import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// ── Next.js built-ins ──────────────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/ko/posts'),
  useParams: vi.fn(() => ({ lang: 'ko' })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  notFound: vi.fn(),
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
  cookies: vi.fn(() => ({
    get: vi.fn(() => undefined),
    has: vi.fn(() => false),
  })),
}))

vi.mock('next/config', () => ({
  default: vi.fn(() => ({ publicRuntimeConfig: {}, serverRuntimeConfig: {} })),
}))

// Render next/image as a plain <img> — the Next.js optimizer does not run in jsdom.
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string
    alt: string
    className?: string
    fill?: boolean
    priority?: boolean
    sizes?: string
    placeholder?: string
    blurDataURL?: string
    width?: number
    height?: number
  }) => <img src={src} alt={alt} className={className} data-testid="next-image" />,
}))

// Render next/link as a plain anchor — Next.js prefetching is irrelevant in tests.
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    ...rest
  }: {
    href: string
    children: React.ReactNode
    className?: string
    [key: string]: unknown
  }) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}))

// ── Browser storage ────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear()
})
