import esbuild from 'esbuild'
import esbuildConfig from './esbuild-config.mjs'

esbuild.build({
  ...esbuildConfig,
  sourcemap: false,
  minify: true,
  logLevel: 'info',
  target: ['es6'],
  define: {
    ...esbuildConfig.define,
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
