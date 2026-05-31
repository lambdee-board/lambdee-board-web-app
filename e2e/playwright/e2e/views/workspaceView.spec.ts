import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('Workspace View', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
    await page.getByText('Netflux').click()
  })

  test.describe('BoardWorkView', () => {
    test('shows the board', async({ page }) => {
      await page.getByRole('button', { name: 'Frontend UI' }).click()
      await page.getByRole('button', { name: 'Work View' }).click()
      await expect(page.getByRole('heading', { name: 'To do' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Doing' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()
      await expect(page.getByText('Implement the User API')).toBeVisible()
      await expect(page.getByText('Refactor dashboard layout')).toBeVisible()
      await expect(page.getByText('Add loading skeletons')).toBeVisible()
    })
  })

  test.describe('BoardPlanningView', () => {
    test.beforeEach(async({ page }) => {
      await page.getByRole('button', { name: 'Frontend UI' }).click()
      await page.getByRole('button', { name: 'Planning View' }).click()
    })

    test('shows the board', async({ page }) => {
      await expect(page.getByRole('listitem').filter({ hasText: 'To do' })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: 'Doing' })).toBeVisible()
      await expect(page.getByRole('listitem').filter({ hasText: 'Review' })).toBeVisible()
      await expect(page.getByText('Implement the User API')).toBeVisible()
      await expect(page.getByText('Refactor dashboard layout')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Create New List' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Start Sprint' })).toBeVisible()
    })

    test('opens and closes (using mouse) "Create New List" button', async({ page }) => {
      await expect(page.getByRole('button', { name: 'Create New List' })).toBeVisible()
      await page.getByRole('button', { name: 'Create New List' }).click()
      await expect(page.getByRole('button', { name: 'Create New List' })).toBeHidden()
      await expect(page.getByRole('textbox', { name: 'New List Name' })).toBeVisible()
      await page.getByRole('button').filter({ hasText: /^$/ }).nth(1)
        .click()
      await expect(page.getByRole('button', { name: 'Create New List' })).toBeVisible()
      await expect(page.getByRole('textbox', { name: 'New List Name' })).toBeHidden()
    })

    test('opens and closes (using esc button) "Create New List" button', async({ page }) => {
      await expect(page.getByRole('button', { name: 'Create New List' })).toBeVisible()
      await page.getByRole('button', { name: 'Create New List' }).click()
      await expect(page.getByRole('button', { name: 'Create New List' })).toBeHidden()
      await expect(page.getByRole('textbox', { name: 'New List Name' })).toBeVisible()
      await page.getByRole('textbox', { name: 'New List Name' }).press('Escape')
      await expect(page.getByRole('button', { name: 'Create New List' })).toBeVisible()
      await expect(page.getByRole('textbox', { name: 'New List Name' })).toBeHidden()
    })

    test('opens and closes (by clicking away) "Create New List" button', async({ page }) => {
      await expect(page.getByRole('button', { name: 'Create New List' })).toBeVisible()
      await page.getByRole('button', { name: 'Create New List' }).click()
      await expect(page.getByRole('textbox', { name: 'New List Name' })).toBeVisible()
      await page.getByText('To do', { exact: true }).click()
      await expect(page.getByRole('button', { name: 'Create New List' })).toBeVisible()
    })

    test('creates new list named "Test List"', async({ page }) => {
      await page.getByRole('button', { name: 'Create New List' }).click()
      await page.getByRole('textbox', { name: 'New List Name' }).fill('Test List')
      await page.getByRole('textbox', { name: 'New List Name' }).press('Enter')
      await expect(page.getByText('Test List')).toBeVisible()
    })
  })
})
