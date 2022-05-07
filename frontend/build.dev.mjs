import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import chokidar from 'chokidar'

import { spawnSync } from 'child_process'
import { sep, join } from 'path'
import {
  writeFileSync,
  unlinkSync,
  existsSync,
  readdirSync
} from 'fs'

const buildErrorFilePath = '../tmp/react_build_error.json'

const getAllErbSourceFiles = (dir = join(process.cwd(), 'src'), object = {}) => {
  readdirSync(dir, { withFileTypes: true }).forEach(element => {
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

async function build() {
  let result
  try {
    result = await esbuild.build({
      entryPoints: ['./build/index.js'],
      bundle: true,
      outfile: './../app/assets/builds/frontend.js',
      assetNames: '[name]',
      logLevel: 'info',
      loader: {
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.ttf': 'dataurl',
        '.js': 'jsx',
        '.js.erb': 'jsx',
        '.png': 'file',
        '.svg': 'file',
        '.jpg': 'file',
        '.jpeg': 'file'
      },
      plugins: [
        erbCompilationPlugin,
        sassPlugin()
      ],
      sourcemap: true,
      define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
        '__dirname': JSON.stringify(process.cwd()),
        'process.path.sep': JSON.stringify(sep)
      },
      inject: ['./react-shim.js'],
      incremental: true
    })
  } catch {}

  const watcher = chokidar.watch('./src', {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  })

  watcher.on('all', async(event, path) => {
    console.log(`[watch] build started (${event}: "${path}")`)
    try { await result.rebuild() } catch {}
    console.log('[watch] build finished')
  })

  // Call "dispose" when you're done to free up resources.
  // result.rebuild.dispose()
}

build()
