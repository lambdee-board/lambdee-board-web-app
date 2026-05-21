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
  })

  test('navigate to board from WorkspaceWelcomeView', async({ page }) => {
    await page.getByText('Netflux').click()
    await page.getByText('Backend API').click()
    await page.getByText('Planning View').click()
    await expect(page.getByText('Create New List')).toBeVisible()
    await expect(page.getByText('Doing')).toBeVisible()
    await expect(page.getByText('Change the ORM')).toBeVisible()
  })

  test('open TaskCardModal from WorkspaceWelcomeView', async({ page }) => {
    await page.getByText('Netflux').click()
    await expect(page.getByText('To do')).toBeVisible()
    await page.getByText('Implement the User API').click()
    await expect(page.getByText('Description')).toBeVisible()
    await expect(page.getByText('Currently, there is no way')).toBeVisible()
  })
})
