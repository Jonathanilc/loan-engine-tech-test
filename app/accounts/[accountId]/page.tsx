import { Suspense } from 'react'
import type { TransactionFilter } from '@/lib/types'
import { LoanSummaryCard } from './_components/LoanSummaryCard'
import { LoanSummaryCardSkeleton } from './_components/LoanSummaryCardSkeleton'
import { TransactionTable } from './_components/TransactionTable'
import { TransactionTableSkeleton } from './_components/TransactionTableSkeleton'
import { FilterTabs } from './_components/FilterTabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>
  searchParams: Promise<{ filter?: string }>
}) {
  const { accountId } = await params
  const { filter } = await searchParams
  const validFilter: TransactionFilter =
    filter === 'incoming' || filter === 'outgoing' ? filter : undefined

  return (
    <>
      {/* Breadcrumb header */}
      <header className="flex h-12 shrink-0 items-center border-b bg-background px-6 gap-1.5 text-sm">
        <span className="text-muted-foreground">Accounts</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-muted-foreground">{accountId}</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground font-medium">Overview</span>
      </header>

      <main className="flex flex-col gap-5 p-6">
        {/* Loan overview card */}
        <Suspense fallback={<LoanSummaryCardSkeleton />}>
          <LoanSummaryCard accountId={accountId} />
        </Suspense>

        {/* Placeholder sections */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">No recent activity to display.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Payment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">No payment settings configured.</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction history */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Transaction History</h2>
          </div>
          <FilterTabs currentFilter={validFilter} accountId={accountId} />
          <Suspense fallback={<TransactionTableSkeleton />}>
            <TransactionTable accountId={accountId} filter={validFilter} />
          </Suspense>
        </div>
      </main>
    </>
  )
}
