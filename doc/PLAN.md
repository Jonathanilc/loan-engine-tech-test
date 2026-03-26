# Implementation Plan — Loan Account UI

## Overview

Build a Loan Account dashboard view using Next.js 15 App Router, shadcn/ui, and Tailwind CSS v4.
Focus is on the Transactions Card and its data flow, demonstrating SSR, URL-driven state,
server mutations, and revalidation.

**Testing approach: TDD throughout.** Every file has a corresponding test file written first.
The rule is simple — no implementation file ships without a test file. Coverage target is 100%.

---

## Folder Structure (Target)

Tests are co-located with their implementation files (vertical slice). No separate `__tests__/` folder.

```
loan-engine/
├── app/
│   ├── layout.tsx
│   ├── globals.css                         # Tailwind base + shadcn CSS variables (light/dark)
│   ├── page.tsx                            # Redirect → /accounts/acc_001
│   └── accounts/
│       └── [accountId]/
│           ├── page.tsx                    # PRIMARY Server Component — reads searchParams, fetches data
│           ├── loading.tsx                 # Auto skeleton fallback on initial load
│           ├── error.tsx                   # Error boundary
│           └── _components/
│               ├── LoanSummaryCard.tsx
│               ├── LoanSummaryCard.test.tsx     ← co-located
│               ├── LoanSummaryCardSkeleton.tsx
│               ├── LoanSummaryCardSkeleton.test.tsx
│               ├── TransactionTable.tsx
│               ├── TransactionTable.test.tsx
│               ├── TransactionRow.tsx
│               ├── TransactionRow.test.tsx
│               ├── TransactionTableSkeleton.tsx
│               ├── TransactionTableSkeleton.test.tsx
│               ├── FilterTabs.tsx
│               ├── FilterTabs.test.tsx
│               ├── AddNoteDialog.tsx
│               ├── AddNoteDialog.test.tsx
│               ├── FlagButton.tsx
│               └── FlagButton.test.tsx
├── lib/
│   ├── types.ts                            # Types only — no test needed
│   ├── db.ts
│   ├── db.test.ts                          ← co-located
│   ├── delay.ts
│   ├── delay.test.ts
│   └── utils.ts                            # shadcn boilerplate — no test needed
├── actions/
│   ├── add-note.ts
│   ├── add-note.test.ts                    ← co-located
│   ├── flag-transaction.ts
│   └── flag-transaction.test.ts
├── components/
│   ├── ui/                                 # shadcn auto-managed — no tests
│   ├── nav-bar.tsx
│   ├── nav-bar.test.tsx                    ← co-located
│   ├── theme-toggle.tsx
│   └── theme-toggle.test.tsx
├── e2e/                                    # Playwright E2E tests (browser-level, can't co-locate)
│   ├── filter.spec.ts
│   ├── add-note.spec.ts
│   ├── flag.spec.ts
│   └── loading.spec.ts
└── vitest.config.ts
```

---

## Testing Stack

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit + component test runner — ESM-native, no complex transform config |
| **React Testing Library** | Render and assert on React components (RSC and Client) |
| **@testing-library/user-event** | Realistic user interactions (click, type, submit) |
| **@vitejs/plugin-react** | JSX transform for Vitest |
| **Playwright** | E2E — full browser flows against the running dev server |
| **@vitest/coverage-v8** | Code coverage — enforces 100% threshold |

> **Why Vitest over Jest:** ESM-native, works with Tailwind v4 and Next.js 16 without transform hacks. Faster, simpler config.

### Coverage Config (`vitest.config.ts`)

```ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'lcov'],
  thresholds: {
    lines: 100,
    functions: 100,
    branches: 100,
    statements: 100,
  },
  exclude: [
    'components/ui/**',   // shadcn — third-party, not our code
    'lib/utils.ts',       // cn() helper — shadcn boilerplate
    'lib/types.ts',       // types only, nothing to cover
    'e2e/**',
    '**/*.config.*',
  ],
}
```

### Test Scripts

