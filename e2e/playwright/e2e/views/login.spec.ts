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
      await expect(page.getByRole('heading', { name: 'Lambdee' })).toBeVisible()
      await page.locator('#login-email').fill('b-spinka@example.com')
      await page.locator('input[type="password"]').fill('password')
      await page.getByRole('button', { name: 'Login' }).click()
      await page.waitForURL('/')
    })

    test('logs out of account', async({ page }) => {
      await login(page)
      await page.getByRole('button', { name: 'Admin' }).click()
      await page.getByRole('menuitem', { name: 'Logout' }).click()
      await page.waitForURL('/login')
    })

    test('resets password from account view', async({ page }) => {
      await login(page)
      await page.getByRole('button', { name: 'Admin' }).click()
      await page.getByRole('menuitem', { name: 'Account' }).click()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('heading', { name: 'Your Account' })).toBeVisible()
      await page.getByRole('button', { name: 'Reset Password' }).click()
      await page.waitForURL('/login/password-reset')
    })
  })
})
