/**
 * @file app.js
 * @author maoquan(maoquan@htsc.com)
 */

import dva from 'dva';
import { hashHistory, routerRedux } from 'dva/router';

import createLoading from 'dva-loading';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { message } from 'antd';

import createSensorsLogger from './middlewares/sensorsLogger';
import createActivityIndicator from './middlewares/createActivityIndicator';
import routerConfig from './router';
import persistConfig from './config/persist';

const extraEnhancers = [];
if (persistConfig.active) {
  extraEnhancers.push(autoRehydrate());
}

// 错误处理
const onError = (e) => {
  const { message: msg } = e;
  // See src/utils/request.js
  if (msg === 'xxx') {
    message.error('登录超时，请重新登录！');
  } else {
    message.error(msg);
  }
};

// 1. Initialize
const app = dva({
  history: hashHistory,
  onAction: [createLogger(), createSensorsLogger()],
  extraEnhancers,
  onError,
});

const store = app._store; // eslint-disable-line

// 2. Plugins
app.use(createLoading({ effects: true }));
app.use(createActivityIndicator());

// 3. Model
app.model(require('./models/app'));
app.model(require('./models/example'));

// 4. Router
app.router(routerConfig);

// 5. Start
app.start('#app');

// 6. redux-persist
if (persistConfig.active) {
  persistStore(store, persistConfig);
}

window.navTo = (url) => {
  store.dispatch(routerRedux.push(url));
};
