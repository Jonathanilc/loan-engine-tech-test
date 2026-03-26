import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/app/accounts/[accountId]/_components/AddNoteDialog', () => ({
  AddNoteDialog: () => <button>Note</button>,
}))
vi.mock('@/app/accounts/[accountId]/_components/FlagButton', () => ({
  FlagButton: () => <button>Flag</button>,
}))

import { TransactionRow } from '@/app/accounts/[accountId]/_components/TransactionRow'

const base = {
  id: 'tx_001',
  type: 'incoming' as const,
  amount: 1500.5,
  description: 'Loan disbursement',
  date: '2026-01-05',
  status: 'completed' as const,
  note: null,
  flagged: false,
}

describe('TransactionRow', () => {
  it('renders the transaction description', () => {
    render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    expect(screen.getByText('Loan disbursement')).toBeInTheDocument()
  })

  it('renders the formatted date', () => {
    render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    expect(screen.getByText('Jan 5, 2026')).toBeInTheDocument()
  })

  it('renders incoming amount with + prefix', () => {
    render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    expect(screen.getByText('+$1,500.50')).toBeInTheDocument()
  })

  it('renders outgoing amount with - prefix', () => {
    render(<table><tbody><TransactionRow transaction={{ ...base, type: 'outgoing' }} accountId="acc_001" /></tbody></table>)
    expect(screen.getByText('-$1,500.50')).toBeInTheDocument()
  })

  it('applies green text class for incoming amount', () => {
    render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    const amount = screen.getByText('+$1,500.50')
    expect(amount.className).toMatch(/emerald/)
  })

  it('renders the type badge', () => {
    render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    expect(screen.getByText('incoming')).toBeInTheDocument()
  })

  it('renders the status badge', () => {
    render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    expect(screen.getByText('completed')).toBeInTheDocument()
  })

  it('renders note text below description when note exists', () => {
    render(<table><tbody><TransactionRow transaction={{ ...base, note: 'Test note' }} accountId="acc_001" /></tbody></table>)
    expect(screen.getByText('Test note')).toBeInTheDocument()
  })

  it('does not render note section when note is null', () => {
    render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    expect(screen.queryByTestId('transaction-note')).toBeNull()
  })

  it('applies flagged row background when flagged is true', () => {
    const { container } = render(<table><tbody><TransactionRow transaction={{ ...base, flagged: true }} accountId="acc_001" /></tbody></table>)
    const row = container.querySelector('tr')
    expect(row?.className).toMatch(/destructive/)
  })

  it('does not apply flagged class when flagged is false', () => {
    const { container } = render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    const row = container.querySelector('tr')
    expect(row?.className).not.toMatch(/destructive/)
  })

  it('renders the AddNoteDialog', () => {
    render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    expect(screen.getByText('Note')).toBeInTheDocument()
  })

  it('renders the FlagButton', () => {
    render(<table><tbody><TransactionRow transaction={base} accountId="acc_001" /></tbody></table>)
    expect(screen.getByText('Flag')).toBeInTheDocument()
  })
})
