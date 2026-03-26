import { getAccount } from '@/lib/db'
import { delay } from '@/lib/delay'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={accent ? 'text-sm font-semibold text-primary' : 'text-sm font-semibold'}>
        {value}
      </p>
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
    <Card>
      <CardHeader className="border-b pb-3 pt-4 px-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold">{account.borrowerName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{accountId}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            Active
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="Outstanding Balance" value={fmt(account.outstandingBalance)} accent />
          <Field label="Principal" value={fmt(account.principal)} />
          <Field label="Interest Rate" value={`${account.interestRate}%`} />
          <Field label="Next Payment" value={fmt(account.nextPaymentAmount)} />
          <Field label="Due Date" value={fmtDate(account.nextPaymentDate)} />
          <Field label="Repaid" value={`${repaidPct.toFixed(1)}%`} />
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
              className="h-full bg-primary transition-all"
              style={{ width: `${repaidPct}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