```json
"scripts": {
  "test":        "vitest run",
  "test:watch":  "vitest",
  "test:cov":    "vitest run --coverage",
  "test:e2e":    "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

---

## TDD Approach

For every phase, the order is:

```
1. Write the test file (red — tests fail, nothing implemented yet)
2. Write the minimum implementation to make tests pass (green)
3. Refactor if needed, keeping tests green
```

Each step in the phases below is split into **Test first** and **Then implement**.
No implementation is written before its test exists.

---

## Build Phases

---

### Phase 1 — Foundation
> Core types, mock data layer, theme, and layout shell.

#### 1.1 `lib/delay.ts`

**Test first — `__tests__/lib/delay.test.ts`:**
- Returns a Promise
- Resolves in at least `min` ms
- Resolves in at most `max` ms
- `min` defaults to 1000, `max` defaults to 2000

**Then implement:** `export function delay(min = 1000, max = 2000): Promise<void>`

---

#### 1.2 `lib/db.ts`

**Test first — `__tests__/lib/db.test.ts`:**
- `getAccount` returns the correct account by id
- `getAccount` returns `undefined` for unknown id
- `getTransactions` with no filter returns all 25 transactions
- `getTransactions` with `filter=incoming` returns only incoming transactions
- `getTransactions` with `filter=outgoing` returns only outgoing transactions
- `getTransactions` with unknown filter returns all transactions
- `addNoteToTransaction` sets the note on the correct transaction
- `addNoteToTransaction` does not modify other transactions
- `addNoteToTransaction` with unknown transaction id does not throw
- `toggleTransactionFlag` flips `flagged` false → true
- `toggleTransactionFlag` flips `flagged` true → false
- `toggleTransactionFlag` with unknown id does not throw

**Then implement:** Module-level singleton with seeded data and the four exported functions.

---

#### 1.3 `lib/types.ts`

Pure TypeScript interfaces — no test needed.

```ts
type TransactionType   = 'incoming' | 'outgoing'
type TransactionStatus = 'completed' | 'pending' | 'failed'
type TransactionFilter = 'incoming' | 'outgoing' | undefined

interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  date: string
  status: TransactionStatus
  note: string | null
  flagged: boolean
}

