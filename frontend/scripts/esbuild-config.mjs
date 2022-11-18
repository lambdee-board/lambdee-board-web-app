import { sassPlugin } from 'esbuild-sass-plugin'
import { prismjsPlugin } from 'esbuild-plugin-prismjs'

import { fileURLToPath } from 'url'
import { sep, dirname, join } from 'path'
import errorReportPlugin from './error-report-plugin.mjs'
import cleanBuildPlugin from './clean-build-plugin.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  entryPoints: [join(__dirname, '..', 'src', 'index.js')],
  bundle: true,
  assetNames: '[name]-[hash].digested',
  publicPath: '/assets',
  outfile: join(__dirname, '..', '..', 'app', 'assets', 'builds', 'frontend.js'),
  logLevel: 'info',
  loader: {
    '.woff': 'dataurl',
    '.woff2': 'dataurl',
    '.ttf': 'dataurl',
    '.js': 'jsx',
    '.png': 'file',
    '.svg': 'file',
    '.jpg': 'file',
    '.jpeg': 'file'
  },
  plugins: [
    cleanBuildPlugin,
    errorReportPlugin,
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
    'process.env.SCRIPT_SERVICE_EXTERNAL_HOST': JSON.stringify(process.env.SCRIPT_SERVICE_EXTERNAL_HOST || 'localhost:3001'),
    'process.env.SCRIPT_SERVICE_WS_PROTOCOL': JSON.stringify(process.env.SCRIPT_SERVICE_WS_PROTOCOL || 'ws'),
    '__dirname': JSON.stringify(`${__dirname}/..`),
    'process.path.sep': JSON.stringify(sep)
  },
  inject: [
    `${__dirname}/../react-shim.js`,
    `${__dirname}/../polyfill.js`,
  ],
}
