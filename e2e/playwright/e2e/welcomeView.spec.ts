import { test, expect } from '@playwright/test'
import { app } from '../support/on-rails.js'
import { login } from '../support/command.js'

test.describe('WelcomeView', () => {
  test.beforeEach(async ({ page }) => {
    await app('clean')
    await login(page)
  })

  test.describe('Recent', () => {
    test('does not show any recents', async ({ page }) => {
      await expect(page.locator('.RecentBoardButton')).not.toBeVisible()
      await expect(page.getByText('Recents')).not.toBeVisible()
    })

    test('adds a recent', async ({ page }) => {
      await page.getByText('Netflux').click()
      await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
      await page.locator('div.ListItem-board').first().click()
      await page.reload()
      await page.getByText('Lambdee').click()
      await expect(page.getByText('Recent')).toBeVisible()
      await expect(page.getByText('Recents')).toBeVisible()
    })

    test('navigate to recent', async ({ page }) => {
      await page.getByText('Netflux').click()
      await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
      await page.locator('div.ListItem-board').first().click()
      await page.reload()
      await page.getByText('Lambdee').click()
      await expect(page.getByText('Recents')).toBeVisible()
      await page.locator('.recentBoardButton').first().click()
    })

    test('navigate to workspace', async ({ page }) => {
      await expect(page.getByText('Workspace')).toBeVisible()
      await page.locator('.workspaceButton').first().click()
    })
  })
})
