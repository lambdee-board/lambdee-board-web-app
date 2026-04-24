import { test, expect } from '@playwright/test'
import { app } from '../support/on-rails.js'
import { login } from '../support/command.js'

test.describe('TaskList', () => {
  test.beforeEach(async ({ page }) => {
    await app('clean')
    await login(page)
    await page.getByText('Netflux').click()
    await page.mouse.click(0, 0)
    await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
    await page.locator('div.ListItem-board').first().click()
  })

  test.describe('Add new Task', () => {
    test('switches between add task button and add task input field', async ({ page }) => {
      await page.locator('.TaskList-new-task-button').first().click()
      await expect(page.locator('.TaskList-new-task').first()).toBeVisible()
      await page.locator('.TaskList-new-task-cancel').first().click()
      await expect(page.locator('.TaskList-new-task-cancel')).not.toBeVisible()
    })

    test('inputs string into add task input field and cancels', async ({ page }) => {
      await page.locator('.TaskList-new-task-button').first().click()
      await page.locator('.TaskList-new-task textarea').first().click()
      await page.locator('.TaskList-new-task textarea').first().fill('Cypress New Task')
      await page.keyboard.press('Escape')
      await expect(page.locator('.TaskList-new-task-button').first()).toBeVisible()
    })

    test('adds a new task', async ({ page }) => {
      await page.locator('.TaskList-new-task-button').first().click()
      await page.locator('.TaskList-new-task textarea').first().click()
      await page.locator('.TaskList-new-task textarea').first().fill('New Test Task')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)
      await expect(page.locator('.TaskCard').filter({ hasText: 'New Test Task' })).toBeVisible()
    })
  })

  test.describe('Drag and Drop', () => {
    test('can drag Backlog list to the middle', async ({ page }) => {
      await expect(page.locator('.TaskList-header-text').first()).toBeVisible()
      await page.locator('.TaskList-header').filter({ hasText: 'To do' }).dispatchEvent('dragstart')
      await page.locator('.TaskList-header').nth(1).dispatchEvent('dragenter')
      await page.locator('.TaskList-header').nth(1).dispatchEvent('drop')
      await expect(page.getByText('To do')).toBeVisible()
    })

    test('can drag To do list to second position', async ({ page }) => {
      await expect(page.locator('.TaskList-header-text').first()).toBeVisible()
      await page.locator('.TaskList-header').filter({ hasText: 'To do' }).dispatchEvent('dragstart')
      await page.locator('.TaskList-header').nth(0).dispatchEvent('dragenter')
      await page.locator('.TaskList-header').nth(0).dispatchEvent('drop')
      await expect(page.getByText('To do')).toBeVisible()
    })

    test('can drag Backlog list to last position', async ({ page }) => {
      await expect(page.locator('.TaskList-header-text').first()).toBeVisible()
      await page.locator('.TaskList-header').filter({ hasText: 'To do' }).dispatchEvent('dragstart')
      await page.locator('.TaskList-header').last().dispatchEvent('dragenter')
      await page.locator('.TaskList-header').last().dispatchEvent('drop')
      await expect(page.getByText('To do')).toBeVisible()
    })
  })
})
