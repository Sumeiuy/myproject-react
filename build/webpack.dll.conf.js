const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-dnd',
      'react-dnd-html5-backend',
      'redux-logger',
      'dnd-core',
      'dva-core',
      'redux-persist',
      'zrender',
      'react-split-pane',
      'redux-saga',
      '@babel/polyfill',
      'antd',
      'echarts',
      'moment',
      'lodash',
      'core-js',
      'immutable',
      'draft-js',
      'core-decorators',
      'localforage',
      'history',
      'element-resize-detector',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../dist', '[name]-manifest.json'),
      name: '[name]_library',
    }),
    new CleanWebpackPlugin(
      ['../dist/*.js(on)?'],
      {
        root: __dirname,
        verbose: true,
        dry: false,
      }
    ),
  ],
};
