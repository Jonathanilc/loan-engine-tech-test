import type { Transaction } from '@/lib/types'
import { TableCell, TableRow as TableRowUI } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { AddNoteDialog } from './AddNoteDialog'
import { FlagButton } from './FlagButton'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

const statusStyles: Record<Transaction['status'], string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  failed:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const typeStyles: Record<Transaction['type'], string> = {
  incoming: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  outgoing: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

export function TransactionRow({
  transaction,
  accountId,
}: {
  transaction: Transaction
  accountId: string
}) {
  return (
    <TableRowUI
      className={cn(
        'transition-colors hover:bg-muted/40',
        transaction.flagged && 'bg-destructive/5 hover:bg-destructive/8'
      )}
    >
      <TableCell className="hidden text-xs text-muted-foreground tabular-nums md:table-cell">
        {fmtDate(transaction.date)}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium leading-snug">{transaction.description}</span>
          {transaction.note && (
            <span
              data-testid="transaction-note"
              className="text-xs italic text-muted-foreground"
            >
              {transaction.note}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span
          data-testid="transaction-amount"
          className={cn(
            'font-mono text-sm font-semibold tabular-nums',
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
        <span
          className={cn(
            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
            typeStyles[transaction.type]
          )}
        >
          {transaction.type}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span
          className={cn(
            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
            statusStyles[transaction.status]
          )}
        >
          {transaction.status}
        </span>
      </TableCell>
      <TableCell className="w-8 pr-1">
        <AddNoteDialog
          accountId={accountId}
          transactionId={transaction.id}
          existingNote={transaction.note}
        />
      </TableCell>
      <TableCell className="w-8 pl-1">
        <FlagButton
          accountId={accountId}
          transactionId={transaction.id}
          initialFlagged={transaction.flagged}
        />
      </TableCell>
    </TableRowUI>
  )
}
