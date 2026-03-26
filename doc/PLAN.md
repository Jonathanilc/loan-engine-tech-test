# Implementation Plan — Loan Account UI

## Overview

Build a Loan Account dashboard view using Next.js 15 App Router, shadcn/ui, and Tailwind CSS v4.
Focus is on the Transactions Card and its data flow, demonstrating SSR, URL-driven state,
server mutations, and revalidation.

---

## Folder Structure (Target)

```
loan-engine/
├── app/
│   ├── layout.tsx                          # Root layout: ThemeProvider, TooltipProvider, NavBar
│   ├── globals.css                         # Tailwind base + shadcn CSS variables (light/dark)
│   ├── page.tsx                            # Redirect → /accounts/acc_001
│   └── accounts/
│       └── [accountId]/
│           ├── page.tsx                    # PRIMARY Server Component — reads searchParams, fetches data
│           ├── loading.tsx                 # Auto skeleton fallback on initial load
│           ├── error.tsx                   # Error boundary
│           └── _components/
│               ├── LoanSummaryCard.tsx     # RSC — balances, interest rate, progress bar
│               ├── LoanSummaryCardSkeleton.tsx
│               ├── TransactionTable.tsx    # RSC — receives pre-filtered transactions
│               ├── TransactionRow.tsx      # RSC — single row, passes refs to client components
│               ├── TransactionTableSkeleton.tsx
│               ├── FilterTabs.tsx          # Client — tab UI that pushes ?filter= to URL
│               ├── AddNoteDialog.tsx       # Client — Dialog + form wired to Server Action
│               └── FlagButton.tsx          # Client — toggle flag with useOptimistic
├── lib/
│   ├── types.ts                            # Shared TypeScript interfaces
│   ├── db.ts                               # In-memory mock data store (module singleton)
│   ├── delay.ts                            # sleep(min, max) utility
│   └── utils.ts                            # cn() helper (shadcn)
├── actions/
│   ├── add-note.ts                         # Server Action: validate → mutate → revalidatePath
│   └── flag-transaction.ts                 # Server Action: toggle flag → revalidatePath
└── components/
    ├── ui/                                 # shadcn auto-managed
    ├── nav-bar.tsx                         # Top navigation bar (placeholder chrome)
    └── theme-toggle.tsx                    # Dark/light mode button
```

---

## Build Phases

### Phase 1 — Foundation
> Core types, mock data layer, theme, and layout shell.

| Step | File | What it does |
|------|------|-------------|
| 1.1 | `lib/types.ts` | Define `Transaction`, `LoanAccount`, `TransactionFilter` interfaces |
| 1.2 | `lib/delay.ts` | `delay(min, max)` utility — used in every fetch and action |
| 1.3 | `lib/db.ts` | In-memory singleton with 1 loan account + 25 seeded transactions. Exports `getAccount`, `getTransactions`, `addNoteToTransaction`, `toggleTransactionFlag` |
| 1.4 | `app/globals.css` | Override shadcn CSS variables — bump `--primary` to hot pink/rose to match screenshot |
| 1.5 | `components/theme-toggle.tsx` | Client Component — `useTheme()` from next-themes |
| 1.6 | `components/nav-bar.tsx` | Static top bar with logo placeholder + ThemeToggle |
| 1.7 | `app/layout.tsx` | Wrap with `ThemeProvider`, `TooltipProvider`, render NavBar |
| 1.8 | `app/page.tsx` | Redirect to `/accounts/acc_001` |

---

### Phase 2 — Server Actions
> Mutation logic before building UI so components can wire up to real actions.

| Step | File | What it does |
|------|------|-------------|
| 2.1 | `actions/add-note.ts` | `"use server"` — Zod validation → `addNoteToTransaction()` → `revalidatePath()` |
| 2.2 | `actions/flag-transaction.ts` | `"use server"` — `toggleTransactionFlag()` → `revalidatePath()` |

Both actions inject `delay(1000, 2000)` to simulate server latency on mutations.

---

### Phase 3 — Account Page (Server Component)
> The main page — reads URL params, fetches data, sets up Suspense boundaries.

| Step | File | What it does |
|------|------|-------------|
| 3.1 | `app/accounts/[accountId]/page.tsx` | Read `searchParams.filter` on server → fetch filtered transactions → render two independent `<Suspense>` blocks (summary card + table) |
| 3.2 | `app/accounts/[accountId]/loading.tsx` | Render `<TransactionTableSkeleton />` — auto-used by Next.js on first load |
| 3.3 | `app/accounts/[accountId]/error.tsx` | Basic error boundary with retry button |

**Key pattern:**
```ts
// searchParams read on the SERVER before any HTML is sent
const { filter } = await searchParams
const transactions = await getTransactions(accountId, filter)
// → filter=incoming reload always renders correct data, no JS needed
```

---

### Phase 4 — Loan Summary Card
> Account-level metrics rendered independently from the transaction table.

| Step | File | What it does |
|------|------|-------------|
| 4.1 | `_components/LoanSummaryCard.tsx` | RSC — outstanding balance (hero), principal, interest rate, next payment date/amount, repayment progress bar |
| 4.2 | `_components/LoanSummaryCardSkeleton.tsx` | Matching skeleton for the summary card |

