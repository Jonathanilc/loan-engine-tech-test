import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/delay', () => ({ delay: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/lib/db', () => ({
  addNoteToTransaction: vi.fn(),
}))

import { revalidatePath } from 'next/cache'
import { addNoteToTransaction } from '@/lib/db'
import { addNote } from '@/actions/add-note'

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v))
  return fd
}

const validData = {
  accountId: 'acc_001',
  transactionId: 'tx_001',
  note: 'This is a valid note',
}

describe('addNote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success:false when note is missing', async () => {
    const fd = makeFormData({ accountId: 'acc_001', transactionId: 'tx_001' })
    const result = await addNote(null, fd)
    expect(result.success).toBe(false)
  })

  it('returns success:false when note is empty string', async () => {
    const fd = makeFormData({ ...validData, note: '' })
    const result = await addNote(null, fd)
    expect(result.success).toBe(false)
  })

  it('returns success:false when note exceeds 500 characters', async () => {
    const fd = makeFormData({ ...validData, note: 'a'.repeat(501) })
    const result = await addNote(null, fd)
    expect(result.success).toBe(false)
  })

  it('returns success:false when accountId is missing', async () => {
    const fd = makeFormData({ transactionId: 'tx_001', note: 'hello' })
    const result = await addNote(null, fd)
    expect(result.success).toBe(false)
  })

  it('returns success:false when transactionId is missing', async () => {
    const fd = makeFormData({ accountId: 'acc_001', note: 'hello' })
    const result = await addNote(null, fd)
    expect(result.success).toBe(false)
  })

  it('returns success:true on valid input', async () => {
    const fd = makeFormData(validData)
    const result = await addNote(null, fd)
    expect(result.success).toBe(true)
  })

  it('calls addNoteToTransaction with correct args on success', async () => {
    const fd = makeFormData(validData)
    await addNote(null, fd)
    expect(addNoteToTransaction).toHaveBeenCalledWith(
      'acc_001',
      'tx_001',
      'This is a valid note'
    )
  })

  it('calls revalidatePath with correct path on success', async () => {
    const fd = makeFormData(validData)
    await addNote(null, fd)
    expect(revalidatePath).toHaveBeenCalledWith('/accounts/acc_001')
  })

  it('does not call revalidatePath on validation failure', async () => {
    const fd = makeFormData({ ...validData, note: '' })
    await addNote(null, fd)
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
