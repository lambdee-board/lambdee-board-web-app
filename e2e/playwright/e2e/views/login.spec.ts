import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('LoginView', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
  })

  test.describe('Login', () => {
    test('logs into account', async({ page }) => {
      await page.goto('/login')
      await expect(page.getByText('Lambdee')).toBeVisible()
      await page.fill('#login-email', 'b-spinka@example.com')
      await page.fill('input[type="password"]', 'password')
      await page.getByText('Login').click()
      await page.waitForURL('/')
    })

    test('logs out of account', async({ page }) => {
      await login(page)
      await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
      await page.locator('button.IconButton-user-avatar').click()
      await expect(page.locator('div.MuiModal-root')).toBeVisible()
      await page.mouse.click(0, 0)
      await page.getByText('Logout').click()
      await page.waitForURL('/login')
    })

    test('resets password from account view', async({ page }) => {
      await login(page)
      await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
      await page.locator('button.IconButton-user-avatar').click()
      await expect(page.locator('div.MuiModal-root')).toBeVisible()
      await page.mouse.click(0, 0)
      await page.getByText('Account').click()
      await page.getByText('Reset Password').click()
    })
  })
})
