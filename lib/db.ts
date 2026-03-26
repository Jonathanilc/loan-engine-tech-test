import type { LoanAccount, Transaction, TransactionFilter } from '@/lib/types'

const seed: LoanAccount = {
  id: 'acc_001',
  borrowerName: 'Jonathan Adeyemi',
  principal: 50000,
  outstandingBalance: 34218.5,
  interestRate: 6.75,
  nextPaymentDate: '2026-04-15',
  nextPaymentAmount: 987.23,
  transactions: [
    { id: 'tx_001', type: 'incoming', amount: 5000,   description: 'Loan disbursement',            date: '2026-01-05', status: 'completed', note: null,              flagged: false },
    { id: 'tx_002', type: 'outgoing', amount: 987.23,  description: 'Monthly repayment',            date: '2026-01-15', status: 'completed', note: null,              flagged: false },
    { id: 'tx_003', type: 'incoming', amount: 1200,    description: 'Top-up payment received',      date: '2026-01-22', status: 'completed', note: 'Early top-up',    flagged: false },
    { id: 'tx_004', type: 'outgoing', amount: 987.23,  description: 'Monthly repayment',            date: '2026-02-15', status: 'completed', note: null,              flagged: false },
    { id: 'tx_005', type: 'outgoing', amount: 250,     description: 'Late payment fee',             date: '2026-02-20', status: 'completed', note: null,              flagged: true  },
    { id: 'tx_006', type: 'incoming', amount: 2500,    description: 'Partial overpayment',          date: '2026-02-25', status: 'completed', note: null,              flagged: false },
    { id: 'tx_007', type: 'outgoing', amount: 987.23,  description: 'Monthly repayment',            date: '2026-03-15', status: 'completed', note: null,              flagged: false },
    { id: 'tx_008', type: 'incoming', amount: 500,     description: 'Interest credit',              date: '2026-03-18', status: 'completed', note: 'Rate adjustment',  flagged: false },
    { id: 'tx_009', type: 'outgoing', amount: 150,     description: 'Account maintenance fee',      date: '2026-03-20', status: 'completed', note: null,              flagged: false },
    { id: 'tx_010', type: 'outgoing', amount: 987.23,  description: 'Monthly repayment',            date: '2026-04-15', status: 'pending',   note: null,              flagged: false },
    { id: 'tx_011', type: 'incoming', amount: 3000,    description: 'Lump sum payment',             date: '2026-03-01', status: 'completed', note: null,              flagged: false },
    { id: 'tx_012', type: 'outgoing', amount: 75,      description: 'Document processing fee',      date: '2026-03-05', status: 'completed', note: null,              flagged: false },
    { id: 'tx_013', type: 'incoming', amount: 987.23,  description: 'Direct debit received',        date: '2026-02-10', status: 'completed', note: null,              flagged: false },
    { id: 'tx_014', type: 'outgoing', amount: 1500,    description: 'Principal reduction',          date: '2026-02-28', status: 'failed',    note: 'Retry scheduled', flagged: true  },
    { id: 'tx_015', type: 'incoming', amount: 987.23,  description: 'Direct debit received',        date: '2026-01-10', status: 'completed', note: null,              flagged: false },
    { id: 'tx_016', type: 'outgoing', amount: 50,      description: 'SMS notification fee',         date: '2026-01-20', status: 'completed', note: null,              flagged: false },
    { id: 'tx_017', type: 'incoming', amount: 2000,    description: 'Overpayment received',         date: '2026-03-10', status: 'completed', note: null,              flagged: false },
    { id: 'tx_018', type: 'outgoing', amount: 987.23,  description: 'Monthly repayment',            date: '2025-12-15', status: 'completed', note: null,              flagged: false },
    { id: 'tx_019', type: 'incoming', amount: 10000,   description: 'Initial loan advance',         date: '2025-12-01', status: 'completed', note: null,              flagged: false },
    { id: 'tx_020', type: 'outgoing', amount: 987.23,  description: 'Monthly repayment',            date: '2025-11-15', status: 'completed', note: null,              flagged: false },
    { id: 'tx_021', type: 'incoming', amount: 987.23,  description: 'Direct debit received',        date: '2025-11-10', status: 'completed', note: null,              flagged: false },
    { id: 'tx_022', type: 'outgoing', amount: 200,     description: 'Insurance premium',            date: '2025-11-01', status: 'completed', note: null,              flagged: false },
    { id: 'tx_023', type: 'incoming', amount: 1500,    description: 'Goodwill credit applied',      date: '2025-10-20', status: 'completed', note: 'Dispute resolved', flagged: false },
    { id: 'tx_024', type: 'outgoing', amount: 987.23,  description: 'Monthly repayment',            date: '2025-10-15', status: 'completed', note: null,              flagged: false },
    { id: 'tx_025', type: 'outgoing', amount: 100,     description: 'Early settlement inquiry fee', date: '2025-10-10', status: 'completed', note: null,              flagged: false },
  ],
}

// Deep-clone seed so resetDb() can restore original state for tests
function cloneSeed(): LoanAccount {
  return JSON.parse(JSON.stringify(seed))
}

let db: { accounts: LoanAccount[] } = { accounts: [cloneSeed()] }

/** Reset to seed data — used in tests only */
export function resetDb(): void {
  db = { accounts: [cloneSeed()] }
}

export function getAccount(id: string): LoanAccount | undefined {
  return db.accounts.find((a) => a.id === id)
}

export function getTransactions(
  accountId: string,
  filter: TransactionFilter
): Transaction[] {
  const account = getAccount(accountId)
  if (!account) return []
  if (filter === 'incoming' || filter === 'outgoing') {
    return account.transactions.filter((t) => t.type === filter)
  }
  return account.transactions
}

export function addNoteToTransaction(
  accountId: string,
  transactionId: string,
  note: string
): void {
  const account = getAccount(accountId)
  if (!account) return
  const tx = account.transactions.find((t) => t.id === transactionId)
  if (tx) tx.note = note
}

export function toggleTransactionFlag(
  accountId: string,
  transactionId: string
): void {
  const account = getAccount(accountId)
  if (!account) return
  const tx = account.transactions.find((t) => t.id === transactionId)
  if (tx) tx.flagged = !tx.flagged
}
