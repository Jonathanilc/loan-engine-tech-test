import { test, expect } from '@playwright/test'

test.describe('Flag transaction mutation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accounts/acc_001')
    await page.waitForSelector('table')
  })

  test('flag buttons are rendered for each row', async ({ page }) => {
    const flagButtons = page.getByRole('button', { name: /flag transaction/i })
    await expect(flagButtons.first()).toBeVisible()
  })

  test('clicking flag immediately shows flagged state (optimistic UI)', async ({ page }) => {
    const flagButton = page.getByRole('button', { name: /flag transaction/i }).first()
    await flagButton.click()

    // Optimistic: button label flips to Unflag before server responds
    await expect(
      page.getByRole('button', { name: /unflag transaction/i }).first()
    ).toBeVisible({ timeout: 3000 })
  })

  test('flagged row gets a background tint', async ({ page }) => {
    const flagButton = page.getByRole('button', { name: /flag transaction/i }).first()
    await flagButton.click()

    // Wait for optimistic state then check row class
    await expect(
      page.getByRole('button', { name: /unflag transaction/i }).first()
    ).toBeVisible({ timeout: 3000 })

    const flaggedRows = page.locator('tr[class*="destructive"]')
    await expect(flaggedRows.first()).toBeVisible()
  })

  test('flag persists after hard reload (server state)', async ({ page }) => {
    // Flag the first unflagged row
    const flagButton = page.getByRole('button', { name: /flag transaction/i }).first()
    await flagButton.click()
    await expect(
      page.getByRole('button', { name: /unflag transaction/i }).first()
    ).toBeVisible({ timeout: 5000 })

    // Hard reload — server re-renders
    await page.reload()
    await page.waitForSelector('table')

    // Should still show at least one unflag button (the one we flagged)
    await expect(
      page.getByRole('button', { name: /unflag transaction/i }).first()
    ).toBeVisible({ timeout: 5000 })
  })

  test('clicking again unflags a flagged transaction', async ({ page }) => {
    // Flag it
    await page.getByRole('button', { name: /flag transaction/i }).first().click()
    const unflagButton = page.getByRole('button', { name: /unflag transaction/i }).first()
    await expect(unflagButton).toBeVisible({ timeout: 5000 })

    // Unflag it
    await unflagButton.click()
    await expect(
      page.getByRole('button', { name: /flag transaction/i }).first()
    ).toBeVisible({ timeout: 5000 })
  })
})
