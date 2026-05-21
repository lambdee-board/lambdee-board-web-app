import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('Navbar', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
  })

  test('displays the navbar with the logo', async({ page }) => {
    await expect(page.locator('header h6').first()).toHaveText('Lambdee')
  })

  test('can interact with dropdown buttons', async({ page }) => {
    await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
    await page.getByText('Workspaces').click()
    await expect(page.locator('div.MuiModal-root')).toBeVisible()
    await page.locator('div.MuiBackdrop-root').first().click()

    await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
    await page.locator('button.IconButton-user-avatar').click()
    await expect(page.locator('div.MuiModal-root')).toBeVisible()
    await page.locator('div.MuiBackdrop-root').first().click()
  })

  test('does not show Recent', async({ page }) => {
    await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
    await expect(page.getByText('Recent')).not.toBeVisible()
  })

  test('show Recent after adding a recent', async({ page }) => {
    await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
    await page.getByText('Netflux').click()
    await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
    await page.locator('div.ListItem-board').first().click()
    await page.reload()
    await page.getByText('Lambdee').click()
    await page.reload()
    await expect(page.getByText('Recent')).toBeVisible()
    await expect(page.getByText('Recents')).toBeVisible()
  })

  test('navigate to Recent', async({ page }) => {
    await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
    await page.getByText('Netflux').click()
    await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
    await page.locator('div.ListItem-board').first().click()
    await page.reload()
    await page.getByText('Lambdee').click()
    await page.reload()
    await expect(page.getByText('Recents')).toBeVisible()
    await page.getByText('Recent').click()
    await page.locator('.MuiMenuItem-root').first().click()
  })
})
