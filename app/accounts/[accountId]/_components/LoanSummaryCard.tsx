import { getAccount } from '@/lib/db'
import { delay } from '@/lib/delay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

export async function LoanSummaryCard({ accountId }: { accountId: string }) {
  await delay()
  const account = getAccount(accountId)
  if (!account) return null

  const repaid = ((account.principal - account.outstandingBalance) / account.principal) * 100
  const repaidPct = Math.max(0, Math.min(100, repaid))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {account.borrowerName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">Outstanding Balance</p>
          <p className="text-3xl font-bold tracking-tight">{fmt(account.outstandingBalance)}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Principal</p>
            <p className="text-sm font-semibold">{fmt(account.principal)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Interest Rate</p>
            <p className="text-sm font-semibold">{account.interestRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Next Payment</p>
            <p className="text-sm font-semibold">{fmt(account.nextPaymentAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="text-sm font-semibold">{fmtDate(account.nextPaymentDate)}</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Repayment progress</span>
            <span>{repaidPct.toFixed(1)}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={repaidPct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 w-full overflow-hidden rounded-full bg-secondary"
          >
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${repaidPct}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
