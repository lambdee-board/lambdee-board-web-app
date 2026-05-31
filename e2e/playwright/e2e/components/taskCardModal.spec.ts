import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('TaskCardModal', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
    await page.getByText('Netflux').click()
    await page.getByRole('link', { name: 'Frontend UI' }).click()
    await page.getByText('Implement the User API').click()
    await expect(page.getByRole('heading', { name: 'Implement the User API' })).toBeVisible()
  })

  test.describe('Task information', () => {
    test('displays task details', async({ page }) => {
      const modal = page.locator('.TaskList-Modal')
      await expect(modal.getByText('Author')).toBeVisible()
      await expect(modal.getByText('Frank Lee').first()).toBeVisible()
      await expect(modal.getByText('Priority')).toBeVisible()
      await expect(modal.getByText('Points')).toBeVisible()
      await expect(modal.getByText('Tags')).toBeVisible()
      await expect(modal.getByText('Library')).toBeVisible()
      await expect(modal.getByText('TypeScript')).toBeVisible()
      await expect(modal.getByText('Assigned')).toBeVisible()
      await expect(modal.getByText('Grace Kim')).toBeVisible()
    })

    test('displays description', async({ page }) => {
      await expect(page.getByText('Description')).toBeVisible()
      await expect(page.getByText('Currently, there is no way')).toBeVisible()
    })

    test('displays comments', async({ page }) => {
      await expect(page.getByText('Comments')).toBeVisible()
      await expect(page.getByText('Should we use SWR or React Query for this?')).toBeVisible()
      await expect(page.getByText('Lets go with SWR')).toBeVisible()
    })

    test('closes the modal', async({ page }) => {
      await page.mouse.click(0, 0)
      await expect(page.getByRole('heading', { name: 'Implement the User API' })).toBeHidden()
    })
  })

  test.describe('Edit task label', () => {
    test('opens and cancels the label edit', async({ page }) => {
      const modal = page.locator('.TaskList-Modal')
      await page.getByRole('heading', { name: 'Implement the User API' }).click()
      await expect(modal.locator('textarea').first()).toBeVisible()
      await modal.getByText('Description').click()
      await expect(page.getByRole('heading', { name: 'Implement the User API' })).toBeVisible()
    })

    test('changes the task label', async({ page }) => {
      const modal = page.locator('.TaskList-Modal')
      await page.getByRole('heading', { name: 'Implement the User API' }).click()
      await modal.locator('textarea').first().fill('Renamed Task')
      await modal.locator('textarea').first().press('Enter')
      await expect(page.getByRole('heading', { name: 'Renamed Task' })).toBeVisible()
    })
  })

  test.describe('Edit task tags', () => {
    test('attaches the "Feature" tag', async({ page }) => {
      const modal = page.locator('.TaskList-Modal')
      await page.getByText('Add tag').click()
      await page.getByRole('combobox', { name: 'Add tag' }).fill('Feature')
      await page.getByRole('option', { name: 'Feature', exact: true }).click()
      await expect(modal.getByText('Feature')).toBeVisible()
    })

    test('creates and attaches a new tag', async({ page }) => {
      await page.getByText('Add tag').click()
      await page.getByRole('combobox', { name: 'Add tag' }).fill('Brand New Tag')
      await page.getByRole('option', { name: 'Create "Brand New Tag"' }).click()
      await expect(page.getByRole('textbox', { name: 'Tag Name' })).toHaveValue('Brand New Tag')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('Brand New Tag')).toBeVisible()
    })
  })

  test.describe('Edit task time', () => {
    test('opens and closes the time dialog', async({ page }) => {
      await expect(page.getByText('No time registered')).toBeVisible()
      await page.getByText('No time registered').click()
      await expect(page.getByText('Providing time use following format:')).toBeVisible()
      await page.getByRole('button', { name: 'Cancel' }).click()
      await expect(page.getByText('Providing time use following format:')).toBeHidden()
    })

    test('adds time when format is valid', async({ page }) => {
      await page.getByText('No time registered').click()
      await page.getByRole('textbox', { name: 'Formatted time' }).fill('1d 1h 1m')
      await page.getByRole('button', { name: 'Add time' }).click()
      await expect(page.getByText('1d 1h 1m')).toBeVisible()
    })

    test('rejects an invalid time format', async({ page }) => {
      await page.getByText('No time registered').click()
      await page.getByRole('textbox', { name: 'Formatted time' }).fill('not a valid time')
      await page.getByRole('button', { name: 'Add time' }).click()
      await expect(page.getByRole('textbox', { name: 'Formatted time' })).toBeVisible()
      await page.getByRole('button', { name: 'Cancel' }).click()
      await expect(page.getByText('No time registered')).toBeVisible()
    })
  })
})
