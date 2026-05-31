import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('WelcomeView', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
  })

  test('displays Welcome View', async({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recents' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Lambdee/Web App' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Workspaces' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Netflux' })).toBeVisible()
  })

  test.describe('Recents', () => {
    test('navigate to recent', async({ page }) => {
      await expect(page.getByRole('button', { name: 'Lambdee/Web App' })).toBeVisible()
      await page.getByRole('button', { name: 'Lambdee/Web App' }).click()
      await expect(page.getByRole('heading', { name: 'To Do' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'In Progress' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()
    })

    test('adds a recent', async({ page }) => {
      await expect(page.getByText('RecentsLambdee/Web App')).toBeVisible()
      await page.getByRole('button', { name: 'Lambdee/Web App' }).click()
      await page.getByRole('link', { name: 'Mobile App' }).click()
      await expect(page.getByRole('heading', { name: 'In Progress' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible()
      await expect(page.getByText('Fix crash on Android')).toBeVisible()
      await page.getByRole('button', { name: 'Lambdee' }).click()
      await expect(page.getByText('RecentsLambdee/Web AppLambdee')).toBeVisible()
    })
  })

  test.describe('Workspaces', () => {
    test('navigate to workspace', async({ page }) => {
      await expect(page.getByRole('button', { name: 'Netflux' })).toBeVisible()
      await page.getByRole('button', { name: 'Netflux' }).click()
      await expect(page.getByRole('button', { name: 'Frontend UI' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Backend API' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'DevOps' })).toBeVisible()
    })
  })
})
