import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('TaskList', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
    await page.getByText('Netflux').click()
    await page.getByRole('link', { name: 'Frontend UI' }).click()
    await expect(page.getByRole('heading', { name: 'To do' })).toBeVisible()
  })

  test.describe('Add new Task', () => {
    test('switches between add task button and add task input field', async({ page }) => {
      await page.getByRole('button', { name: 'New Task' }).first().click()
      await expect(page.getByPlaceholder('Task Label').first()).toBeVisible()
      await page.getByPlaceholder('Task Label').first().press('Escape')
      await expect(page.getByRole('button', { name: 'New Task' }).first()).toBeVisible()
    })

    test('inputs string into add task input field and cancels', async({ page }) => {
      await page.getByRole('button', { name: 'New Task' }).first().click()
      await page.getByPlaceholder('Task Label').first().fill('New Test Task')
      await page.getByPlaceholder('Task Label').first().press('Escape')
      await expect(page.getByRole('button', { name: 'New Task' }).first()).toBeVisible()
    })

    test('adds a new task', async({ page }) => {
      await page.getByRole('button', { name: 'New Task' }).first().click()
      await page.getByPlaceholder('Task Label').first().fill('New Test Task')
      await page.getByPlaceholder('Task Label').first().press('Enter')
      await expect(page.getByText('New Test Task')).toBeVisible()
    })
  })

  test.describe('Drag and Drop', () => {
    test('can drag a list to the middle', async({ page }) => {
      await page.getByRole('heading', { name: 'To do' }).dispatchEvent('dragstart')
      await page.getByRole('heading', { name: 'Doing' }).dispatchEvent('dragenter')
      await page.getByRole('heading', { name: 'Doing' }).dispatchEvent('drop')
      await expect(page.getByRole('heading', { name: 'To do' })).toBeVisible()
    })

    test('can drag a list to the last position', async({ page }) => {
      await page.getByRole('heading', { name: 'To do' }).dispatchEvent('dragstart')
      await page.getByRole('heading', { name: 'Done' }).dispatchEvent('dragenter')
      await page.getByRole('heading', { name: 'Done' }).dispatchEvent('drop')
      await expect(page.getByRole('heading', { name: 'To do' })).toBeVisible()
    })
  })
})
