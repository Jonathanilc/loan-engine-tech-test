import { Skeleton } from '@/components/ui/skeleton'

export function TransactionTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-64" />
      <div className="rounded-lg border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            data-testid="skeleton-row"
            className="flex items-center gap-4 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
