import type { Transaction } from '@/lib/types'
import { TableCell, TableRow as TableRowUI } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AddNoteDialog } from './AddNoteDialog'
import { FlagButton } from './FlagButton'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

const statusVariant: Record<Transaction['status'], 'default' | 'secondary' | 'destructive'> = {
  completed: 'secondary',
  pending: 'default',
  failed: 'destructive',
}

export function TransactionRow({
  transaction,
  accountId,
}: {
  transaction: Transaction
  accountId: string
}) {
  return (
    <TableRowUI className={cn(transaction.flagged && 'bg-destructive/5')}>
      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
        {fmtDate(transaction.date)}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{transaction.description}</span>
          {transaction.note && (
            <span data-testid="transaction-note" className="text-xs text-muted-foreground">
              {transaction.note}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            'font-mono text-sm font-semibold',
            transaction.type === 'incoming'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-foreground'
          )}
        >
          {transaction.type === 'incoming' ? '+' : '-'}
          {fmt(transaction.amount)}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="outline">{transaction.type}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant={statusVariant[transaction.status]}>{transaction.status}</Badge>
      </TableCell>
      <TableCell>
        <AddNoteDialog
          accountId={accountId}
          transactionId={transaction.id}
          existingNote={transaction.note}
        />
      </TableCell>
      <TableCell>
        <FlagButton
          accountId={accountId}
          transactionId={transaction.id}
          initialFlagged={transaction.flagged}
        />
      </TableCell>
    </TableRowUI>
  )
}
