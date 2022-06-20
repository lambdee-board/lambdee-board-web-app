import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import { prismjsPlugin } from 'esbuild-plugin-prismjs'
import chokidar from 'chokidar'

import erbCompilationPlugin from './erbCompilationPlugin.mjs'

import { fileURLToPath } from 'url'
import { sep, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function build() {
  let result
  try {
    result = await esbuild.build({
      entryPoints: [`${__dirname}/../build/index.js`],
      bundle: true,
      outfile: `${__dirname}/../../app/assets/builds/frontend.js`,
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
        sassPlugin(),
        prismjsPlugin({
          inline: true,
          languages: ['typescript', 'javascript', 'ruby', 'markup', 'clike'],
          plugins: [
            'line-highlight',
            'line-numbers',
            'show-language',
            'copy-to-clipboard',
          ],
          theme: 'okaidia',
          css: true,
        }),
      ],
      sourcemap: true,
      define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.LAMBDEE_HOST': JSON.stringify(process.env.LAMBDEE_HOST || 'localhost:3000'),
        'process.env.LAMBDEE_PROTOCOL': JSON.stringify(process.env.LAMBDEE_PROTOCOL || 'http'),
        'process.env.SCRIPT_SERVICE_HOST': JSON.stringify(process.env.SCRIPT_SERVICE_HOST || 'localhost:3001'),
        'process.env.WS_PROTOCOL': JSON.stringify(process.env.WS_PROTOCOL || 'ws'),
        '__dirname': JSON.stringify(`${__dirname}/..`),
        'process.path.sep': JSON.stringify(sep)
      },
      inject: [
        `${__dirname}/../react-shim.js`,
        `${__dirname}/../polyfill.js`,
      ],
      incremental: true
    })
  } catch {}

  const watcher = chokidar.watch(`${__dirname}/../src`, {
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
