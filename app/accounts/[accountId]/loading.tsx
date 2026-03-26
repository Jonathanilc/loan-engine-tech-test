import { TransactionTableSkeleton } from './_components/TransactionTableSkeleton'

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <TransactionTableSkeleton />
    </main>
  )
}
