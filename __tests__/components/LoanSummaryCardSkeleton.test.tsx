import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoanSummaryCardSkeleton } from '@/app/accounts/[accountId]/_components/LoanSummaryCardSkeleton'

describe('LoanSummaryCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoanSummaryCardSkeleton />)
    expect(container.firstChild).not.toBeNull()
  })

  it('renders skeleton elements', () => {
    const { container } = render(<LoanSummaryCardSkeleton />)
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('does not render any real data values', () => {
    render(<LoanSummaryCardSkeleton />)
    expect(screen.queryByText(/\$/)).toBeNull()
    expect(screen.queryByText(/%/)).toBeNull()
  })
})
