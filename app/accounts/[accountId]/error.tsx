'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p className="text-sm text-muted-foreground">Something went wrong loading this account.</p>
      <button
        onClick={reset}
        className="text-sm font-medium text-primary underline underline-offset-4"
      >
        Try again
      </button>
    </main>
  )
}
