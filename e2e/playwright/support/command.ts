import { Page } from '@playwright/test'

export async function login(page: Page, email = 'b-spinka@example.com', password = 'password') {
  await page.goto('/login')
  await page.fill('#login-email', email)
  await page.fill('input[type="password"]', password)
  await page.getByText('Login').click()
  await page.waitForURL('/')
}
