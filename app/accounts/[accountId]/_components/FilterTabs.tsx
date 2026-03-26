'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { TransactionFilter } from '@/lib/types'
import { cn } from '@/lib/utils'

export function FilterTabs({
  currentFilter,
  accountId: _accountId,
}: {
  currentFilter: TransactionFilter
  accountId: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string) {
    startTransition(() => {
      if (value === 'all') {
        router.push(pathname)
      } else {
        router.push(`${pathname}?filter=${value}`)
      }
    })
  }

  return (
    <div className={cn(isPending && 'pointer-events-none opacity-50')}>
      <Tabs value={currentFilter ?? 'all'} onValueChange={handleChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
