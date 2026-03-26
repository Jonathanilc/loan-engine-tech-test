import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { delay } from '@/lib/delay'

describe('delay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a Promise', () => {
    const result = delay()
    expect(result).toBeInstanceOf(Promise)
  })

  it('resolves after at least min ms', async () => {
    let resolved = false
    delay(1000, 2000).then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(999)
    expect(resolved).toBe(false)

    await vi.advanceTimersByTimeAsync(1001)
    expect(resolved).toBe(true)
  })

  it('resolves within max ms', async () => {
    let resolved = false
    delay(1000, 2000).then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(2000)
    expect(resolved).toBe(true)
  })

  it('defaults min to 1000 and max to 2000', async () => {
    let resolved = false
    delay().then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(999)
    expect(resolved).toBe(false)

    await vi.advanceTimersByTimeAsync(1001)
    expect(resolved).toBe(true)
  })
})