interface LoanAccount {
  id: string
  borrowerName: string
  principal: number
  outstandingBalance: number
  interestRate: number
  nextPaymentDate: string
  nextPaymentAmount: number
  transactions: Transaction[]
}
```

---

#### 1.4 `app/globals.css`

Override primary color to hot pink matching the screenshot:
```css
--primary: oklch(0.6 0.28 350);       /* hot pink */
--primary-foreground: oklch(1 0 0);   /* white */
```

No test — CSS variables, covered by visual E2E.

---

#### 1.5 `components/theme-toggle.tsx`

**Test first — `__tests__/components/ThemeToggle.test.tsx`:**
- Renders a button
- Button has accessible label (aria-label)
- Clicking the button calls `setTheme` with the opposite theme

**Then implement:** Client Component using `useTheme()` from `next-themes`.

---

#### 1.6 `components/nav-bar.tsx`

**Test first — `__tests__/components/NavBar.test.tsx`:**
- Renders the logo/brand name
- Renders the ThemeToggle button
- Has a `<nav>` landmark element

**Then implement:** Static top bar with logo + ThemeToggle.

---

#### 1.7 `app/layout.tsx` + `app/page.tsx`

Layout wraps with `ThemeProvider`, `TooltipProvider`, `NavBar`.
`page.tsx` redirects to `/accounts/acc_001`.

No unit tests — tested via E2E. Next.js layout files are integration concerns.

---

### Phase 2 — Server Actions
> Write tests first, then implement. Actions are plain async functions — easy to unit test.

#### 2.1 `actions/add-note.ts`

**Test first — `__tests__/actions/add-note.test.ts`:**

Mocks: `revalidatePath` (from `next/cache`), `delay` (from `lib/delay`)

- Returns `{ success: false, error }` when `note` field is missing from FormData
- Returns `{ success: false, error }` when `note` is an empty string
- Returns `{ success: false, error }` when `note` exceeds 500 characters
- Returns `{ success: false, error }` when `accountId` is missing
- Returns `{ success: false, error }` when `transactionId` is missing
- Returns `{ success: true }` on valid FormData
- Calls `addNoteToTransaction` with correct args on success
- Calls `revalidatePath('/accounts/acc_001')` after success
- Does NOT call `revalidatePath` on validation failure

**Then implement:**
```ts
'use server'
export async function addNote(prevState: unknown, formData: FormData) {
  await delay()
  // zod parse → mutate → revalidatePath
}
```

---

#### 2.2 `actions/flag-transaction.ts`

**Test first — `__tests__/actions/flag-transaction.test.ts`:**

Mocks: `revalidatePath`, `delay`

- Calls `toggleTransactionFlag` with correct accountId and transactionId
- Calls `revalidatePath` with correct path after toggle
- Works when transaction is initially unflagged
- Works when transaction is initially flagged

**Then implement:** `'use server'` → `delay()` → `toggleTransactionFlag()` → `revalidatePath()`

---

### Phase 3 — Account Page

No unit tests for the page file itself — it is a Next.js Server Component entry point, covered by E2E.

| File | What |
|------|------|
| `app/accounts/[accountId]/page.tsx` | Read `searchParams.filter` → fetch data → two `<Suspense>` blocks |
| `app/accounts/[accountId]/loading.tsx` | Renders `<TransactionTableSkeleton />` |
| `app/accounts/[accountId]/error.tsx` | Error boundary with retry |

---

### Phase 4 — Loan Summary Card

#### 4.1 `_components/LoanSummaryCardSkeleton.tsx`

**Test first — `__tests__/components/LoanSummaryCardSkeleton.test.tsx`:**
- Renders without crashing
- Contains skeleton elements (role or data-testid)
- Does not render any real data values

**Then implement:** Pure skeleton layout matching the summary card shape.

---

#### 4.2 `_components/LoanSummaryCard.tsx`

**Test first — `__tests__/components/LoanSummaryCard.test.tsx`:**

Mock: `getAccount` from `lib/db`

- Renders outstanding balance formatted as currency
- Renders principal amount
- Renders interest rate with `%` suffix
- Renders next payment date
- Renders next payment amount
- Renders a progress bar with correct repayment percentage (`outstandingBalance / principal`)
- Renders borrower name

**Then implement:** RSC that calls `getAccount` and renders card metrics.

---

### Phase 5 — Transaction Table

#### 5.1 `_components/TransactionTableSkeleton.tsx`

**Test first — `__tests__/components/TransactionTableSkeleton.test.tsx`:**
- Renders without crashing
- Renders exactly 8 skeleton rows
- Does not render any real transaction data

**Then implement:** 8-row skeleton mirroring exact table column layout.

---

#### 5.2 `_components/TransactionTable.tsx`

**Test first — `__tests__/components/TransactionTable.test.tsx`:**

- Renders a table element
- Renders a row for each transaction passed in
- Renders an empty state message when `transactions` is an empty array
- Empty state message references the active filter (e.g. "No incoming transactions")

**Then implement:** RSC — `<Table>` with `transactions.map(tx => <TransactionRow />)`.

---

#### 5.3 `_components/TransactionRow.tsx`

**Test first — `__tests__/components/TransactionRow.test.tsx`:**

- Renders transaction description
- Renders formatted date
- Renders amount with `+` prefix for incoming
- Renders amount with `-` prefix for outgoing
- Incoming amount has green text class
- Outgoing amount has neutral text class
- Renders type badge with correct label
- Renders status badge with correct label
- Renders note text below description when `note` is not null
- Does not render note section when `note` is null
- Applies flagged row background class when `flagged` is true
- Does not apply flagged class when `flagged` is false
- Renders `<AddNoteDialog />` in the row
- Renders `<FlagButton />` in the row

**Then implement:** RSC rendering all row cells and mounting client sub-components.

---

#### 5.4 `_components/FilterTabs.tsx`

**Test first — `__tests__/components/FilterTabs.test.tsx`:**

Mock: `next/navigation` → `useRouter`, `usePathname`

- Renders three tabs: "All", "Incoming", "Outgoing"
- The tab matching `currentFilter` prop is active/selected
- When `currentFilter` is undefined, "All" tab is active
- Clicking "Incoming" calls `router.push` with `?filter=incoming`
- Clicking "Outgoing" calls `router.push` with `?filter=outgoing`
- Clicking "All" calls `router.push` with no filter param
- Table container has `opacity-50` class while `isPending` is true

**Then implement:** Client Component with `useTransition` + `router.push`.

---

#### 5.5 `_components/AddNoteDialog.tsx`

**Test first — `__tests__/components/AddNoteDialog.test.tsx`:**

Mock: `actions/add-note` → `addNote`

- Dialog is closed by default
- Clicking the note icon button opens the dialog
- Pre-populates textarea with `existingNote` prop value when provided
- Textarea is empty when no `existingNote` prop
- Submit button is labelled "Save Note" by default
- Submit button shows "Saving..." while `isPending`
- Submit button is disabled while `isPending`
- Renders validation error message when action returns error state
- Closes dialog after successful submission

**Then implement:** Client Component with `useActionState(addNote, null)`.

---

#### 5.6 `_components/FlagButton.tsx`

**Test first — `__tests__/components/FlagButton.test.tsx`:**

Mock: `actions/flag-transaction` → `flagTransaction`

- Renders with accessible label indicating flagged/unflagged state
- Icon has no fill class when `initialFlagged` is false
- Icon has destructive fill class when `initialFlagged` is true
- Clicking immediately applies optimistic toggle (before action resolves)
- Calls `flagTransaction` with correct `accountId` and `transactionId`
- Button is disabled while action is pending

**Then implement:** Client Component with `useOptimistic` + `useTransition`.

---

### Phase 6 — Styling & Polish

| Step | What |
|------|------|
| 6.1 | **Primary color** — `--primary: oklch(0.6 0.28 350)` (hot pink) |
| 6.2 | **Amount colors** — Incoming: `text-emerald-600 dark:text-emerald-400`. Outgoing: neutral |
| 6.3 | **Flagged rows** — `bg-destructive/5` tint |
| 6.4 | **Notes inline** — `text-xs text-muted-foreground` below description |
| 6.5 | **Responsive** — Hide Date/Type/Status on mobile (`hidden md:table-cell`) |
| 6.6 | **Filter pending** — `opacity-50 pointer-events-none` while `isPending` |
| 6.7 | **Dark mode** — All colors via CSS variables only |

Covered visually by E2E tests and manual review during demo.

---

### Phase 7 — E2E Tests (Playwright)

Written after Phase 5, against the running dev server.

#### `e2e/filter.spec.ts`
- Navigating to `/accounts/acc_001` shows all transactions
- Clicking "Incoming" updates URL to `?filter=incoming`
- Only incoming transactions visible after filter applied
- **Hard reload at `?filter=incoming` renders correct filtered data** ← proves SSR
- Clicking "All" removes filter from URL

#### `e2e/add-note.spec.ts`
- Clicking note button opens dialog
- Typing and submitting a note closes the dialog
- Note appears inline below transaction description
- URL does not change after submission (no full page reload)

#### `e2e/flag.spec.ts`
- Clicking flag immediately shows flagged state (optimistic)
- Row gets background tint when flagged
- Hard reload confirms flag persisted (server state)
- Clicking again unflags the transaction

#### `e2e/loading.spec.ts`
- Skeleton visible during initial load (1–2s delay)
- Skeleton replaced by real content after load
- Table dims while filter is changing

---

## Component ↔ Test Coverage Map

Every non-trivial file must have a corresponding test. This table is the source of truth.

| Implementation File | Test File | Type |
|---------------------|-----------|------|
| `lib/delay.ts` | `__tests__/lib/delay.test.ts` | Unit |
| `lib/db.ts` | `__tests__/lib/db.test.ts` | Unit |
| `lib/types.ts` | — | Types only |
| `lib/utils.ts` | — | shadcn boilerplate |
| `actions/add-note.ts` | `__tests__/actions/add-note.test.ts` | Unit |
| `actions/flag-transaction.ts` | `__tests__/actions/flag-transaction.test.ts` | Unit |
| `components/nav-bar.tsx` | `__tests__/components/NavBar.test.tsx` | Component |
| `components/theme-toggle.tsx` | `__tests__/components/ThemeToggle.test.tsx` | Component |
| `_components/LoanSummaryCard.tsx` | `__tests__/components/LoanSummaryCard.test.tsx` | Component |
| `_components/LoanSummaryCardSkeleton.tsx` | `__tests__/components/LoanSummaryCardSkeleton.test.tsx` | Component |
| `_components/TransactionTable.tsx` | `__tests__/components/TransactionTable.test.tsx` | Component |
| `_components/TransactionRow.tsx` | `__tests__/components/TransactionRow.test.tsx` | Component |
| `_components/TransactionTableSkeleton.tsx` | `__tests__/components/TransactionTableSkeleton.test.tsx` | Component |
| `_components/FilterTabs.tsx` | `__tests__/components/FilterTabs.test.tsx` | Component |
| `_components/AddNoteDialog.tsx` | `__tests__/components/AddNoteDialog.test.tsx` | Component |
| `_components/FlagButton.tsx` | `__tests__/components/FlagButton.test.tsx` | Component |
| `app/accounts/[accountId]/page.tsx` | `e2e/filter.spec.ts` + `e2e/loading.spec.ts` | E2E |
| `app/layout.tsx` | `e2e/` (smoke) | E2E |
| `components/ui/**` | — | shadcn — third-party |

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
- Some pre-seeded with notes and flags to demo the feature on load

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
- [ ] Phase 1 — `delay` and `db` unit tests passing at 100% coverage
- [ ] Phase 2 — Server Action unit tests written and passing
- [ ] Phase 3 — Account page SSR with correct filter on reload
- [ ] Phase 4 — Loan Summary Card renders with skeleton, tests passing
- [ ] Phase 5 — All component tests written (TDD) and passing
- [ ] Phase 5 — Transaction Table: filter, add note, flag all working
- [ ] Phase 6 — Dark mode, responsive, color polish complete
- [ ] Phase 7 — All E2E tests passing (`pnpm test:e2e`)
- [ ] `pnpm test:cov` reports 100% across lines, functions, branches, statements
- [ ] `pnpm dev` runs cleanly, no TypeScript errors
- [ ] README updated with run instructions
