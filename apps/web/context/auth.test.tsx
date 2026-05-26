import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/context/auth'
import { ApiError } from '@/utils/client'

// Mock the entire apiFetch layer so tests never reach the network
vi.mock('@/utils/client', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/utils/client'

// ── Shared fixtures ────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: 'user-1',
  email: 'admin@test.com',
  role: 'admin',
}

// ── Helper consumer components ─────────────────────────────────────────────────

function StatusDisplay() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <span>loading</span>
  if (!user) return <span>no user</span>
  return <span>user:{user.email}</span>
}

function LoginButton() {
  const { login } = useAuth()
  return (
    <button onClick={() => login('admin@test.com', 'pass123')}>login</button>
  )
}

function LogoutButton() {
  const { logout } = useAuth()
  return <button onClick={() => void logout()}>logout</button>
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset()
  })

  it('shows "no user" immediately when localStorage has no token', async () => {
    render(
      <AuthProvider>
        <StatusDisplay />
      </AuthProvider>,
    )
    await waitFor(() =>
      expect(screen.getByText('no user')).toBeInTheDocument(),
    )
  })

  it('fetches /auth/me and sets the user when a stored token exists', async () => {
    localStorage.setItem('token', 'valid-jwt')
    vi.mocked(apiFetch).mockResolvedValueOnce(MOCK_USER)

    render(
      <AuthProvider>
        <StatusDisplay />
      </AuthProvider>,
    )

    await waitFor(() =>
      expect(screen.getByText(`user:${MOCK_USER.email}`)).toBeInTheDocument(),
    )
  })

  it('removes an invalid token and shows "no user" when /auth/me rejects', async () => {
    localStorage.setItem('token', 'stale-jwt')
    vi.mocked(apiFetch).mockRejectedValueOnce(new ApiError(401, 'Unauthorized'))

    render(
      <AuthProvider>
        <StatusDisplay />
      </AuthProvider>,
    )

    await waitFor(() =>
      expect(screen.getByText('no user')).toBeInTheDocument(),
    )
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('login() saves the token to localStorage and sets the user', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      access_token: 'new-jwt',
      user: MOCK_USER,
    })

    render(
      <AuthProvider>
        <LoginButton />
        <StatusDisplay />
      </AuthProvider>,
    )

    await waitFor(() => screen.getByText('no user'))
    await userEvent.click(screen.getByRole('button', { name: 'login' }))
    await waitFor(() =>
      expect(screen.getByText(`user:${MOCK_USER.email}`)).toBeInTheDocument(),
    )
    expect(localStorage.getItem('token')).toBe('new-jwt')
  })

  it('logout() removes the token even when the API call fails (ApiError is silenced)', async () => {
    localStorage.setItem('token', 'live-jwt')
    vi.mocked(apiFetch)
      .mockResolvedValueOnce(MOCK_USER)                       // /auth/me on mount
      .mockRejectedValueOnce(new ApiError(500, 'Server error')) // /auth/logout

    render(
      <AuthProvider>
        <LogoutButton />
        <StatusDisplay />
      </AuthProvider>,
    )

    await waitFor(() =>
      expect(screen.getByText(`user:${MOCK_USER.email}`)).toBeInTheDocument(),
    )

    await userEvent.click(screen.getByRole('button', { name: 'logout' }))

    await waitFor(() =>
      expect(screen.getByText('no user')).toBeInTheDocument(),
    )
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('useAuth() throws when called outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<StatusDisplay />)).toThrow(
      'useAuth must be used within AuthProvider',
    )
    consoleSpy.mockRestore()
  })
})
