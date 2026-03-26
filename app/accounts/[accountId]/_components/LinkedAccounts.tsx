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

interface LinkedAccount {
  id: string
  title: string
  name: string
  date: string
  reference: string
}

const STUB_LINKED: LinkedAccount[] = [
  {
    id: 'lnk_001',
    title: 'Primary Repayment',
    name: 'Jonathan Xu — CBA ****4821',
    date: 'Jan 5, 2024',
    reference: 'DD-ACC-4821',
  },
  {
    id: 'lnk_002',
    title: 'Offset Account',
    name: 'Jonathan Xu — NAB ****9034',
    date: 'Mar 12, 2024',
    reference: 'OFS-ACC-9034',
  },
]

export async function LinkedAccounts({ accountId: _accountId }: { accountId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-3">
        <CardTitle className="text-sm font-semibold">Linked Accounts</CardTitle>
        <Button size="sm" className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" />
          Add linked
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {['Title', 'Name', 'Date Linked', 'Reference'].map((col) => (
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
            {STUB_LINKED.map((item) => (
              <TableRow key={item.id} className="transition-colors hover:bg-muted/40">
                <TableCell className="px-5 text-sm font-medium">{item.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground tabular-nums">
                  {item.date}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.reference}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
