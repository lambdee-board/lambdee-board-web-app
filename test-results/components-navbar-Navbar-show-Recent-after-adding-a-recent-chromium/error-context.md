# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components/navbar.spec.ts >> Navbar >> show Recent after adding a recent
- Location: e2e/playwright/e2e/components/navbar.spec.ts:32:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('div.Sidebar-wrapper')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('div.Sidebar-wrapper')
    13 × locator resolved to <div class="Sidebar-wrapper MuiBox-root css-0">…</div>
       - unexpected value "hidden"

```

```yaml
- banner:
  - button "Lambdee":
    - img
    - heading "Lambdee" [level=6]
  - button "Workspaces"
  - button "Actions"
  - button "Tasks"
  - button "Members"
  - button "Console"
  - button "Brice Spinka":
    - img "Brice Spinka"
- list:
  - button "Netflux":
    - img
    - text: Netflux
  - button "Settings"
  - button "Scripts"
  - button "Members"
  - button "Backend API"
  - button "Empty"
- button "Add New Board":
  - paragraph: Add New Board
- button "Backend API":
  - paragraph: Backend API
- separator
- text: To do
- button "Implement the User API 05/28/26"
- button "Add automatic deployments 05/28/26"
- text: Doing
- button "Change the ORM 05/28/26"
- button "Add movie groups to the admin panel 05/28/26"
- text: Done
- button "Implement user groups 05/28/26"
- button "Add automatic Tests 05/28/26"
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
  12 |     await expect(page.locator('header h6').first()).toHaveText('Lambdee')
  13 |   })
  14 | 
  15 |   test('can interact with dropdown buttons', async({ page }) => {
  16 |     await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
  17 |     await page.getByText('Workspaces').click()
  18 |     await expect(page.locator('div.MuiModal-root')).toBeVisible()
  19 |     await page.locator('div.MuiBackdrop-root').first().click()
  20 | 
  21 |     await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
  22 |     await page.locator('button.IconButton-user-avatar').click()
  23 |     await expect(page.locator('div.MuiModal-root')).toBeVisible()
  24 |     await page.locator('div.MuiBackdrop-root').first().click()
  25 |   })
  26 | 
  27 |   test('does not show Recent', async({ page }) => {
  28 |     await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
  29 |     await expect(page.getByText('Recent')).not.toBeVisible()
  30 |   })
  31 | 
  32 |   test('show Recent after adding a recent', async({ page }) => {
  33 |     await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
  34 |     await page.getByText('Netflux').click()
> 35 |     await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  36 |     await page.locator('div.ListItem-board').first().click()
  37 |     await page.reload()
  38 |     await page.getByText('Lambdee').click()
  39 |     await page.reload()
  40 |     await expect(page.getByText('Recent')).toBeVisible()
  41 |     await expect(page.getByText('Recents')).toBeVisible()
  42 |   })
  43 | 
  44 |   test('navigate to Recent', async({ page }) => {
  45 |     await expect(page.locator('div.MuiModal-root')).not.toBeVisible()
  46 |     await page.getByText('Netflux').click()
  47 |     await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
  48 |     await page.locator('div.ListItem-board').first().click()
  49 |     await page.reload()
  50 |     await page.getByText('Lambdee').click()
  51 |     await page.reload()
  52 |     await expect(page.getByText('Recents')).toBeVisible()
  53 |     await page.getByText('Recent').click()
  54 |     await page.locator('.MuiMenuItem-root').first().click()
  55 |   })
  56 | })
  57 | 
```