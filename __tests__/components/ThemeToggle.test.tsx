import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockSetTheme = vi.hoisted(() => vi.fn())
const mockUseTheme = vi.hoisted(() =>
  vi.fn(() => ({ theme: 'light', setTheme: mockSetTheme }))
)

vi.mock('next-themes', () => ({
  useTheme: mockUseTheme,
}))

import { ThemeToggle } from '@/components/theme-toggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: mockSetTheme })
  })

  it('renders a button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('button has an accessible label', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('calls setTheme with dark when current theme is light', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme with light when current theme is dark', async () => {
    mockUseTheme.mockReturnValueOnce({ theme: 'dark', setTheme: mockSetTheme })
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })
})
