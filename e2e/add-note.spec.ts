import { test, expect } from '@playwright/test'

test.describe('Add Note mutation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accounts/acc_001')
    await page.getByRole('button', { name: /add note/i }).first().waitFor()
  })

  test('clicking note button opens the dialog', async ({ page }) => {
    const noteButtons = page.getByRole('button', { name: /add note/i })
    await noteButtons.first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('dialog contains a textarea and save button', async ({ page }) => {
    await page.getByRole('button', { name: /add note/i }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator('textarea')).toBeVisible()
    await expect(page.getByRole('button', { name: /save note/i })).toBeVisible()
  })

  test('typing and submitting a note closes the dialog', async ({ page }) => {
    await page.getByRole('button', { name: /add note/i }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.locator('textarea').fill('E2E test note')
    await page.getByRole('button', { name: /save note/i }).click()

    // Dialog should close after successful mutation
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 })
  })

  test('submitted note appears inline below the transaction description', async ({ page }) => {
    const noteButtons = page.getByRole('button', { name: /add note/i })
    // Use the second button to avoid rows with pre-seeded notes
    await noteButtons.nth(1).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.locator('textarea').fill('My E2E note')
    await page.getByRole('button', { name: /save note/i }).click()

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 })
    // Note should be visible in the table after revalidation
    await expect(page.getByText('My E2E note')).toBeVisible({ timeout: 8000 })
  })

  test('URL does not change after submitting a note', async ({ page }) => {
    const urlBefore = page.url()
    await page.getByRole('button', { name: /add note/i }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.locator('textarea').fill('URL check note')
    await page.getByRole('button', { name: /save note/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 })
    expect(page.url()).toBe(urlBefore)
  })
})
