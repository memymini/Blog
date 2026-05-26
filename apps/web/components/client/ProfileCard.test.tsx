import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileCard } from '@/components/client/ProfileCard'

describe('ProfileCard', () => {
  it('renders the Korean name when lang="ko"', () => {
    render(<ProfileCard lang="ko" />)
    expect(screen.getByText('미니 | Travelog')).toBeInTheDocument()
  })

  it('renders the English name when lang="en"', () => {
    render(<ProfileCard lang="en" />)
    expect(screen.getByText('Minnie | Travelog')).toBeInTheDocument()
  })

  it('uses the localised name as the image alt text', () => {
    render(<ProfileCard lang="en" />)
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Minnie | Travelog')
  })

  it('always displays the email address regardless of language', () => {
    render(<ProfileCard lang="ko" />)
    expect(screen.getByText('minhi0614@gmail.com')).toBeInTheDocument()
  })

  it('always displays the location string', () => {
    render(<ProfileCard lang="en" />)
    expect(screen.getByText(/Korea/)).toBeInTheDocument()
  })

  it('renders each interest emoji', () => {
    render(<ProfileCard lang="ko" />)
    expect(screen.getByText('✈️')).toBeInTheDocument()
    expect(screen.getByText('☕️')).toBeInTheDocument()
  })
})
