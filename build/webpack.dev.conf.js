var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var HappyPack = require('happypack')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var CircularDependencyPlugin = require('circular-dependency-plugin')
var theme = require('../src/theme')

if (config.dev.enableHMR) {
  // add hot-reload related code to entry chunks
  Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
  })
}

var cssLoaders = utils.getCSSLoaders({
  disableCSSModules: !config.cssModules,
  sourceMap: config.dev.cssSourceMap
});

var lessConfig = utils.getLessConfig();

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'happypack/loader?id=jsx',
        include: [config.src].concat(config.htComponents)
      },
      {
        test: /\.css$/,
        include: config.src,
        use: ['style-loader'].concat(cssLoaders.own)
      },
      {
        test: /\.less$/,
        include: config.src,
        use: ['style-loader'].concat(cssLoaders.own).concat({
          loader: 'less-loader',
          options: lessConfig
        })
      },
      {
        test: /\.css$/,
        include: config.appNodeModules,
        use: ['style-loader'].concat(cssLoaders.nodeModules)
      },
      {
        test: /\.less$/,
        include: config.appNodeModules,
        use: ['style-loader'].concat(cssLoaders.nodeModules).concat({
          loader: 'less-loader',
          options: lessConfig
        })
      }
    ]
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  stats: 'minimal',
  plugins: [
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: false,
      template: 'index.html',
      chunks: ['index'],
      lang: 'en',
      title: '华泰证券理财平台',
      meta: [
        {
          name: 'charset',
          content: 'utf-8'
        }
      ]
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'newIndex.html',
      template: 'newIndex.html',
      chunks: ['newIndex'],
      inject: false
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../dist/vendor-manifest.json'),
    }),
    new HappyPack({
      id: 'jsx',
      threads: 4,
      loaders: [{
        loader: 'babel-loader',
        options: {
          presets: [
            [
              "@babel/preset-env", {
                "targets": {
                  "browsers": ["ie >= 10", "chrome >= 45"]
                },
                "modules": false
              }],
            "@babel/preset-react"
          ],
          plugins: [
            [
              "import", {
                "libraryName": "antd",
                "style": true
              }
            ],
            ["@babel/plugin-transform-runtime", { "corejs": 2 }],
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ["@babel/plugin-proposal-class-properties", { "loose": true }],
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-proposal-nullish-coalescing-operator",
            "@babel/plugin-proposal-optional-chaining"
          ],
          env: {
            "production": {},
            "development": {
              "plugins": [
                [
                  "dva-hmr", {
                    "container": ".react-app",
                    "quiet": false
                  },
                  "@babel/plugin-transform-react-jsx-source"
                ]
              ]
            }
          },
          comments: true
        }
      }],
    }),
    new FriendlyErrorsPlugin(),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      onStart({ compilation }) {
        console.log('start detecting webpack modules cycles');
      },
      onDetected({ module: webpackModuleRecord, paths, compilation }) {
        compilation.errors.push(new Error(paths.join(' -> ')))
      },
      onEnd({ compilation }) {
        console.log('end detecting webpack modules cycles');
      },
    })
  ]
})
