# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components/navbar.spec.ts >> Navbar >> can interact with dropdown buttons
- Location: e2e/playwright/e2e/components/navbar.spec.ts:15:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('div.MuiModal-root')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('div.MuiModal-root')

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
- paragraph: Let's get back to work, Brice Spinka!
- paragraph: Workspaces
- button "Netflux":
  - img
  - paragraph: Netflux
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
> 18 |     await expect(page.locator('div.MuiModal-root')).toBeVisible()
     |                                                     ^ Error: expect(locator).toBeVisible() failed
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
  35 |     await expect(page.locator('div.Sidebar-wrapper')).toBeVisible()
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