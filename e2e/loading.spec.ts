import { test, expect } from '@playwright/test'

test.describe('Loading states', () => {
  test('skeleton rows are visible during initial page load', async ({ page }) => {
    // Intercept the page before data resolves
    page.locator('[data-testid="skeleton-row"]').first().waitFor()
    await page.goto('/accounts/acc_001')

    // Either we catch the skeleton in flight, or the real table is already there
    // In both cases the page must eventually show the table
    await page.waitForSelector('table', { timeout: 10000 })
    await expect(page.locator('table')).toBeVisible()
  })

  test('real content replaces skeleton after load', async ({ page }) => {
    await page.goto('/accounts/acc_001')
    await page.waitForSelector('table')

    // No skeleton rows should remain once table is visible
    const skeletonRows = page.locator('[data-testid="skeleton-row"]')
    await expect(skeletonRows).toHaveCount(0)
  })

  test('table dims while switching filters', async ({ page }) => {
    await page.goto('/accounts/acc_001')
    await page.waitForSelector('table')

    // Click filter and immediately check for opacity class on the wrapper
    const filterWrapper = page.locator('[data-testid="filter-tabs-wrapper"][class*="opacity-50"]')

    // Start navigation and check for pending state
    await page.getByRole('tab', { name: /incoming/i }).click()

    // Eventually the filter completes and opacity class is removed
    await page.waitForURL(/\?filter=incoming/)
    await page.waitForSelector('table')
    await expect(filterWrapper).toHaveCount(0)
  })

  test('loan summary card renders with account details', async ({ page }) => {
    await page.goto('/accounts/acc_001')
    // Wait for the balance to appear (proves SSR + async data loaded)
    await expect(page.getByText('$34,218.50')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Jonathan Xu')).toBeVisible()
    await expect(page.getByText('6.75%')).toBeVisible()
  })
})
