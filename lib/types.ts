export type TransactionType = 'incoming' | 'outgoing'
export type TransactionStatus = 'completed' | 'pending' | 'failed'
export type TransactionFilter = 'incoming' | 'outgoing' | undefined

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  date: string
  status: TransactionStatus
  note: string | null
  flagged: boolean
}

export interface LoanAccount {
  id: string
  borrowerName: string
  principal: number
  outstandingBalance: number
  interestRate: number
  nextPaymentDate: string
  nextPaymentAmount: number
  transactions: Transaction[]
}
