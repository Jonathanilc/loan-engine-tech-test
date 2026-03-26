import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/actions/flag-transaction', () => ({
  flagTransaction: vi.fn().mockResolvedValue(undefined),
}))

import { FlagButton } from '@/app/accounts/[accountId]/_components/FlagButton'

describe('FlagButton', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders a button with an accessible label', () => {
    render(<FlagButton accountId="acc_001" transactionId="tx_001" initialFlagged={false} />)
    expect(screen.getByRole('button', { name: /flag/i })).toBeInTheDocument()
  })

  it('button does not have flagged class when initialFlagged is false', () => {
    const { container } = render(<FlagButton accountId="acc_001" transactionId="tx_001" initialFlagged={false} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('class')).not.toMatch(/fill/)
  })

  it('button has flagged class when initialFlagged is true', () => {
    const { container } = render(<FlagButton accountId="acc_001" transactionId="tx_001" initialFlagged={true} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('class')).toMatch(/fill/)
  })

  it('calls flagTransaction with correct args on click', async () => {
    const { flagTransaction } = await import('@/actions/flag-transaction')
    render(<FlagButton accountId="acc_001" transactionId="tx_001" initialFlagged={false} />)
    await userEvent.click(screen.getByRole('button', { name: /flag/i }))
    expect(flagTransaction).toHaveBeenCalledWith('acc_001', 'tx_001')
  })

  it('applies optimistic toggle immediately on click', async () => {
    const { flagTransaction } = await import('@/actions/flag-transaction')
    let resolve: () => void
    vi.mocked(flagTransaction).mockReturnValueOnce(new Promise<void>((r) => { resolve = r }))

    const { container } = render(<FlagButton accountId="acc_001" transactionId="tx_001" initialFlagged={false} />)
    await userEvent.click(screen.getByRole('button', { name: /flag/i }))

    // Optimistic: icon should show flagged state before server responds
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('class')).toMatch(/fill/)

    resolve!()
  })
})
