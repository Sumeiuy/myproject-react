/**
 * @file app.js
 * @author maoquan(maoquan@htsc.com)
 */

import 'babel-polyfill';
import dva from 'dva-react-router-3';
import { hashHistory, routerRedux } from 'dva-react-router-3/router';

import createLoading from 'dva-loading';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { message } from 'antd';

import createSensorsLogger from './middlewares/sensorsLogger';
import createActivityIndicator from './middlewares/createActivityIndicator';
import routerConfig from './router';
import { request as requestConfig, persist as persistConfig } from './config';
import { initFspMethod } from './utils/fspGlobal';

import permission from './permissions';

const extraEnhancers = [];
if (persistConfig.active) {
  extraEnhancers.push(autoRehydrate());
}

// 错误处理
const onError = (e) => {
  const { message: msg, stack } = e;
  const { ERROR_SEPARATOR } = requestConfig;
  // 如果存在分隔符，认为是业务错误
  // 否则根据情况判定为代码错误或者登录超时
  // 后端暂时没有登录超时概念
  // 都走门户的验证，门户返回的html，JSON parse报错即认为超时
  if (msg.indexOf(ERROR_SEPARATOR) > -1) {
    const errorMessage = msg.split(ERROR_SEPARATOR)[1];
    message.error(errorMessage);
  } else if (e.name === 'SyntaxError'
    && (msg.indexOf('<') > -1 || msg.indexOf('JSON') > -1)) {
    window.location.reload();
  } else if (stack && stack.indexOf('SyntaxError') > -1) {
    window.location.reload();
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


// 2. Plugins
app.use(createLoading({ effects: true }));
app.use(createActivityIndicator());

// 3. Model
app.model(require('./models/app'));
app.model(require('./models/feedback'));
app.model(require('./models/report'));
app.model(require('./models/manage'));
app.model(require('./models/edit'));
app.model(require('./models/preview'));
app.model(require('./models/history'));
app.model(require('./models/permission'));
app.model(require('./models/customerPool'));
app.model(require('./models/contract'));
app.model(require('./models/fullChannelServiceRecord'));
app.model(require('./models/commission'));
app.model(require('./models/commissionChange'));
app.model(require('./models/channelsTypeProtocol'));
app.model(require('./models/channelsEdit'));
app.model(require('./models/taskList/tasklist'));
app.model(require('./models/taskList/performerView'));
app.model(require('./models/relation'));
// 主职位 model
app.model(require('./models/mainPosition'));
// 降级客户
app.model(require('./models/demote'));
// 分公司客户划转
app.model(require('./models/filialeCustTransfer'));

// 4. Router
app.router(routerConfig);

// 5. Start
app.start('#exApp');

// start后_store才被初始化
const store = app._store; // eslint-disable-line

// 暴露给fsp方法
initFspMethod(store); // eslint-disable-line

// 6. redux-persist
if (persistConfig.active) {
  persistStore(store, persistConfig);
}

// 7. 初始化权限配置
permission.init(store);

window.navTo = (url) => {
  const state = store.getState();
  const tmpLocation = state.routing.locationBeforeTransitions;
  if (tmpLocation
    && tmpLocation.pathname === url
    // && _.isEqual(tmpLocation.query, query)
  ) {
    return;
  }
  store.dispatch(routerRedux.push(url));
};
