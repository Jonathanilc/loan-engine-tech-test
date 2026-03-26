'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { delay } from '@/lib/delay'
import { addNoteToTransaction } from '@/lib/db'

const schema = z.object({
  accountId: z.string().min(1),
  transactionId: z.string().min(1),
  note: z.string().min(1).max(500),
})

type AddNoteResult =
  | { success: true }
  | { success: false; error: z.ZodError['flatten'] extends (...args: unknown[]) => infer R ? R : never }

export async function addNote(
  _prevState: unknown,
  formData: FormData
): Promise<AddNoteResult> {
  await delay()

  const parsed = schema.safeParse({
    accountId: formData.get('accountId'),
    transactionId: formData.get('transactionId'),
    note: formData.get('note'),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() }
  }

  const { accountId, transactionId, note } = parsed.data
  addNoteToTransaction(accountId, transactionId, note)
  revalidatePath(`/accounts/${accountId}`)

  return { success: true }
}
