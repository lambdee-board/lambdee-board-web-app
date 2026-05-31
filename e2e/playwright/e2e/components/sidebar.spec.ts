import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('Sidebar', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
    await page.getByText('Netflux').click()
    await expect(page.getByRole('link', { name: 'Frontend UI' })).toBeVisible()
  })

  test.describe('Add new Board', () => {
    test('switches between add board button and add board input field', async({ page }) => {
      await expect(page.getByRole('button', { name: 'Add New Board' })).toBeVisible()
      await page.getByRole('button', { name: 'Add New Board' }).click()
      await expect(page.getByPlaceholder('Board Name')).toBeVisible()
      await page.getByPlaceholder('Board Name').press('Escape')
      await expect(page.getByRole('button', { name: 'Add New Board' })).toBeVisible()
    })

    test('inputs string into add board input field and cancels', async({ page }) => {
      await page.getByRole('button', { name: 'Add New Board' }).click()
      await page.getByPlaceholder('Board Name').fill('New Test Board')
      await page.getByPlaceholder('Board Name').press('Escape')
      await expect(page.getByRole('button', { name: 'Add New Board' })).toBeVisible()
    })

    test('adds a new board', async({ page }) => {
      await page.getByRole('button', { name: 'Add New Board' }).click()
      await page.getByPlaceholder('Board Name').fill('New Test Board')
      await page.getByPlaceholder('Board Name').press('Enter')
      await expect(page.getByRole('link', { name: 'New Test Board' })).toBeVisible()
    })
  })
})
