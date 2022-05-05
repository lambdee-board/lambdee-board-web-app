import esbuild from 'esbuild';
import { spawnSync } from 'child_process'
import chokidar from 'chokidar'
import { writeFileSync, unlinkSync, existsSync } from 'fs'

const buildErrorFilePath = '../tmp/react_build_error.json'

const erbCompilationPlugin = {
  name: 'erb-compilation',
  setup(build) {
    build.onStart(() => {
      spawnSync('rails', ['runner', 'bin/.build/preprocess_react.rb'], { stdio: 'inherit', env: { ...process.env, BUILD: true } })
    })
    build.onEnd((result) => {
      if(result.errors === undefined || result.errors.length === 0) {
        console.log('📦 React built!\n')
        if(existsSync(buildErrorFilePath)) unlinkSync(buildErrorFilePath)
        return
      }

      console.log('💣 React build failed!\n')
      writeFileSync(buildErrorFilePath, JSON.stringify(result))
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
      plugins: [erbCompilationPlugin],
      define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
      inject: ['./react-shim.js'],
      incremental: true
    })
  } catch {}

  let watcher = chokidar.watch('./src', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  })

  watcher.on('all', async (event, path) => {
    console.log(`[watch] build started (${event}: "${path}")`)
    try { await result.rebuild() } catch {}
    console.log('[watch] build finished')
  })

  // Call "dispose" when you're done to free up resources.
  // result.rebuild.dispose()
}

build()
