'use server'

import { revalidatePath } from 'next/cache'
import { delay } from '@/lib/delay'
import { toggleTransactionFlag } from '@/lib/db'

export async function flagTransaction(
  accountId: string,
  transactionId: string
): Promise<void> {
  await delay()
  toggleTransactionFlag(accountId, transactionId)
  revalidatePath(`/accounts/${accountId}`)
}
