'use client'

import { useActionState, useEffect, useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { addNote } from '@/actions/add-note'

export function AddNoteDialog({
  accountId,
  transactionId,
  existingNote,
}: {
  accountId: string
  transactionId: string
  existingNote: string | null
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(addNote, null)

  useEffect(() => {
    if (state?.success) setOpen(false)
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Add note">
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="accountId" value={accountId} />
          <input type="hidden" name="transactionId" value={transactionId} />
          <Textarea
            name="note"
            defaultValue={existingNote ?? ''}
            placeholder="Add a note to this transaction…"
            rows={4}
          />
          {state && !state.success && state.error.formErrors.length > 0 && (
            <p className="text-sm text-destructive">{state.error.formErrors[0]}</p>
          )}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Saving…' : 'Save Note'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
