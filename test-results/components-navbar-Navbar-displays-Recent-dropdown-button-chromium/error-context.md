# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components/navbar.spec.ts >> Navbar >> displays Recent dropdown button
- Location: e2e/playwright/e2e/components/navbar.spec.ts:24:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Recent' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'Recent' })

```

```yaml
- banner:
  - button "Lambdee":
    - img
    - heading "Lambdee" [level=6]
  - button "Workspaces"
  - button "Tasks"
  - button "Members"
  - button "Console"
  - button "Admin":
    - img "Admin"
- paragraph: Good to see you back, Admin!
- paragraph: Workspaces
- button "Lambdee":
  - img
  - paragraph: Lambdee
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { app } from '../../support/on-rails.js'
  3  | import { login } from '../../support/command.js'
  4  | 
  5  | test.describe('Navbar', () => {
  6  |   test.beforeEach(async({ page }) => {
  7  |     await app('clean')
  8  |     await login(page)
  9  |   })
  10 | 
  11 |   test('displays the navbar with the logo', async({ page }) => {
  12 |     await expect(page.getByRole('banner').getByRole('button', { name: 'Lambdee' })).toBeVisible()
  13 |   })
  14 | 
  15 |   test('displays Workspaces dropdown button', async({ page }) => {
  16 |     await expect(page.getByRole('button', { name: 'Workspaces' })).toBeVisible()
  17 |     await page.getByRole('button', { name: 'Workspaces' }).click()
  18 |     await expect(page.getByRole('menuitem', { name: 'Lambdee' })).toBeVisible()
  19 |     await page.getByRole('menuitem', { name: 'Lambdee' }).click()
  20 |     await expect(page.locator('button').filter({ hasText: 'Web App' })).toBeVisible()
  21 |     await expect(page.locator('button').filter({ hasText: 'Mobile App' })).toBeVisible()
  22 |   })
  23 | 
  24 |   test('displays Recent dropdown button', async({ page }) => {
> 25 |     await expect(page.getByRole('button', { name: 'Recent' })).toBeVisible()
     |                                                                ^ Error: expect(locator).toBeVisible() failed
  26 |     await page.getByRole('button', { name: 'Recent' }).click()
  27 |     await expect(page.getByRole('menuitem', { name: 'Lambdee/Web App' })).toBeVisible()
  28 |     await page.getByRole('menuitem', { name: 'Lambdee/Web App' }).click()
  29 |     await expect(page.getByText('To Do')).toBeVisible()
  30 |     await expect(page.getByText('In Progress')).toBeVisible()
  31 |   })
  32 | })
  33 | 
```