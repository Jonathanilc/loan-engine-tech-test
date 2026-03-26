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
      <div className="flex flex-col items-center justify-center rounded-lg border py-16 text-center">
        <p className="text-sm text-muted-foreground">
          No {filter ? `${filter} ` : ''}transactions found.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
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
