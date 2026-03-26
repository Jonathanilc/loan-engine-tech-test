import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface ReconciliationEntry {
  id: string
  date: string
  rate: string
  fees: string
  statementBalance: string
  notes: string
  breakBalance: string
  planAmount: string
  amount: string
}

const STUB_ENTRIES: ReconciliationEntry[] = [
  {
    id: 'rec_001',
    date: 'Apr 15, 2026',
    rate: '6.75%',
    fees: '$12.50',
    statementBalance: '$34,218.50',
    notes: 'Standard cycle',
    breakBalance: '$0.00',
    planAmount: '$987.23',
    amount: '$987.23',
  },
  {
    id: 'rec_002',
    date: 'Mar 15, 2026',
    rate: '6.75%',
    fees: '$12.50',
    statementBalance: '$35,205.73',
    notes: 'Standard cycle',
    breakBalance: '$0.00',
    planAmount: '$987.23',
    amount: '$987.23',
  },
]

export async function Reconciliation({ accountId: _accountId }: { accountId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-3">
        <CardTitle className="text-sm font-semibold">Reconciliation</CardTitle>
        <Button size="sm" className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" />
          New
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {[
                  'Date',
                  'Rate',
                  'Fees',
                  'Statement Bal.',
                  'Notes',
                  'Break Balance',
                  'Plan Amt.',
                  'Amount',
                ].map((col) => (
                  <TableHead
                    key={col}
                    className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {STUB_ENTRIES.map((entry) => (
                <TableRow key={entry.id} className="transition-colors hover:bg-muted/40">
                  <TableCell className="px-5 text-xs text-muted-foreground tabular-nums">
                    {entry.date}
                  </TableCell>
                  <TableCell className="font-mono text-sm tabular-nums">{entry.rate}</TableCell>
                  <TableCell className="font-mono text-sm tabular-nums">{entry.fees}</TableCell>
                  <TableCell className="font-mono text-sm font-medium tabular-nums">
                    {entry.statementBalance}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.notes}</TableCell>
                  <TableCell className="font-mono text-sm tabular-nums">{entry.breakBalance}</TableCell>
                  <TableCell className="font-mono text-sm tabular-nums">{entry.planAmount}</TableCell>
                  <TableCell className="font-mono text-sm font-semibold tabular-nums text-primary">
                    {entry.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
