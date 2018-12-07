// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var devEnv = require('./dev.env');
// 后端服务器地址前缀，在`config.dev.mock`为`false`的情况下，
// 以此前缀开头的请求全部转发至指定服务器`targetUrl`
var prefix = devEnv.REMOVE_PREFIX === true ? '/mcrm/api' : '/fspa/mcrm/api';

// UAT环境的开发转发环境地址
var UAT_FORWARD_URL = 'http://168.61.8.82:5086';
// SIT环境的开发转发华宁地址
var SIT_FORWARD_URL = 'http://168.61.8.81:5087';
// DOClever的接口mock地址
var MOCK_FORWARD_URL = 'http://168.61.8.81:5090';
// 新版客户360详情下客户画像的访问地址
var CUST_PROFIT_DEV_URL = 'http://168.61.125.20:8080';


function generateProxy(proxyList) {
  var result = {};
  var len = proxyList.length;
  for (var i = 0; i < len; i = i + 2) {
    result[proxyList[i]] = proxyList[i + 1];
  }
  return result;
}

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
    port: 9088,
    page: '',
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: generateProxy([
      '/finereport/ReportServer', // 报表中心
      { target: UAT_FORWARD_URL },
      '/fspa/phone',
      { target: UAT_FORWARD_URL },
      prefix + '/groovynoauth/fsp/cust/custdetail/queryAccountSummaryInfo',
      { target: MOCK_FORWARD_URL },
      prefix + '/groovynoauth/fsp/cust/custdetail/queryCustTradeInfo',
      { target: MOCK_FORWARD_URL },
      prefix,
      { target: UAT_FORWARD_URL },
      '/fspa/log',
      {
        target: UAT_FORWARD_URL,
      },
      '/fsp/',
      {
        target: UAT_FORWARD_URL,
      },
      '/htsc-product-base',
      { target: UAT_FORWARD_URL },
      '/jeip',
      { target: UAT_FORWARD_URL },
      '/yt/',
      { target: CUST_PROFIT_DEV_URL },
    ]),
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
  appStatic: path.resolve(__dirname, '../static'),
  htComponents: [
    path.resolve(__dirname, '../node_modules/lego-react-filter/src'),
    path.resolve(__dirname, '../node_modules/lego-tree-filter/src'),
    path.resolve(__dirname, '../node_modules/lego-react-date/src'),
    path.resolve(__dirname, '../node_modules/lego-schedule/src'),
  ]
};
