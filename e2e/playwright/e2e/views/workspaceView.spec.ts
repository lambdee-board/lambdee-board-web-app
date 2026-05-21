import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('Workspace View', () => {
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page)
    await page.getByText('Netflux').click()
  })

  test.describe('BoardWorkView', () => {
    test.beforeEach(async({ page }) => {
      await page.locator('div.ListItem-board').first().click()
      await page.getByText('Work View').click()
    })

    test('shows the board', async({ page }) => {
      await expect(page.locator('.TaskLists-wrapper')).toBeVisible()
      await expect(page.getByText('To do')).toBeVisible()
    })

    test('shows all list elements', async({ page }) => {
      await expect(page.locator('.TaskList-wrapper').first()).toBeVisible()
      await expect(page.locator('.TaskList-header-text').first()).toBeVisible()
      await expect(page.locator('.TaskList-new-task-button p').first()).toBeVisible()
    })
  })

  test.describe('BoardPlanningView', () => {
    test.beforeEach(async({ page }) => {
      await page.locator('div.ListItem-board').first().click()
      await page.getByText('Planning View').click()
    })

    test('shows the board', async({ page }) => {
      await expect(page.locator('.TaskLists-wrapper')).toBeVisible()
      await expect(page.getByText('To do')).toBeVisible()
    })

    test('shows all list elements', async({ page }) => {
      await expect(page.locator('.TaskListPlanning-wrapper').first()).toBeVisible()
      await expect(page.locator('.TaskListPlanning-header-text').first()).toBeVisible()
      await expect(page.locator('.TaskListPlanning-new-task-button p').first()).toBeVisible()
    })

    test('opens and closes (using mouse) "Create New List" button', async({ page }) => {
      await expect(page.locator('.Toolbar')).toBeVisible()
      await page.locator('.Toolbar-create-list-button').first().click()
      await expect(page.locator('.Toolbar-new-list-input')).toBeVisible()
      await page.locator('.Toolbar-new-list-cancel').click()
      await expect(page.locator('.Toolbar-create-list-button')).toBeVisible()
    })

    test('opens and closes (using esc button) "Create New List" button', async({ page }) => {
      await expect(page.locator('.Toolbar')).toBeVisible()
      await page.locator('.Toolbar-create-list-button').first().click()
      await expect(page.locator('.Toolbar-new-list-input')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.locator('.Toolbar-create-list-button')).toBeVisible()
    })

    test('opens and closes (by clicking away) "Create New List" button', async({ page }) => {
      await expect(page.locator('.Toolbar')).toBeVisible()
      await page.locator('.Toolbar-create-list-button').first().click()
      await expect(page.locator('.Toolbar-new-list-input')).toBeVisible()
      await page.mouse.click(0, 0)
      await expect(page.locator('.Toolbar-create-list-button')).toBeVisible()
    })

    test('creates new list named "Test List"', async({ page }) => {
      await expect(page.locator('.Toolbar')).toBeVisible()
      await page.locator('.Toolbar-create-list-button').first().click()
      await page.locator('.Toolbar-new-list-input').click()
      await page.fill('.Toolbar-new-list-input', 'Test List')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)
      await expect(page.locator('.TaskListPlanning-header-text').filter({ hasText: 'Test List' })).toBeVisible()
    })
  })
})
