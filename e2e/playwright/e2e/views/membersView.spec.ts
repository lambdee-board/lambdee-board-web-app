import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('Members View', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
  })

  test.describe('Accessing view', () => {
    test('opens members view from navbar', async({ page }) => {
      await page.locator('.Button span').filter({ hasText: 'Members' }).click()
      await expect(page.locator('#UserFilter-select-label').filter({ hasText: 'None' })).toBeVisible()
      await expect(page.locator('.UserListItem-dates').first()).toBeVisible()
    })

    test('opens members view from workspace', async({ page }) => {
      await page.getByText('Workspaces').click()
      await page.locator('.Workspace-menu-item').first().click()
      await page.mouse.click(0, 0)
      await page.locator('.List div').filter({ hasText: 'Members' }).click()
      await expect(page.locator('#UserFilter-select-label')).not.toHaveText('None')
      await expect(page.locator('#UserFilter-select-label').filter({ hasText: 'Netflux' })).toBeVisible()
      await expect(page.locator('.UserListItem-dates').first()).toBeVisible()
    })
  })

  test.describe.only('Filters and pagination functionality', () => {
    test.beforeEach(async({ page }) => {
      await page.goto('/members')
    })

    test('can switch to second page', async({ page }) => {
      await page.getByRole('button', { name: 'Go to page 2' }).click()
      await expect(page.locator('.UserListItem-base').filter({ hasText: 'Herman Schmidt' })).toBeVisible()
    })

    test('can search by name after enter press', async({ page }) => {
      await page.fill('input#UserFilter-search-input', 'Herman')
      await page.keyboard.press('Enter')
      await expect(page.locator('.UserListItem-base').filter({ hasText: 'Herman Schmidt' })).toBeVisible()
    })

    test('can search by name after button press', async({ page }) => {
      await page.fill('input#UserFilter-search-input', 'Herman')
      await page.locator('button.UserFilter-search-button').click()
      await expect(page.locator('.UserListItem-base').filter({ hasText: 'Herman Schmidt' })).toBeVisible()
    })

    test('can search by workspace', async({ page }) => {
      await page.locator('#UserFilter-select-label').filter({ hasText: 'None' }).click()
      await page.locator('.UserFilter-select-item').filter({ hasText: 'Netflux' }).click()
      await expect(page.locator('.UserListItem-base').filter({ hasText: 'Brice Spinka' })).toBeVisible()
    })

    test('displays appropriate message when no users found with filter', async({ page }) => {
      await page.fill('input#UserFilter-search-input', 'Th3r3 1s n0 w4y th1s 3x1st')
      await page.keyboard.press('Enter')
      await expect(page.getByText('No users found')).toBeVisible()
    })
  })
})
