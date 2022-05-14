import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

import erbCompilationPlugin from './erbCompilationPlugin.mjs'

import { fileURLToPath } from 'url'
import { sep, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

esbuild.build({
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
    sassPlugin()
  ],
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    '__dirname': JSON.stringify(`${__dirname}/..`),
    'process.path.sep': JSON.stringify(sep)
  },
  inject: [`${__dirname}/../react-shim.js`]
})
