import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}))

import { NavBar } from '@/components/nav-bar'

describe('NavBar', () => {
  it('renders a nav landmark element', () => {
    render(<NavBar />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders the brand name', () => {
    render(<NavBar />)
    expect(screen.getByText(/loan engine/i)).toBeInTheDocument()
  })

  it('renders the theme toggle button', () => {
    render(<NavBar />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })
})
