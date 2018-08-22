/**
 * @file app.js
 * @author maoquan(maoquan@htsc.com)
 */

import dva from 'dva';
// import { routerRedux } from 'dva/router';
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { message, Modal } from 'antd';

import CommonModal from './components/common/biz/CommonModal';
import './css/antd.less';

import createSensorsLogger from './middlewares/sensorsLogger';
import createActivityIndicator from './middlewares/createActivityIndicator';
import routerConfig from './router';
import { request as requestConfig, persist as persistConfig } from './config';
import { dva as dvaHelper, dom } from './helper';
import { logCommon } from './decorators/logable';
import { fspGlobal } from './utils';

// 尝试通过给body添加class来达到覆盖antd v3的样式
dom.addClass(document.body, 'ant-v2-compatible');

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
    const [errorMessage, messageType] = msg.split(ERROR_SEPARATOR);
    if (messageType === '0') {
      // 错误类型是0，用message.error
      message.error(errorMessage);
    } else if (messageType === '1') {
      // 错误类型是1，用dialog
      CommonModal.showErrorDialog(errorMessage);
    } else if (messageType === '2') {
      message.error(errorMessage);
      // 业务错误
      logCommon({
        type: 'bizError',
        payload: {
          name: '业务错误',
          value: errorMessage,
        },
      });
    }
  } else if (e.name === 'SyntaxError'
    && (msg.indexOf('<') > -1 || msg.indexOf('JSON') > -1)) {
    window.location.reload();
  } else if (stack && stack.indexOf('SyntaxError') > -1) {
    window.location.reload();
  } else {
    message.error(msg);
  }
};

// 离开某个页面，弹出确认框，配合页面中的Prompt使用
const getConfirmation = (msg, callback) => {
  Modal.confirm({
    title: '请确认',
    content: msg,
    onOk() {
      callback(true);
    },
    onCancel() {
      fspGlobal.handlePromptCancel();
      callback();
    },
  });
};

const history = createHistory({
  getUserConfirmation: getConfirmation,
});
// 1. Initialize
const app = dva({
  history,
  onAction: [createLogger(), createSensorsLogger()],
  extraEnhancers,
  onError,
});


// 2. Plugins
app.use(createLoading({ effects: true }));
app.use(createActivityIndicator());

// 3. Model
app.model(require('./models/app').default);
app.model(require('./models/customerPool').default);
app.model(require('./models/taskList/performerView').default);
app.model(require('./models/telephoneNumberManage').default);
app.model(require('./models/investmentAdvice').default);
// app.model(require('./models/morningBoradcast').default);

// 4. Route
app.router(routerConfig);

// 5. Start
app.start('#exApp');

dvaHelper.initApp(app, history);

// start后_store才被初始化
const store = app._store; // eslint-disable-line

// 6. redux-persist
if (persistConfig.active) {
  persistStore(store, persistConfig);
}


// window.navTo = (url) => {
//   const state = store.getState();
//   const tmpLocation = state.routing.locationBeforeTransitions;
//   if (tmpLocation
//     && tmpLocation.pathname === url
//     // && _.isEqual(tmpLocation.query, query)
//   ) {
//     return;
//   }
//   store.dispatch(routerRedux.push(url));
// };
