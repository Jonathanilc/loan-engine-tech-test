import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAccount,
  getTransactions,
  addNoteToTransaction,
  toggleTransactionFlag,
  resetDb,
} from '@/lib/db'

describe('db', () => {
  beforeEach(() => {
    resetDb()
  })

  // getAccount
  describe('getAccount', () => {
    it('returns the account for a valid id', () => {
      const account = getAccount('acc_001')
      expect(account).toBeDefined()
      expect(account?.id).toBe('acc_001')
    })

    it('returns undefined for an unknown id', () => {
      const account = getAccount('unknown')
      expect(account).toBeUndefined()
    })
  })

  // getTransactions
  describe('getTransactions', () => {
    it('returns all transactions when no filter is provided', () => {
      const txs = getTransactions('acc_001', undefined)
      expect(txs.length).toBe(25)
    })

    it('returns only incoming transactions when filter=incoming', () => {
      const txs = getTransactions('acc_001', 'incoming')
      expect(txs.length).toBeGreaterThan(0)
      expect(txs.every((t) => t.type === 'incoming')).toBe(true)
    })

    it('returns only outgoing transactions when filter=outgoing', () => {
      const txs = getTransactions('acc_001', 'outgoing')
      expect(txs.length).toBeGreaterThan(0)
      expect(txs.every((t) => t.type === 'outgoing')).toBe(true)
    })

    it('returns all transactions for an unrecognised filter value', () => {
      // @ts-expect-error intentionally bad filter
      const txs = getTransactions('acc_001', 'unknown')
      expect(txs.length).toBe(25)
    })

    it('returns empty array for an unknown account id', () => {
      const txs = getTransactions('unknown', undefined)
      expect(txs).toEqual([])
    })
  })

  // addNoteToTransaction
  describe('addNoteToTransaction', () => {
    it('sets the note on the correct transaction', () => {
      addNoteToTransaction('acc_001', 'tx_001', 'test note')
      const txs = getTransactions('acc_001', undefined)
      const tx = txs.find((t) => t.id === 'tx_001')
      expect(tx?.note).toBe('test note')
    })

    it('does not modify other transactions', () => {
      addNoteToTransaction('acc_001', 'tx_001', 'test note')
      const txs = getTransactions('acc_001', undefined)
      const others = txs.filter((t) => t.id !== 'tx_001')
      others.forEach((t) => expect(t.note).not.toBe('test note'))
    })

    it('does not throw for an unknown transaction id', () => {
      expect(() =>
        addNoteToTransaction('acc_001', 'unknown_tx', 'note')
      ).not.toThrow()
    })

    it('does not throw for an unknown account id', () => {
      expect(() =>
        addNoteToTransaction('unknown_acc', 'tx_001', 'note')
      ).not.toThrow()
    })
  })

  // toggleTransactionFlag
  describe('toggleTransactionFlag', () => {
    it('flips flagged from false to true', () => {
      const txs = getTransactions('acc_001', undefined)
      const unflagged = txs.find((t) => !t.flagged)!
      toggleTransactionFlag('acc_001', unflagged.id)
      const updated = getTransactions('acc_001', undefined).find(
        (t) => t.id === unflagged.id
      )
      expect(updated?.flagged).toBe(true)
    })

    it('flips flagged from true to false', () => {
      const txs = getTransactions('acc_001', undefined)
      const flagged = txs.find((t) => t.flagged)!
      toggleTransactionFlag('acc_001', flagged.id)
      const updated = getTransactions('acc_001', undefined).find(
        (t) => t.id === flagged.id
      )
      expect(updated?.flagged).toBe(false)
    })

    it('does not throw for an unknown transaction id', () => {
      expect(() =>
        toggleTransactionFlag('acc_001', 'unknown_tx')
      ).not.toThrow()
    })

    it('does not throw for an unknown account id', () => {
      expect(() =>
        toggleTransactionFlag('unknown_acc', 'tx_001')
      ).not.toThrow()
    })
  })
})
