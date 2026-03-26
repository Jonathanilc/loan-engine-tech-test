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

interface PricingProfile {
  id: string
  rate: string
  pricingProfile: string
  partners: string
  partnerPricingProfile: string
  workingDays: string
  correctEnd: string
}

const STUB_PROFILES: PricingProfile[] = [
  {
    id: 'pp_001',
    rate: '6.75%',
    pricingProfile: 'Standard Variable',
    partners: 'None',
    partnerPricingProfile: '—',
    workingDays: '30',
    correctEnd: 'Yes',
  },
  {
    id: 'pp_002',
    rate: '5.50%',
    pricingProfile: 'Fixed Rate',
    partners: 'Broker A',
    partnerPricingProfile: 'Broker Standard',
    workingDays: '30',
    correctEnd: 'No',
  },
]

export async function PricingSetup({ accountId: _accountId }: { accountId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-3">
        <CardTitle className="text-sm font-semibold">Pricing Setup</CardTitle>
        <Button size="sm" className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" />
          New
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {['Rate', 'Pricing Profile', 'Partners', 'Partner Pricing Profile', 'Working Days', 'Correct End'].map(
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
            {STUB_PROFILES.map((p) => (
              <TableRow key={p.id} className="transition-colors hover:bg-muted/40">
                <TableCell className="px-5 font-mono text-sm font-medium tabular-nums">
                  {p.rate}
                </TableCell>
                <TableCell className="text-sm">{p.pricingProfile}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.partners}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.partnerPricingProfile}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.workingDays}</TableCell>
                <TableCell className="text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.correctEnd === 'Yes'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {p.correctEnd}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
