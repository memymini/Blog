import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { ToastProvider, useToast } from '@/components/ui/Toast'

// ── Helper components ──────────────────────────────────────────────────────────

function ShowButton({
  message = 'Hello toast',
  type,
}: {
  message?: string
  type?: 'success' | 'error'
}) {
  const { showToast } = useToast()
  return <button onClick={() => showToast(message, type)}>show</button>
}

function Wrapped({
  message,
  type,
}: {
  message?: string
  type?: 'success' | 'error'
}) {
  return (
    <ToastProvider>
      <ShowButton message={message} type={type} />
    </ToastProvider>
  )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Toast / ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('displays a toast message when showToast is called', () => {
    render(<Wrapped message="Post saved!" type="success" />)
    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    expect(screen.getByText('Post saved!')).toBeInTheDocument()
  })

  it('auto-dismisses the toast after 3000 ms', () => {
    render(<Wrapped message="Disappearing" />)
    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    expect(screen.getByText('Disappearing')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.queryByText('Disappearing')).not.toBeInTheDocument()
  })

  it('does not dismiss before 3000 ms have elapsed', () => {
    render(<Wrapped message="Still here" />)
    fireEvent.click(screen.getByRole('button', { name: 'show' }))

    act(() => {
      vi.advanceTimersByTime(2999)
    })

    expect(screen.getByText('Still here')).toBeInTheDocument()
  })

  it('dismisses immediately when the ✕ button is clicked', () => {
    render(<Wrapped message="Click to dismiss" />)
    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    expect(screen.getByText('Click to dismiss')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(screen.queryByText('Click to dismiss')).not.toBeInTheDocument()
  })

  it('stacks multiple toasts when showToast is called repeatedly', () => {
    render(<Wrapped message="Stacked" />)
    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    expect(screen.getAllByText('Stacked')).toHaveLength(2)
  })

  it('renders success toasts with the dark background', () => {
    render(<Wrapped message="Done" type="success" />)
    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    // ToastItem uses role="status"
    expect(screen.getByRole('status')).toHaveClass('bg-primary-900')
  })

  it('renders error toasts with the red background', () => {
    render(<Wrapped message="Oops" type="error" />)
    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    expect(screen.getByRole('status')).toHaveClass('bg-red-600')
  })

  it('throws when useToast is called outside ToastProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<ShowButton />)).toThrow(
      'useToast must be used within ToastProvider',
    )
    consoleSpy.mockRestore()
  })
})
