import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/delay', () => ({ delay: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/lib/db', () => ({
  toggleTransactionFlag: vi.fn(),
}))

import { revalidatePath } from 'next/cache'
import { toggleTransactionFlag } from '@/lib/db'
import { flagTransaction } from '@/actions/flag-transaction'

describe('flagTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls toggleTransactionFlag with correct accountId and transactionId', async () => {
    await flagTransaction('acc_001', 'tx_005')
    expect(toggleTransactionFlag).toHaveBeenCalledWith('acc_001', 'tx_005')
  })

  it('calls revalidatePath with the correct account path', async () => {
    await flagTransaction('acc_001', 'tx_005')
    expect(revalidatePath).toHaveBeenCalledWith('/accounts/acc_001')
  })

  it('works when transaction is initially unflagged', async () => {
    await flagTransaction('acc_001', 'tx_001')
    expect(toggleTransactionFlag).toHaveBeenCalledTimes(1)
  })

  it('works when transaction is initially flagged', async () => {
    await flagTransaction('acc_001', 'tx_005')
    expect(toggleTransactionFlag).toHaveBeenCalledTimes(1)
  })
})
