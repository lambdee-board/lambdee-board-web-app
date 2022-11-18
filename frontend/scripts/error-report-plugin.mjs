import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {
  writeFileSync,
  unlinkSync,
  existsSync,
} from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const buildErrorFilePath = `${__dirname}/../../tmp/react_build_error.json`

const errorReportPlugin = {
  name: 'error-report',
  setup(build) {
    build.onStart((result) => {
      if (existsSync(buildErrorFilePath)) unlinkSync(buildErrorFilePath)
    })
    build.onEnd((result) => {
      if (result.errors === undefined || result.errors.length === 0) {
        console.log('📦 React built!\n')
        if (existsSync(buildErrorFilePath)) unlinkSync(buildErrorFilePath)
        return
      }

      console.log('💣 React build failed!\n')
      writeFileSync(buildErrorFilePath, JSON.stringify(result))
    })
  },
}

export default errorReportPlugin
