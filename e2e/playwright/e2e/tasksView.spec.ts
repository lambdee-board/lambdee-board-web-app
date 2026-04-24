import { test, expect } from '@playwright/test'
import { app } from '../support/on-rails.js'
import { login } from '../support/command.js'

test.describe('TasksView', () => {
  test.beforeEach(async ({ page }) => {
    await app('clean')
    await login(page)
    await page.goto('/tasks')
  })

  test('shows TasksView', async ({ page }) => {
    await page.getByText('Tasks').click()
    await expect(page.locator('.MuiDivider-root').first()).toBeVisible()
  })

  test('opens Workspace in TasksView', async ({ page }) => {
    await page.getByText('Tasks').click()
    await page.getByText('Netflux').click()
    await expect(page.getByText('To do')).toBeVisible()
    await expect(page.getByText('Implement the User API')).toBeVisible()
  })

  test('navigate to board from TasksView', async ({ page }) => {
    await page.getByText('Tasks').click()
    await page.getByText('Netflux').click()
    await page.locator('.userTasks-card-title').filter({ hasText: 'Backend API' }).click()
    await page.getByText('Planning View').click()
    await expect(page.getByText('Create New List')).toBeVisible()
    await expect(page.getByText('Doing')).toBeVisible()
    await expect(page.getByText('Change the ORM')).toBeVisible()
  })

  test('open TaskCardModal from TasksView', async ({ page }) => {
    await page.getByText('Tasks').click()
    await page.getByText('Netflux').click()
    await expect(page.getByText('To do')).toBeVisible()
    await page.getByText('Implement the User API').click()
    await expect(page.getByText('Description')).toBeVisible()
    await expect(page.getByText('Currently, there is no way')).toBeVisible()
  })
})
