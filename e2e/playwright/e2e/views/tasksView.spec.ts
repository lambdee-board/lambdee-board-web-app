import { test, expect } from '@playwright/test'
import { app } from '../../support/on-rails.js'
import { login } from '../../support/command.js'

test.describe('TasksView', () => {
  // Frank Lee is a manager who is assigned the "Configure log aggregation"
  // task on the Netflux DevOps board, so his Tasks view is populated.
  test.beforeEach(async({ page }) => {
    await app('clean')
    await login(page, 'frank@example.com')
    await page.goto('/tasks')
  })

  test('shows TasksView', async({ page }) => {
    await expect(page.getByText('Netflux')).toBeVisible()
    await expect(page.getByText('EduFlow')).toBeVisible()
  })

  test('opens Workspace in TasksView', async({ page }) => {
    await page.getByText('Netflux').click()
    await expect(page.getByText('Configure log aggregation')).toBeVisible()
  })

  test('navigate to board from TasksView', async({ page }) => {
    await page.getByText('Netflux').click()
    await page.getByRole('button', { name: 'DevOps', exact: true }).click()
    await page.getByRole('button', { name: 'Planning View' }).click()
    await expect(page.getByRole('button', { name: 'Create New List' })).toBeVisible()
    await expect(page.getByText('Set up Kubernetes cluster')).toBeVisible()
  })

  test('open TaskCardModal from TasksView', async({ page }) => {
    await page.getByText('Netflux').click()
    await page.getByText('Configure log aggregation').click()
    await expect(page.getByText('Description')).toBeVisible()
    await expect(page.getByText('Route all container logs')).toBeVisible()
  })
})
