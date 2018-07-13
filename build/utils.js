var path = require('path')
var config = require('../config')
var theme = require('../src/theme')

const isDev = process.env.NODE_ENV !== 'production';

exports.assetsPath = function (_path) {
  var assetsSubDirectory = isDev
    ? config.dev.assetsSubDirectory
    : config.build.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path)
}

/** less配置 */
exports.getLessConfig = function () {
  return {
    modifyVars: theme,
    javascriptEnabled: true
  }
};

exports.getCSSLoaders = function (options) {
  let own = [];
  let nodeModules = [];

  options = options || {}

  let baseOptions = {
    minimize: !isDev,
    sourceMap: options.sourceMap,
    importLoaders: 1
  };

  let ownOptions = Object.assign({}, baseOptions);

  let cssModulesConfig = {
    modules: true,
    localIdentName: isDev
      ? '[name]__[local]___[hash:base64:5]'
      : '[local]___[hash:base64:5]'
  };

  if (!options.disableCSSModules) {
    ownOptions = Object.assign(
      ownOptions,
      cssModulesConfig
    );
  }

  let postcssOptions = {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      require('autoprefixer')({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 10',
        ],
        flexbox: 'no-2009'
      })
   ]
  };

  own.push({
    loader: 'css-loader',
    options: ownOptions
  });
  nodeModules.push({
    loader: 'css-loader',
    options: baseOptions
  });

  // own.push('resolve-url-loadr');
  own.push({
    loader: 'postcss-loader',
    options: postcssOptions
  });

  return {
    own,
    nodeModules,
  };
}
