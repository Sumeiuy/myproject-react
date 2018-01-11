// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var devEnv = require('./dev.env');
var prefix = devEnv.REMOVE_PREFIX === true ? '/mcrm/api' : '/fspa/mcrm/api';
// 后端服务器地址前缀，在`config.dev.mock`为`false`的情况下，
// 以此前缀开头的请求全部转发至指定服务器`targetUrl`

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    fspIndex: path.resolve(__dirname, '../dist/newIndex.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/fspa/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  },
  dev: {
    env: require('./dev.env'),
    port: 9083,
    page: '',
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      [prefix + '/groovynoauth/fsp/emp']: {
        // target: 'http://168.61.8.81:5090', // DOClever
        target: 'http://168.61.8.81:5086', // SIT
      },
      [prefix + '/groovynoauth/fsp/assess/common']: {
        // target: 'http://160.9.230.9:8082/', // 张宝成 接口访问地址
        // target: 'http://168.61.8.81:5090', // DOClever 接口访问地址
        target: 'http://168.61.8.81:5086', // SIT
        secure: false,
      },
      [prefix + '/groovynoauth/fsp/biz']: {
        // target: 'http://168.61.8.81:5090', // DOClever 接口访问地址
        target: 'http://168.61.8.81:5086', // SIT
        // target: 'http://168.61.8.82:5086', // UAT
        secure: false,
      },
      [prefix]: {
        // target: 'http://168.61.8.81:5188', // SIT
        target: 'http://168.61.8.81:5086', // UAT
        secure: false,
      },
      '/fspa/log': {
        // target: 'http://160.9.230.9:8082/', // 张宝成 接口访问地址
        target: 'http://168.61.8.81:5086', // SIT
        // target: 'http://168.61.8.82:5086', // UAT
        secure: false,
      },
      '/fsp': {
        // target: 'http://168.61.8.81:5085', // SIT
        target: 'http://168.61.8.82:5086', // UAT
        secure: false,
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    mock: false, // 本地
    // 是否开启HMR
    enableHMR: true,
  },
  cssModules: true,
  src: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../fspSrc')],
  appSrc: path.resolve(__dirname, '../src'),
  fspSrc: path.resolve(__dirname, '../fspSrc'),
  appNodeModules: path.resolve(__dirname, '../node_modules'),
};
