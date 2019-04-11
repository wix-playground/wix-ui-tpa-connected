const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StylableWebpackPlugin = require('@stylable/webpack-plugin')

const exportedConfig = {
  entry: __dirname + '/generated/index.ts',
  target: 'node',
  mode: 'development',
  plugins: [
    new StylableWebpackPlugin({
      outputCSS: true,
      includeCSSInJS: false,
      optimize: {
        removeUnusedComponents: true,
        removeComments: true,
        removeStylableDirectives: true,
        classNameOptimizations: true,
        shortNamespaces: true,
        minify: true,
      },
    }),
  ],
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
    libraryTarget: 'umd',
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
