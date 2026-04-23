import esbuild from 'esbuild'
import chokidar from 'chokidar'
import esbuildConfig from './esbuild-config.mjs'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function watch() {
  let ctx
  try {
    ctx = await esbuild.context({
      ...esbuildConfig,
    })
    await ctx.rebuild()
  // eslint-disable-next-line no-empty
  } catch {}

  const watcher = chokidar.watch(`${__dirname}/../src`, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  })

  watcher.on('all', async(event, path) => {
    console.log(`[watch] build started (${event}: "${path}")`)
    // eslint-disable-next-line no-empty
    try { await ctx.rebuild() } catch {}
    console.log('[watch] build finished')
  })

  // Call "dispose" when you're done to free up resources.
  // ctx.dispose()
}

if (process.env.ONE_TIME) {
  esbuild.build(esbuildConfig)
} else {
  watch()
}

