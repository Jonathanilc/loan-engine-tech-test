# Loan Engine — Frontend Technical Test

A Loan Account dashboard built with **Next.js 16 App Router**, **shadcn/ui**, and **Tailwind CSS v4**.

Demonstrates server-driven state, URL-driven SSR filtering, server mutations with automatic revalidation, and progressive enhancement — without a client-side state manager.

---

## Getting started

**Prerequisites:** Node.js 22+, pnpm 10+

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to the loan account view.

---

## Running tests

```bash
# Unit + component tests (Vitest)
pnpm test

# With coverage report (enforces 100%)
pnpm test:cov

# E2E tests (Playwright — starts dev server automatically)
pnpm test:e2e

# E2E with interactive UI
pnpm test:e2e:ui
```

---

## Architecture decisions

### Framework: Next.js 16 App Router

The brief asked for server-driven state, URL-preserved filters, data co-location, and progressive enhancement. These requirements map directly to Next.js App Router primitives:

| Requirement | Primitive |
|---|---|
| Server-driven state | React Server Components — server fetches, client receives |
| URL-driven SSR filter | `searchParams` prop on Server Components |
| Mutation + revalidation | Server Actions + `revalidatePath()` |
| Loading states | `loading.tsx` + `<Suspense>` + `useTransition` |
| Progressive enhancement | Server Actions compile to `<form action>` — work without JS |

> Full reasoning in [`doc/PLAN.md`](./doc/PLAN.md) and the [Technical Decisions Notion page](https://www.notion.so/32fd2f89e5dd81afa467f45021916103).

### Mock data

`lib/db.ts` is a module-level singleton with 25 seeded transactions. Node.js module caching keeps it alive between requests in `next dev`, so mutations (add note, flag) persist for the session.

**It resets on server restart** — this is expected for a mock. In production, swap the four exported functions for real DB calls.

### Simulated latency

`lib/delay.ts` injects a 1–2 second random delay into every server fetch and mutation, matching the brief's requirement to demonstrate loading UX.

---

## Key patterns

### URL-driven filter (SSR)

```
GET /accounts/acc_001?filter=incoming
         ↓
page.tsx (Server Component)
  reads searchParams.filter on the server
  calls getTransactions(id, "incoming")
  renders pre-filtered HTML
         ↓
Browser receives correct content before JS runs
Hard reload at ?filter=incoming always works
```

### Mutation → revalidation (no array splicing)

```
User clicks Flag
  → FlagButton (useOptimistic) flips state instantly
  → flagTransaction() Server Action runs on server
  → toggleTransactionFlag() mutates the mock db
  → revalidatePath('/accounts/acc_001')
  → Next.js sends updated RSC payload to client
  → Row re-renders with server-authoritative state
```

### Two independent Suspense boundaries

```jsx
<Suspense fallback={<LoanSummaryCardSkeleton />}>
  <LoanSummaryCard accountId={accountId} />   // loads fast
</Suspense>

<Suspense fallback={<TransactionTableSkeleton />}>
  <TransactionTable accountId={accountId} filter={filter} />  // loads slower
</Suspense>
```

The summary card and transaction table stream independently — the balance renders as soon as it's ready, without waiting for 25 transactions.

---

## Testing approach

**TDD throughout** — every test file was written before its implementation.

| Layer | Tool | Coverage |
|---|---|---|
| Unit (lib, actions) | Vitest | 100% |
| Component (RSC + Client) | Vitest + React Testing Library | 100% |
| E2E (browser flows) | Playwright | Filter SSR, add note, flag, loading |

Tests are **co-located** with their implementation files — `FilterTabs.tsx` sits next to `FilterTabs.test.tsx`.

---

## UI/UX decisions

- **Outstanding balance as hero** — the number a lender looks at first, given prominence at the top
- **Incoming = emerald green `+`, outgoing = neutral `−`** — financial convention, scannable at a glance
- **Notes inline** — displayed below the description rather than in a separate column, keeps the table clean
- **Flagged rows** — subtle `bg-destructive/5` tint on the full row, visible without being alarming
- **Optimistic flag toggle** — flips instantly on click, confirms with server state after mutation
- **Filter tab dims** — `opacity-50` while the server re-fetches, gives tactile feedback without a full skeleton flash
- **Dark mode** — all colours via CSS variables, zero hardcoded values, no flash on load

