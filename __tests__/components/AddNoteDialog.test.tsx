import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/actions/add-note', () => ({
  addNote: vi.fn().mockResolvedValue({ success: true }),
}))

import { AddNoteDialog } from '@/app/accounts/[accountId]/_components/AddNoteDialog'

describe('AddNoteDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('dialog is closed by default', () => {
    render(<AddNoteDialog accountId="acc_001" transactionId="tx_001" existingNote={null} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens when the note button is clicked', async () => {
    render(<AddNoteDialog accountId="acc_001" transactionId="tx_001" existingNote={null} />)
    await userEvent.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('pre-populates textarea with existingNote when provided', async () => {
    render(<AddNoteDialog accountId="acc_001" transactionId="tx_001" existingNote="Existing note" />)
    await userEvent.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getByRole('textbox')).toHaveValue('Existing note')
  })

  it('textarea is empty when no existingNote', async () => {
    render(<AddNoteDialog accountId="acc_001" transactionId="tx_001" existingNote={null} />)
    await userEvent.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('submit button is labelled Save Note by default', async () => {
    render(<AddNoteDialog accountId="acc_001" transactionId="tx_001" existingNote={null} />)
    await userEvent.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getByRole('button', { name: /save note/i })).toBeInTheDocument()
  })

  it('shows validation error when action returns error state', async () => {
    const { addNote } = await import('@/actions/add-note')
    vi.mocked(addNote).mockResolvedValueOnce({
      success: false,
      error: { formErrors: ['Note is required'], fieldErrors: {} },
    })
    render(<AddNoteDialog accountId="acc_001" transactionId="tx_001" existingNote={null} />)
    await userEvent.click(screen.getByRole('button', { name: /add note/i }))
    await userEvent.click(screen.getByRole('button', { name: /save note/i }))
    await waitFor(() =>
      expect(screen.getByText(/note is required/i)).toBeInTheDocument()
    )
  })

  it('closes dialog after successful submission', async () => {
    const { addNote } = await import('@/actions/add-note')
    vi.mocked(addNote).mockResolvedValueOnce({ success: true })
    render(<AddNoteDialog accountId="acc_001" transactionId="tx_001" existingNote={null} />)
    await userEvent.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /save note/i }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})
