import { Suspense } from 'react'
import type { TransactionFilter } from '@/lib/types'
import { LoanSummaryCard } from './_components/LoanSummaryCard'
import { LoanSummaryCardSkeleton } from './_components/LoanSummaryCardSkeleton'
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
    <main className="flex flex-1 flex-col gap-6 p-6">
      <Suspense fallback={<LoanSummaryCardSkeleton />}>
        <LoanSummaryCard accountId={accountId} />
      </Suspense>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Transactions</h2>
        </div>
        <FilterTabs currentFilter={validFilter} accountId={accountId} />
        <Suspense fallback={<TransactionTableSkeleton />}>
          <TransactionTable accountId={accountId} filter={validFilter} />
        </Suspense>
      </div>
    </main>
  )
}
