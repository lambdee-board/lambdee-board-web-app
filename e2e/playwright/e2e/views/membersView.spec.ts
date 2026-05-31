import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('Members View', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
  })

  test.describe('Accessing view', () => {
    test('opens members view from navbar', async({ page }) => {
      await page.getByRole('button', { name: 'Members' }).click()
      await expect(page.getByText('Filters')).toBeVisible()
      await expect(page.getByText('Registered').first()).toBeVisible()
    })

    test('opens members view from workspace', async({ page }) => {
      await page.getByText('Netflux').click()
      await page.getByRole('link', { name: 'Members' }).click()
      await expect(page.getByText('Filters')).toBeVisible()
      await expect(page.getByText('Registered').first()).toBeVisible()
    })
  })

  test.describe('Filters and pagination functionality', () => {
    test.beforeEach(async({ page }) => {
      await page.goto('/members')
      await expect(page.getByText('Filters')).toBeVisible()
    })

    test('can switch to second page', async({ page }) => {
      await expect(page.getByText('Admin', { exact: true })).toBeVisible()
      await page.getByRole('button', { name: 'Go to page 2' }).click()
      await expect(page.getByText('Admin', { exact: true })).toBeHidden()
    })

    test('can search by name after enter press', async({ page }) => {
      await page.getByLabel('User name').fill('Herman')
      await page.getByLabel('User name').press('Enter')
      await expect(page.getByText('Herman Schmidt')).toBeVisible()
    })

    test('can search by name after button press', async({ page }) => {
      await page.getByLabel('User name').fill('Herman')
      await page.getByRole('button', { name: 'Search' }).click()
      await expect(page.getByText('Herman Schmidt')).toBeVisible()
    })

    test('can filter by workspace', async({ page }) => {
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: 'Netflux' }).click()
      await page.getByLabel('User name').fill('Jack Wilson')
      await page.getByRole('button', { name: 'Search' }).click()
      await expect(page.getByText('No users found')).toBeVisible()
    })

    test('displays appropriate message when no users found with filter', async({ page }) => {
      await page.getByLabel('User name').fill('Th3r3 1s n0 w4y th1s 3x1st')
      await page.getByLabel('User name').press('Enter')
      await expect(page.getByText('No users found')).toBeVisible()
    })
  })
})
