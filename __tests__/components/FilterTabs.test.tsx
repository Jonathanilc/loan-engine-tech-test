import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/accounts/acc_001',
}))

import { FilterTabs } from '@/app/accounts/[accountId]/_components/FilterTabs'

describe('FilterTabs', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders All, Incoming, and Outgoing tabs', () => {
    render(<FilterTabs currentFilter={undefined} accountId="acc_001" />)
    expect(screen.getByRole('tab', { name: /all/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /incoming/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /outgoing/i })).toBeInTheDocument()
  })

  it('marks All tab as selected when currentFilter is undefined', () => {
    render(<FilterTabs currentFilter={undefined} accountId="acc_001" />)
    expect(screen.getByRole('tab', { name: /all/i })).toHaveAttribute('data-active')
  })

  it('marks Incoming tab as selected when currentFilter is incoming', () => {
    render(<FilterTabs currentFilter="incoming" accountId="acc_001" />)
    expect(screen.getByRole('tab', { name: /incoming/i })).toHaveAttribute('data-active')
  })

  it('marks Outgoing tab as selected when currentFilter is outgoing', () => {
    render(<FilterTabs currentFilter="outgoing" accountId="acc_001" />)
    expect(screen.getByRole('tab', { name: /outgoing/i })).toHaveAttribute('data-active')
  })

  it('calls router.push with ?filter=incoming when Incoming is clicked', async () => {
    render(<FilterTabs currentFilter={undefined} accountId="acc_001" />)
    await userEvent.click(screen.getByRole('tab', { name: /incoming/i }))
    expect(mockPush).toHaveBeenCalledWith('/accounts/acc_001?filter=incoming')
  })

  it('calls router.push with ?filter=outgoing when Outgoing is clicked', async () => {
    render(<FilterTabs currentFilter={undefined} accountId="acc_001" />)
    await userEvent.click(screen.getByRole('tab', { name: /outgoing/i }))
    expect(mockPush).toHaveBeenCalledWith('/accounts/acc_001?filter=outgoing')
  })

  it('calls router.push with no filter param when All is clicked', async () => {
    render(<FilterTabs currentFilter="incoming" accountId="acc_001" />)
    await userEvent.click(screen.getByRole('tab', { name: /all/i }))
    expect(mockPush).toHaveBeenCalledWith('/accounts/acc_001')
  })
})
