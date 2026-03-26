import { ThemeToggle } from '@/components/theme-toggle'

export function NavBar() {
  return (
    <nav className="flex h-14 items-center justify-between border-b bg-sidebar px-6">
      <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
        Loan Engine
      </span>
      <ThemeToggle />
    </nav>
  )
}