Wrapped in its own `<Suspense>` in `page.tsx` — loads independently, faster than the transaction table.

---

### Phase 5 — Transaction Table
> The primary deliverable. Server-rendered table with client interaction at the row level.

| Step | File | What it does |
|------|------|-------------|
| 5.1 | `_components/TransactionTableSkeleton.tsx` | Pixel-accurate skeleton matching table shape (8 rows) |
| 5.2 | `_components/TransactionTable.tsx` | RSC — renders `<Table>` from pre-filtered data, handles empty state |
| 5.3 | `_components/TransactionRow.tsx` | RSC — single row: date, description+note, amount (colored), type badge, status badge, action buttons |
| 5.4 | `_components/FilterTabs.tsx` | Client — `<Tabs>` that calls `router.push(?filter=...)` wrapped in `useTransition` for pending state |
| 5.5 | `_components/AddNoteDialog.tsx` | Client — `<Dialog>` with `<form>` wired to `addNote` action via `useActionState` |
| 5.6 | `_components/FlagButton.tsx` | Client — flag toggle with `useOptimistic` for instant UI feedback |

---

### Phase 6 — Styling & Polish
> Colors, dark mode, responsiveness, and UX details.

| Step | What |
|------|------|
| 6.1 | **Primary color** — Set `--primary` to hot pink (`oklch(0.6 0.28 350)`) matching screenshot |
| 6.2 | **Amount colors** — Incoming: `text-emerald-600 dark:text-emerald-400` with `+` prefix. Outgoing: neutral with `-` prefix |
| 6.3 | **Flagged rows** — Subtle `bg-destructive/5` tint on the entire row |
| 6.4 | **Notes inline** — Display note text below description in `text-xs text-muted-foreground` |
| 6.5 | **Responsive table** — Hide `Date`, `Type`, `Status` columns on mobile (`hidden md:table-cell`) |
| 6.6 | **Filter pending** — Table dims to `opacity-50 pointer-events-none` while `isPending` from `useTransition` |
| 6.7 | **Dark mode** — All colors via CSS variables, no hardcoded values |

---

## Data Flow Diagram

```
URL: /accounts/acc_001?filter=incoming
          │
          ▼
   page.tsx (Server Component)
   ├── reads searchParams.filter = "incoming"    ← server, before HTML sent
   ├── calls getTransactions(id, "incoming")
   │     └── delay(1000, 2000) ← simulated latency
   │
   ├── <Suspense fallback={<LoanSummaryCardSkeleton />}>
   │     └── <LoanSummaryCard /> ← fetches account metadata independently
   │
   └── <Suspense fallback={<TransactionTableSkeleton />}>
         ├── <FilterTabs currentFilter="incoming" />   ← Client, reads prop (not URL)
         └── <TransactionTable transactions={...} />   ← RSC, pre-filtered data
               └── <TransactionRow /> × N
                     ├── <AddNoteDialog />   ← Client Component
                     └── <FlagButton />      ← Client Component

User clicks "Flag":
  FlagButton → useOptimistic (instant UI) → flagTransaction() Server Action
    → delay(1000, 2000) → toggleTransactionFlag() → revalidatePath()
    → Next.js pushes updated RSC payload → row re-renders with real state
```

---

## Mock Data Spec

**1 Loan Account:**
- Outstanding balance: $34,218.50 of $50,000 principal
- Interest rate: 6.75% p.a.
- Next payment: $987.23 due 2026-04-15

**25 Transactions** (mix of incoming/outgoing):
- Types: `incoming` | `outgoing`
- Statuses: `completed` | `pending` | `failed`
- Some pre-seeded with notes and flags to demo the feature immediately

---

## Key Technical Decisions (Summary)

| Decision | Choice | Why |
|----------|--------|-----|
| Filter state | URL `searchParams` on Server Component | SSR preserves filter on reload, no client state needed |
| Revalidation | `revalidatePath()` in Server Action | Server re-renders after mutation, no array splicing |
| Loading (initial) | `loading.tsx` + `<Suspense>` | Next.js convention, auto-applies skeleton |
| Loading (filter change) | `useTransition` → `isPending` | Dims table without full skeleton flash |
| Optimistic UI | `useOptimistic` on flag toggle only | Boolean is trivially optimistic; notes are not |
| Mock persistence | Module-level singleton | Survives between requests in dev; resets on server restart |
| Dark mode | `next-themes` + CSS variables | Zero flash, Tailwind `dark:` variant works out of the box |

---

## Definition of Done

- [ ] Phase 1 — Foundation complete, app boots with NavBar and ThemeToggle
- [ ] Phase 2 — Server Actions wired and tested in isolation
- [ ] Phase 3 — Account page SSR with correct filter on reload
- [ ] Phase 4 — Loan Summary Card renders with skeleton
- [ ] Phase 5 — Transaction Table: filter, add note, flag all working
- [ ] Phase 6 — Dark mode, responsive, color polish complete
- [ ] `pnpm dev` runs cleanly, no TypeScript errors
- [ ] README updated with run instructions
