import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('TaskList (Planning)', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
    await page.getByText('Netflux').click()
    await page.mouse.click(0, 0)
    await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
    await page.locator('div.ListItem-board').first().click()
    await page.getByText('Planning View').click()
  })

  test.describe('Add new Task', () => {
    test('switches between add task button and add task input field', async({ page }) => {
      await page.locator('.TaskListPlanning-new-task-button').first().click()
      await expect(page.locator('.TaskListPlanning-new-task').first()).toBeVisible()
      await page.locator('.TaskListPlanning-new-task-cancel').first().click()
      await expect(page.locator('.TaskListPlanning-new-task-cancel')).not.toBeVisible()
    })

    test('inputs string into add task input field and cancels', async({ page }) => {
      await page.locator('.TaskListPlanning-new-task-button').first().click()
      await page.locator('.TaskListPlanning-new-task textarea').first().click()
      await page.locator('.TaskListPlanning-new-task textarea').first().fill('Cypress New Task')
      await page.keyboard.press('Escape')
      await expect(page.locator('.TaskListPlanning-new-task-button').first()).toBeVisible()
    })

    test('adds a new task', async({ page }) => {
      await page.locator('.TaskListPlanning-new-task-button').first().click()
      await page.locator('.TaskListPlanning-new-task textarea').first().click()
      await page.locator('.TaskListPlanning-new-task textarea').first().fill('New Test Task')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)
      await expect(page.getByText('New Test Task')).toBeVisible()
    })
  })

  test.describe('Drag and Drop', () => {
    test('can drag Backlog list to the middle', async({ page }) => {
      await expect(page.locator('.TaskListPlanning-header-text').first()).toBeVisible()
      await page.locator('.TaskListPlanning-header').filter({ hasText: 'To do' }).dispatchEvent('dragstart')
      await page.locator('.TaskListPlanning-header').nth(1).dispatchEvent('dragenter')
      await page.locator('.TaskListPlanning-header').nth(1).dispatchEvent('drop')
      await expect(page.getByText('To do')).toBeVisible()
    })

    test('can drag To do list to second position', async({ page }) => {
      await expect(page.locator('.TaskListPlanning-header-text').first()).toBeVisible()
      await page.locator('.TaskListPlanning-header').filter({ hasText: 'To do' }).dispatchEvent('dragstart')
      await page.locator('.TaskListPlanning-header').nth(0).dispatchEvent('dragenter')
      await page.locator('.TaskListPlanning-header').nth(0).dispatchEvent('drop')
      await expect(page.getByText('To do')).toBeVisible()
    })

    test('can drag Backlog list to last position', async({ page }) => {
      await expect(page.locator('.TaskListPlanning-header-text').first()).toBeVisible()
      await page.locator('.TaskListPlanning-header').filter({ hasText: 'Doing' }).dispatchEvent('dragstart')
      await page.locator('.TaskListPlanning-header').last().dispatchEvent('dragenter')
      await page.locator('.TaskListPlanning-header').last().dispatchEvent('drop')
      await expect(page.getByText('To do')).toBeVisible()
    })
  })
})
