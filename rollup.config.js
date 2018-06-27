/* eslint-disable import/no-extraneous-dependencies, node/no-unpublished-require */
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const uglify = require('rollup-plugin-uglify')
const visualizer = require('rollup-plugin-visualizer')
const sourcemaps = require('rollup-plugin-sourcemaps')
const builtins = require('rollup-plugin-node-builtins')

// eslint-disable-next-line no-console
console.log('Creating bundle...')

const plugins = [
  json(),
  resolve({
    jsnext: true,
    main: true,
    // NOTE setting browser to true makes sure only the browser relevant
    // entry point for libraries is used e.g. isomorphic-fetch
    browser: true,
    preferBuiltins: false
  }),
  commonjs(),
  babel({
    babelrc: false,
    presets: [['env', { modules: false }]],
    plugins: ['external-helpers']
  }),
  uglify(),
  visualizer(),
  sourcemaps(),
  builtins()
]

module.exports = {
  input: 'lib/index.js',
  output: {
    format: 'umd',
    file: 'dist/event-gateway-sdk.min.js',
    name: 'EventGateway',
    exports: 'default',
    sourcemap: true
  },
  plugins
}
