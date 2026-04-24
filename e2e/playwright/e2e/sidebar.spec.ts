import { test, expect } from '@playwright/test'
import { app } from '../support/on-rails.js'
import { login } from '../support/command.js'

test.describe('Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await app('clean')
    await login(page)
    await page.getByText('Workspaces').click()
    await page.getByText('Netflux').click({ force: true })
    await page.mouse.click(0, 0)
  })

  test.describe('Add new Board', () => {
    test('switches between add board button and add board input field', async ({ page }) => {
      await expect(page.locator('.New-board-button')).toBeVisible()
      await page.locator('.New-board-button').click()
      await expect(page.locator('.New-board')).toBeVisible()
      await page.locator('.New-board-cancel').click()
      await expect(page.locator('.New-board-cancel')).not.toBeVisible()
    })

    test('inputs string into add board input field and cancels', async ({ page }) => {
      await page.locator('.New-board-button').click()
      await page.locator('.New-board textarea').first().click()
      await page.locator('.New-board textarea').first().fill('Cypress New Task')
      await page.keyboard.press('Escape')
      await expect(page.locator('.New-board-button')).toBeVisible()
    })

    test('adds a new board', async ({ page }) => {
      await page.locator('.New-board-button').click()
      await page.locator('.New-board textarea').first().click()
      await page.locator('.New-board textarea').first().fill('New Board Board')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)
      await expect(page.locator('.Sidebar').filter({ hasText: 'New Board Board' })).toBeVisible()
    })
  })
})
