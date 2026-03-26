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

interface SecurityRecord {
  id: string
  status: 'active' | 'pending' | 'inactive'
  title: string
  per: string
  perTermFinancingProfile: string
  company: string
  contractNumber: string
}

const STUB_RECORDS: SecurityRecord[] = [
  {
    id: 'sec_001',
    status: 'active',
    title: 'Property Mortgage',
    per: '100%',
    perTermFinancingProfile: 'Standard',
    company: 'First National Bank',
    contractNumber: 'CNT-2024-0091',
  },
  {
    id: 'sec_002',
    status: 'active',
    title: 'Personal Guarantee',
    per: '100%',
    perTermFinancingProfile: 'Standard',
    company: '—',
    contractNumber: 'CNT-2024-0092',
  },
  {
    id: 'sec_003',
    status: 'pending',
    title: 'Vehicle Security',
    per: '50%',
    perTermFinancingProfile: 'Reduced',
    company: 'AutoFleet Ltd',
    contractNumber: 'CNT-2024-0093',
  },
]

const statusStyles: Record<SecurityRecord['status'], string> = {
  active:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

export async function SecuritySettings({ accountId: _accountId }: { accountId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-3">
        <CardTitle className="text-sm font-semibold">Security</CardTitle>
        <Button size="sm" className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" />
          Add security
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {['Status', 'Title', 'Per', 'Per Term Financing Profile', 'Company', 'Contract No.'].map(
                (col) => (
                  <TableHead
                    key={col}
                    className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {col}
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {STUB_RECORDS.map((r) => (
              <TableRow key={r.id} className="transition-colors hover:bg-muted/40">
                <TableCell className="px-5">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[r.status]}`}
                  >
                    {r.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-medium">{r.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.per}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {r.perTermFinancingProfile}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.company}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {r.contractNumber}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
