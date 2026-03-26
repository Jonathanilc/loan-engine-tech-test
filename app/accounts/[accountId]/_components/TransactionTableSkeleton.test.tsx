import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TransactionTableSkeleton } from '@/app/accounts/[accountId]/_components/TransactionTableSkeleton'

describe('TransactionTableSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<TransactionTableSkeleton />)
    expect(container.firstChild).not.toBeNull()
  })

  it('renders exactly 8 skeleton rows', () => {
    const { container } = render(<TransactionTableSkeleton />)
    const rows = container.querySelectorAll('[data-testid="skeleton-row"]')
    expect(rows).toHaveLength(8)
  })

  it('does not render any real transaction data', () => {
    render(<TransactionTableSkeleton />)
    expect(screen.queryByText(/tx_/)).toBeNull()
    expect(screen.queryByText(/\$/)).toBeNull()
  })
})
