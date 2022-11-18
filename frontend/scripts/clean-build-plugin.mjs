import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { rmSync, mkdirSync, existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const buildsDir = join(__dirname, '..', '..', 'app', 'assets', 'builds')

const cleanBuildPlugin = {
  name: 'clean-build',
  setup(build) {
    build.onStart((result) => {
      console.log('🧹 Cleaning the build directory')
      if (existsSync(buildsDir)) {
        rmSync(buildsDir, { recursive: true })
        mkdirSync(buildsDir)
      }
    })
  },
}

export default cleanBuildPlugin
