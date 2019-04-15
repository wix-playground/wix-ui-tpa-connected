const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StylableWebpackPlugin = require('@stylable/webpack-plugin')
const fs = require('fs')
const path = require('path')

const entryPath = path.resolve(__dirname, 'cache/styles')

const exportedConfig = {
  entry: fs
    .readdirSync(entryPath)
    .filter(fileName => fileName.match(/\.js$/))
    .reduce(
      (config, fileName) => ({...config, [fileName.replace(/\.js$/, '')]: path.resolve(entryPath, fileName)}),
      {},
    ),
  // target: 'node',
  mode: 'development',
  plugins: [
    new StylableWebpackPlugin({
      outputCSS: true,
      // filename: 'components',
      includeCSSInJS: false,
    }),
  ],
  // externals: [nodeExternals()],
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  output: {
    path: __dirname + '/built-styles',
    libraryTarget: 'umd',
    // library: 'component',
  },
  resolveLoader: {
    modules: [__dirname + '/node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: __dirname + '/tsconfig.json',
            },
          },
        ],
      },
    ],
  },
}

module.exports = exportedConfig
