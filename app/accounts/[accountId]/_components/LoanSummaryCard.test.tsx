import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/delay', () => ({ delay: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/lib/db', () => ({
  getAccount: vi.fn().mockReturnValue({
    id: 'acc_001',
    borrowerName: 'Jonathan Xu',
    principal: 50000,
    outstandingBalance: 34218.5,
    interestRate: 6.75,
    nextPaymentDate: '2026-04-15',
    nextPaymentAmount: 987.23,
    transactions: [],
  }),
}))

import { LoanSummaryCard } from '@/app/accounts/[accountId]/_components/LoanSummaryCard'

describe('LoanSummaryCard', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the borrower name', async () => {
    render(await LoanSummaryCard({ accountId: 'acc_001' }))
    expect(screen.getByText('Jonathan Xu')).toBeInTheDocument()
  })

  it('renders the outstanding balance formatted as currency', async () => {
    render(await LoanSummaryCard({ accountId: 'acc_001' }))
    expect(screen.getByText('$34,218.50')).toBeInTheDocument()
  })

  it('renders the principal amount', async () => {
    render(await LoanSummaryCard({ accountId: 'acc_001' }))
    expect(screen.getByText('$50,000.00')).toBeInTheDocument()
  })

  it('renders the interest rate with % suffix', async () => {
    render(await LoanSummaryCard({ accountId: 'acc_001' }))
    expect(screen.getByText('6.75%')).toBeInTheDocument()
  })

  it('renders the next payment amount', async () => {
    render(await LoanSummaryCard({ accountId: 'acc_001' }))
    expect(screen.getByText('$987.23')).toBeInTheDocument()
  })

  it('renders the next payment date', async () => {
    render(await LoanSummaryCard({ accountId: 'acc_001' }))
    expect(screen.getByText('Apr 15, 2026')).toBeInTheDocument()
  })

  it('renders a progress bar element', async () => {
    render(await LoanSummaryCard({ accountId: 'acc_001' }))
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('returns null when account is not found', async () => {
    const { getAccount } = await import('@/lib/db')
    vi.mocked(getAccount).mockReturnValueOnce(undefined)
    const { container } = render(await LoanSummaryCard({ accountId: 'unknown' }))
    expect(container.firstChild).toBeNull()
  })
})
