var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
var MiniCssExtractPlugin = require("mini-css-extract-plugin")
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var theme = require('../src/theme')
var UglifyJsPlugin = require("uglifyjs-webpack-plugin")

var env = config.build.env

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var cssLoaders = utils.getCSSLoaders({
  disableCSSModules: !config.cssModules,
  sourceMap: config.build.productionSourceMap
});

var lessConfig = utils.getLessConfig();

var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include:
          [
            resolve('config/index.js'),
            config.src
          ].concat(config.htComponents),
        options: {
          presets: ["@babel/preset-react"],
          plugins: [
            [
              "import", {
                "libraryName": "antd",
                "style": true
              }
            ],
            ["@babel/plugin-proposal-class-properties", { "loose": true }],
            ["@babel/plugin-proposal-object-rest-spread"],
          ]
        }
      },
      {
        test: /\.css$/,
        include: config.src,
        use: [
          MiniCssExtractPlugin.loader,
        ].concat(cssLoaders.own)
      },
      {
        test: /\.less$/,
        include: config.src,
        use: [
          MiniCssExtractPlugin.loader,
        ].concat(cssLoaders.own).concat({
          loader: 'less-loader',
          options: lessConfig
        })
      },
      {
        test: /\.css$/,
        include: config.appNodeModules,
        use: [
          MiniCssExtractPlugin.loader,
        ].concat(cssLoaders.nodeModules)
      },
      {
        test: /\.less$/,
        include: config.appNodeModules,
        use: [
          MiniCssExtractPlugin.loader,
        ].concat(cssLoaders.nodeModules).concat({
          loader: 'less-loader',
          options: lessConfig
        })
      }
    ]
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  optimization: {
    namedModules: true,
    namedChunks: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      })
    ],
    splitChunks: {
      name: true,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: (module => module.resource && 
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0 ),
          chunks: 'all',
          enforce: true
        }
      }
    },
    runtimeChunk: 'single'
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html

    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      inject: false,
      template: 'index.html',
      // chunks: ['index', 'vendor', 'manifest'],
      chunks: ['index', 'vendor', 'runtime'],
      lang: 'en',
      title: '华泰证券理财平台',
      meta: [
        {
          name: 'charset',
          content: 'utf-8'
        }
      ],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
      filename: config.build.fspIndex,
      template: 'newIndex.html',
      inject: true,
      // chunks: ['newIndex', 'vendor', 'manifest'],
      chunks: ['newIndex', 'vendor', 'runtime'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*', 'font/iconfont/*']
      }
    ]),
    new ScriptExtHtmlWebpackPlugin({
      async: 'app',
      defaultAttribute: 'sync',
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
