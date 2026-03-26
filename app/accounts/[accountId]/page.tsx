import { Suspense } from 'react'
import type { TransactionFilter } from '@/lib/types'
import { LoanSummaryCard } from './_components/LoanSummaryCard'
import { LoanSummaryCardSkeleton } from './_components/LoanSummaryCardSkeleton'
import { RecentActivity } from './_components/RecentActivity'
import { PricingSetup } from './_components/PricingSetup'
import { SecuritySettings } from './_components/SecuritySettings'
import { LinkedAccounts } from './_components/LinkedAccounts'
import { PaymentSettings } from './_components/PaymentSettings'
import { Reconciliation } from './_components/Reconciliation'
import { TransactionTable } from './_components/TransactionTable'
import { TransactionTableSkeleton } from './_components/TransactionTableSkeleton'
import { FilterTabs } from './_components/FilterTabs'

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
      <header className="flex h-12 shrink-0 items-center border-b bg-background px-6 gap-1.5 text-sm shadow-sm">
        <span className="text-muted-foreground">Accounts</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-muted-foreground">{accountId}</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground font-medium">Overview</span>
      </header>

      <main className="flex flex-col gap-5 p-6">
        {/* 1. Loan overview */}
        <Suspense fallback={<LoanSummaryCardSkeleton />}>
          <LoanSummaryCard accountId={accountId} />
        </Suspense>

        {/* 2. Recent Activity */}
        <RecentActivity accountId={accountId} />

        {/* 3. Pricing Setup */}
        <PricingSetup accountId={accountId} />

        {/* 4. Security */}
        <SecuritySettings accountId={accountId} />

        {/* 5. Linked Accounts */}
        <LinkedAccounts accountId={accountId} />

        {/* 6. Payment Settings */}
        <PaymentSettings accountId={accountId} />

        {/* 7. Reconciliation */}
        <Reconciliation accountId={accountId} />

        {/* 8. Transaction History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Transaction History</h2>
            <FilterTabs currentFilter={validFilter} accountId={accountId} />
          </div>
          <Suspense fallback={<TransactionTableSkeleton />}>
            <TransactionTable accountId={accountId} filter={validFilter} />
          </Suspense>
        </div>
      </main>
    </>
  )
}
