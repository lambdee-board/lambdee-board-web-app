import { request, expect } from '@playwright/test'
import config from '../../playwright.config.js'

const contextPromise = request.newContext({ baseURL: config.use.baseURL })

const appCommands = async (data) => {
  const context = await contextPromise
  const response = await context.post('/__e2e__/command', { data })
  expect(response.ok()).toBeTruthy()
  return response.json()
}

const app = (name, options = {}) => appCommands({ name, options }).then(b => b[0])
const appEval = (code) => app('eval', code)

export { app, appEval }
