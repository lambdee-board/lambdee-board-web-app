import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright/e2e',
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${process.env.PORT || 3001}/`,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
