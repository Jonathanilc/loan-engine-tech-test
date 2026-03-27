import { test, expect } from '@playwright/test'

test.describe('URL-driven filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accounts/acc_001')
    await page.waitForSelector('[data-testid="transaction-table"]')
  })

  test('shows all transactions by default', async ({ page }) => {
    const rows = page.locator('[data-testid="transaction-table"] tbody tr')
    await expect(rows).toHaveCount(25)
  })

  test('clicking Incoming updates URL to ?filter=incoming', async ({ page }) => {
    await page.getByRole('tab', { name: /incoming/i }).click()
    await expect(page).toHaveURL(/\?filter=incoming/)
  })

  test('only incoming transactions are visible after filter', async ({ page }) => {
    await page.getByRole('tab', { name: /incoming/i }).click()
    await page.waitForURL(/\?filter=incoming/)
    await page.waitForSelector('[data-testid="transaction-table"]')

    const rows = page.locator('[data-testid="transaction-table"] tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)

    // Every visible amount should have a + prefix (incoming)
    const amounts = page.locator('[data-testid="transaction-table"] tbody td [data-testid="transaction-amount"][class*="emerald"]')
    await expect(amounts).toHaveCount(count)
  })

  test('hard reload at ?filter=incoming preserves filter (SSR)', async ({ page }) => {
    // Go directly to filtered URL — no JS navigation, straight SSR
    await page.goto('/accounts/acc_001?filter=incoming')
    await page.waitForSelector('[data-testid="transaction-table"]')

    // Incoming tab should be active
    const incomingTab = page.getByRole('tab', { name: /incoming/i })
    await expect(incomingTab).toHaveAttribute('data-active')

    // Should only show incoming rows
    const amounts = page.locator('[data-testid="transaction-table"] tbody td [data-testid="transaction-amount"][class*="emerald"]')
    const rows = page.locator('[data-testid="transaction-table"] tbody tr')
    const rowCount = await rows.count()
    await expect(amounts).toHaveCount(rowCount)
  })

  test('clicking All tab removes filter from URL', async ({ page }) => {
    await page.goto('/accounts/acc_001?filter=incoming')
    await page.waitForSelector('[data-testid="transaction-table"]')
    await page.getByRole('tab', { name: /^all$/i }).click()
    await expect(page).not.toHaveURL(/filter=/)
    await page.waitForSelector('[data-testid="transaction-table"]')
    const rows = page.locator('[data-testid="transaction-table"] tbody tr')
    await expect(rows).toHaveCount(25)
  })

  test('outgoing filter shows only outgoing rows', async ({ page }) => {
    await page.getByRole('tab', { name: /outgoing/i }).click()
    await page.waitForURL(/\?filter=outgoing/)
    await page.waitForSelector('table')

    const emeraldAmounts = page.locator('[data-testid="transaction-table"] tbody td [data-testid="transaction-amount"][class*="emerald"]')
    await expect(emeraldAmounts).toHaveCount(0)
  })
})
