'use client'

import { useOptimistic, useTransition } from 'react'
import { Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { flagTransaction } from '@/actions/flag-transaction'

export function FlagButton({
  accountId,
  transactionId,
  initialFlagged,
}: {
  accountId: string
  transactionId: string
  initialFlagged: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [optimisticFlagged, setOptimisticFlagged] = useOptimistic(initialFlagged)

  function handleClick() {
    startTransition(async () => {
      setOptimisticFlagged(!optimisticFlagged)
      await flagTransaction(accountId, transactionId)
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={optimisticFlagged ? 'Unflag transaction' : 'Flag transaction'}
      disabled={isPending}
      onClick={handleClick}
    >
      <Flag
        className={cn(
          'h-4 w-4 transition-colors',
          optimisticFlagged && 'fill-destructive text-destructive'
        )}
      />
    </Button>
  )
}
