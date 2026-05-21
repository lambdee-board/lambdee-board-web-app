import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('Navbar', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
  })

  test('displays the navbar with the logo', async({ page }) => {
    await expect(page.getByRole('banner').getByRole('button', { name: 'Lambdee' })).toBeVisible()
  })

  test('displays Workspaces dropdown button', async({ page }) => {
    await expect(page.getByRole('button', { name: 'Workspaces' })).toBeVisible()
    await page.getByRole('button', { name: 'Workspaces' }).click()
    await expect(page.getByRole('menuitem', { name: 'Lambdee' })).toBeVisible()
    await page.getByRole('menuitem', { name: 'Lambdee' }).click()
    await expect(page.locator('button').filter({ hasText: 'Web App' })).toBeVisible()
    await expect(page.locator('button').filter({ hasText: 'Mobile App' })).toBeVisible()
  })

  test('displays Recent dropdown button', async({ page }) => {
    await expect(page.getByRole('button', { name: 'Recent' })).toBeVisible()
    await page.getByRole('button', { name: 'Recent' }).click()
    await expect(page.getByRole('menuitem', { name: 'Lambdee/Web App' })).toBeVisible()
    await page.getByRole('menuitem', { name: 'Lambdee/Web App' }).click()
    await expect(page.getByText('To Do')).toBeVisible()
    await expect(page.getByText('In Progress')).toBeVisible()
  })
})
