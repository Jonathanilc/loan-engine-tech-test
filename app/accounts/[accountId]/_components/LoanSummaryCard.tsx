import { getAccount } from '@/lib/db'
import { delay } from '@/lib/delay'
import { Card, CardContent } from '@/components/ui/card'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono text-sm font-medium tabular-nums">{value}</p>
    </div>
  )
}

export async function LoanSummaryCard({ accountId }: { accountId: string }) {
  await delay()
  const account = getAccount(accountId)
  if (!account) return null

  const repaid = ((account.principal - account.outstandingBalance) / account.principal) * 100
  const repaidPct = Math.max(0, Math.min(100, repaid))

  return (
    <Card className="overflow-hidden">
      {/* Hero strip */}
      <div className="flex items-center justify-between border-b bg-background px-5 py-4">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Outstanding Balance</p>
            <p className="font-heading text-3xl font-extrabold tracking-tighter text-primary tabular-nums">
              {fmt(account.outstandingBalance)}
            </p>
          </div>
          <div className="hidden h-10 w-px bg-border sm:block" />
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground">Borrower</p>
            <p className="text-sm font-semibold">{account.borrowerName}</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          Active
        </span>
      </div>

      {/* Stats grid */}
      <CardContent className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Principal" value={fmt(account.principal)} />
          <Stat label="Interest Rate" value={`${account.interestRate}%`} />
          <Stat label="Next Payment" value={fmt(account.nextPaymentAmount)} />
          <Stat label="Due Date" value={fmtDate(account.nextPaymentDate)} />
          <Stat label="Repaid" value={`${repaidPct.toFixed(1)}%`} />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Repayment progress</span>
            <span>{repaidPct.toFixed(1)}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={repaidPct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
          >
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${repaidPct}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
