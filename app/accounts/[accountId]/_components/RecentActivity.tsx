import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ActivityItem {
  id: string
  date: string
  description: string
  amount: string
  balance: string
  reference: string
}

const STUB_ITEMS: ActivityItem[] = [
  {
    id: 'act_001',
    date: 'Apr 15, 2026',
    description: 'Monthly repayment received',
    amount: '+$987.23',
    balance: '$34,218.50',
    reference: 'REF-2026-0415',
  },
  {
    id: 'act_002',
    date: 'Apr 1, 2026',
    description: 'Interest charge applied',
    amount: '-$192.48',
    balance: '$35,205.73',
    reference: 'REF-2026-0401',
  },
  {
    id: 'act_003',
    date: 'Mar 15, 2026',
    description: 'Monthly repayment received',
    amount: '+$987.23',
    balance: '$35,398.21',
    reference: 'REF-2026-0315',
  },
]

export async function RecentActivity({ accountId: _accountId }: { accountId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-3">
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Date
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Amount
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Balance
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Reference
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STUB_ITEMS.map((item) => (
              <TableRow key={item.id} className="transition-colors hover:bg-muted/40">
                <TableCell className="px-5 text-xs text-muted-foreground tabular-nums">
                  {item.date}
                </TableCell>
                <TableCell className="text-sm">{item.description}</TableCell>
                <TableCell
                  className={`font-mono text-sm font-medium tabular-nums ${
                    item.amount.startsWith('+')
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-foreground'
                  }`}
                >
                  {item.amount}
                </TableCell>
                <TableCell className="font-mono text-sm tabular-nums text-muted-foreground">
                  {item.balance}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
