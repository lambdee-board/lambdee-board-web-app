import { test, expect } from '@playwright/test'
import { app } from '../support/on-rails.js'
import { login } from '../support/command.js'

test.describe('TaskCardModal', () => {
  test.beforeEach(async ({ page }) => {
    await app('clean')
    await login(page)
    await page.getByText('Workspaces').click()
    await page.getByText('Netflux').click({ force: true })
    await page.mouse.click(0, 0)
    await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
    await page.locator('div.ListItem-board').first().click()
  })

  test.describe('Shows task card modal with task information', () => {
    test('Display and close task card modal', async ({ page }) => {
      await page.locator('.TaskCard-label').last().click()
      await expect(page.locator('div.TaskCardModal-sidebar')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-main')).toBeVisible()
      await page.mouse.click(0, 0)
      await expect(page.locator('div.TaskCardModal-wrapper')).not.toBeVisible()
    })

    test('Display task Author', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-sidebar')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-sidebar-card-box').first()).toBeVisible()
    })

    test('Display task Priority', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-sidebar')).toBeVisible()
      await expect(page.locator('.TaskPriority-button')).toBeVisible()
      await page.locator('.TaskPriority-button').click()
    })

    test('Display task Points', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-sidebar')).toBeVisible()
      await expect(page.locator('div.TaskPoints')).toBeVisible()
    })

    test('Display task Tags', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-sidebar')).toBeVisible()
      await expect(page.locator('.TaskCardModal-sidebar-card-box-tags')).toBeVisible()
    })

    test('Display task Assigned', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-sidebar')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-sidebar-card-box').first()).toBeVisible()
    })

    test('Display task Label', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-main')).toBeVisible()
      await expect(page.locator('div.TaskCardModal-main-label').filter({ hasText: 'Implement the User API' })).toBeVisible()
    })

    test('Display task Description', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.getByText('Currently, there is no way')).toBeVisible()
    })

    test('Display task Comment', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.getByText('Currently, there is no way')).toBeVisible()
    })
  })

  test.describe('Edit task label', () => {
    test('switches between label and edit label input field', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('.TaskLabel-typography')).toBeVisible()
      await page.locator('.TaskLabel-typography').click()
      await page.mouse.click(0, 0)
      await expect(page.locator('.TaskLabel-edit-input-cancel')).not.toBeVisible()
    })

    test('inputs string into edit label input field and cancels', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await page.locator('.TaskLabel-typography').click()
      await page.locator('.TaskLabel-edit-input-text').click()
      await page.locator('.TaskLabel-edit-input-text').fill('New Test Task')
      await page.locator('.TaskLabel-edit-input-cancel').click()
      await expect(page.locator('.TaskLabel-typography').filter({ hasText: 'Implement the User API' })).toBeVisible()
    })

    test('change label of a task', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await page.locator('.TaskLabel-typography').click()
      await page.locator('.TaskLabel-edit-input-text').fill('New Test Task')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)
      await expect(page.getByText('New Test Task')).toBeVisible()
    })
  })

  test.describe('Edit task priority', () => {
    test('switches between priority and edit priority dropdown list', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('.TaskPriority-button')).toBeVisible()
      await page.locator('.TaskPriority-button').click()
      await expect(page.locator('.TaskPriority-button')).not.toBeVisible()
    })

    test('changes priority', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await page.locator('.TaskPriority-button').click()
      await page.getByText('Very Low').click()
      await page.waitForTimeout(500)
      await expect(page.locator('.TaskPriority-button')).toBeVisible()
    })
  })

  test.describe('Edit task points', () => {
    test('switches between points and edit points input field', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('div.TaskPoints .TaskPoints-avatar')).toBeVisible()
      await page.locator('div.TaskPoints .TaskPoints-avatar').click()
      await expect(page.locator('.TaskPoints-input-text')).toBeVisible()
      await page.mouse.click(0, 0)
      await expect(page.locator('.TaskPoints-input-text')).not.toBeVisible()
    })
  })

  test.describe('Edit task tags', () => {
    test('switches between "Add tag" button and autocomplete input', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('.TaskCardModal-add-tag-btn')).toBeVisible()
      await page.locator('.TaskCardModal-add-tag-btn').click()
      await expect(page.locator('#attach-tag-to-task-select')).toBeVisible()
      await page.mouse.click(0, 0)
      await expect(page.locator('.TaskCardModal-add-tag-btn')).toBeVisible()
    })

    test('attaches "Library" tag to task', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await page.locator('.TaskCardModal-add-tag-btn').click()
      await page.locator('#attach-tag-to-task-select').click()
      await page.keyboard.type('Library')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      await expect(page.locator('.TaskCardModal-sidebar-card-box-tags').filter({ hasText: 'Library' })).toBeVisible()
    })

    test('detaches "Library" tag from task', async ({ page }) => {
      await page.reload()
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await page.locator('.TaskCardModal-sidebar-card-box-tags .Tag svg').first().click()
      await expect(page.getByText('Library')).not.toBeVisible()
    })

    test('opens new tag dialog, then closes dialog/autocomplete input', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await page.locator('.TaskCardModal-add-tag-btn').click()
      await page.locator('#attach-tag-to-task-select').click()
      await page.keyboard.type('New Tag')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      await expect(page.locator('#create-tag-name-input')).toBeVisible()
      await page.locator('.create-tag-buttons button').filter({ hasText: 'Cancel' }).click()
      await expect(page.locator('#create-tag-name-input')).not.toBeVisible()
      await expect(page.locator('.TaskCardModal-add-tag-btn')).toBeVisible()
    })

    test('creates/attaches "New Tag"', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await page.locator('.TaskCardModal-add-tag-btn').click()
      await page.locator('#attach-tag-to-task-select').click()
      await page.keyboard.type('New Tag')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      await expect(page.locator('#create-tag-name-input')).toHaveValue('New Tag')
      await page.locator('.create-tag-buttons button').filter({ hasText: 'Create' }).click()
      await page.waitForTimeout(500)
      await expect(page.locator('.TaskCardModal-sidebar-card-box-tags').filter({ hasText: 'New Tag' })).toBeVisible()
    })
  })

  test.describe('Edit task time', () => {
    test('can open and close TaskTime dialog', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('.TaskTime-progress p').filter({ hasText: 'No time registered' })).toBeVisible()
      await page.locator('.TaskTime').click()
      await expect(page.locator('.TaskTime-dialog-content')).toBeVisible()
      await page.getByText('Cancel').click()
      await expect(page.locator('.TaskTime-dialog-content')).not.toBeVisible()
    })

    test('can add time to task when format is valid', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('.TaskTime-progress p').filter({ hasText: 'No time registered' })).toBeVisible()
      await page.locator('.TaskTime').click()
      await page.fill('input#formatted-task-time', '1d 1h 1m')
      await page.getByText('Add time').click()
      await expect(page.locator('.TaskTime-progress p').filter({ hasText: 'No time registered' })).not.toBeVisible()
      await expect(page.locator('.TaskTime-progress p').filter({ hasText: '1d 1h 1m' })).toBeVisible()
    })

    test('cannot add time to task when format is invalid', async ({ page }) => {
      await page.getByText('Implement the User API').click()
      await expect(page.locator('div.TaskCardModal-wrapper')).toBeVisible()
      await expect(page.locator('.TaskTime-progress p').filter({ hasText: 'No time registered' })).toBeVisible()
      await page.locator('.TaskTime').click()
      await page.fill('input#formatted-task-time', '1dupa 1ham 1mieszanina')
      await page.getByText('Add time').click()
      await expect(page.locator('input#formatted-task-time').locator('..')).toHaveClass(/Mui-error/)
      await page.getByText('Cancel').click()
      await expect(page.locator('.TaskTime-progress p').filter({ hasText: 'No time registered' })).toBeVisible()
      await expect(page.locator('.TaskTime-progress p').filter({ hasText: '1d 1h 1m' })).not.toBeVisible()
    })
  })
})
