import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'
import { join, dirname } from 'path'
import {
  writeFileSync,
  unlinkSync,
  existsSync,
  readdirSync
} from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const buildErrorFilePath = `${__dirname}/../../tmp/react_build_error.json`

const getAllErbSourceFiles = (dir = join(__dirname, '..', 'src'), object = {}) => {
  readdirSync(dir, { withFileTypes: true }).forEach((element) => {
    if (element.isDirectory()) {
      const childObject = {}
      object[element.name] = childObject
      getAllErbSourceFiles(join(dir, element.name), childObject)
      return
    }

    if (!element.name.endsWith('.erb')) return

    object[element.name.replace('.erb', '')] = true
  })

  return object
}

const erbCompilationPlugin = {
  name: 'erb-compilation',
  setup(buildProcess) {
    buildProcess.onStart(() => {
      spawnSync('rails', ['runner', 'bin/.build/preprocess_react.rb'], { stdio: 'inherit', env: { ...process.env, BUILD: true } })
    })
    buildProcess.onEnd((result) => {
      if (result.errors === undefined || result.errors.length === 0) {
        console.log('📦 React built!\n')
        if (existsSync(buildErrorFilePath)) unlinkSync(buildErrorFilePath)
        return
      }

      console.log('💣 React build failed!\n')
      writeFileSync(buildErrorFilePath, JSON.stringify(result))
    })
    buildProcess.onResolve({ filter: /erb-source-files$/ }, async() => {
      return { path: 'erb-source-files', namespace: 'erb-compilation' }
    })
    buildProcess.onLoad({ filter: /erb-source-files$/, namespace: 'erb-compilation' }, async(args) => {
      return {
        contents: JSON.stringify(getAllErbSourceFiles()),
        loader: 'json'
      }
    })
  },
}

export default erbCompilationPlugin
