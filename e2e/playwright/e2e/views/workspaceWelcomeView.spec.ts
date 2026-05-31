import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('WorkspaceWelcomeView', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
  })

  test('shows WorkspaceWelcomeView', async({ page }) => {
    await page.getByText('Netflux').click()
    await expect(page.getByRole('button', { name: 'Frontend UI' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Backend API' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'DevOps' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Scripts' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Members' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Frontend UI' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Backend API' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'DevOps' })).toBeVisible()
  })

  test('navigate to board from WorkspaceWelcomeView', async({ page }) => {
    await page.getByText('Netflux').click()
    await expect(page.getByRole('link', { name: 'Frontend UI' })).toBeVisible()
    await page.getByRole('link', { name: 'Frontend UI' }).click()
    await expect(page.getByRole('heading', { name: 'To do' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Doing' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Work View' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Planning View' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Report View' })).toBeVisible()
    await expect(page.getByText('Implement the User API')).toBeVisible()
  })

  test('open TaskCardModal from WorkspaceWelcomeView', async({ page }) => {
    await page.getByText('Netflux').click()
    await page.getByRole('button', { name: 'Implement the User API 06/07/' }).click()
    await expect(page.getByRole('heading', { name: 'Implement the User API' })).toBeVisible()
    await expect(page.locator('div').filter({ hasText: /^Description$/ })).toBeVisible()
    await expect(page.getByText('Currently, there is no way to')).toBeVisible()
  })
})
