import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import { prismjsPlugin } from 'esbuild-plugin-prismjs'

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
  sourcemap: true,
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
      languages: ['typescript', 'javascript', 'ruby', 'markup'],
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
  define: {
    'process.env.NODE_ENV': JSON.stringify('test'),
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
  ]
})
