const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/index.js',
    screenshotsFolder: 'tmp/cypress_screenshots',
    videosFolder: 'tmp/cypress_videos',
    trashAssetsBeforeRuns: false,
    video: false,
    responseTimeout: 10000,
    pageLoadTimeout: 15000,
  },
})
