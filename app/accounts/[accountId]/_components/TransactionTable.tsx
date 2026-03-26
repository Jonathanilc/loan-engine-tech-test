import { getTransactions } from '@/lib/db'
import { delay } from '@/lib/delay'
import type { TransactionFilter } from '@/lib/types'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TransactionRow } from './TransactionRow'

export async function TransactionTable({
  accountId,
  filter,
}: {
  accountId: string
  filter: TransactionFilter
}) {
  await delay()
  const transactions = getTransactions(accountId, filter)

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-background py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No {filter ? `${filter} ` : ''}transactions found.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
              Date
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
              Type
            </TableHead>
            <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
              Status
            </TableHead>
            <TableHead className="w-8" />
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} accountId={accountId} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
