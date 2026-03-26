import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, CreditCard } from 'lucide-react'

export async function PaymentSettings({ accountId: _accountId }: { accountId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-3">
        <CardTitle className="text-sm font-semibold">Payment Settings</CardTitle>
        <Button size="sm" className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-2 py-10">
        <CreditCard className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No payment settings.</p>
      </CardContent>
    </Card>
  )
}
