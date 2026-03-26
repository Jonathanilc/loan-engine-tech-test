import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockTransactions = vi.hoisted(() => [
  { id: 'tx_001', type: 'incoming', amount: 1000, description: 'Payment A', date: '2026-01-01', status: 'completed', note: null, flagged: false },
  { id: 'tx_002', type: 'outgoing', amount: 500,  description: 'Payment B', date: '2026-01-02', status: 'pending',   note: null, flagged: false },
])

vi.mock('@/lib/delay', () => ({ delay: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/lib/db', () => ({
  getTransactions: vi.fn().mockReturnValue(mockTransactions),
}))
vi.mock('@/app/accounts/[accountId]/_components/TransactionRow', () => ({
  TransactionRow: ({ transaction }: { transaction: { id: string; description: string } }) => (
    <tr data-testid={`row-${transaction.id}`}>
      <td>{transaction.description}</td>
    </tr>
  ),
}))

import { TransactionTable } from '@/app/accounts/[accountId]/_components/TransactionTable'

describe('TransactionTable', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders a table element', async () => {
    render(await TransactionTable({ accountId: 'acc_001', filter: undefined }))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders a row for each transaction', async () => {
    render(await TransactionTable({ accountId: 'acc_001', filter: undefined }))
    expect(screen.getByTestId('row-tx_001')).toBeInTheDocument()
    expect(screen.getByTestId('row-tx_002')).toBeInTheDocument()
  })

  it('renders an empty state when there are no transactions', async () => {
    const { getTransactions } = await import('@/lib/db')
    vi.mocked(getTransactions).mockReturnValueOnce([])
    render(await TransactionTable({ accountId: 'acc_001', filter: undefined }))
    expect(screen.getByText(/no transactions/i)).toBeInTheDocument()
  })

  it('includes the active filter in the empty state message', async () => {
    const { getTransactions } = await import('@/lib/db')
    vi.mocked(getTransactions).mockReturnValueOnce([])
    render(await TransactionTable({ accountId: 'acc_001', filter: 'incoming' }))
    expect(screen.getByText(/no incoming transactions/i)).toBeInTheDocument()
  })
})
