/**
 * @file app.js
 * 项目入口文件
 * @author 朱飞阳
 */

import dva from 'dva';
// import { routerRedux } from 'dva/router';
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { message } from 'antd';

import CommonModal from '../src/components/common/biz/CommonModal';
import '../src/css/antd.less';

import createSensorsLogger from '../src/middlewares/sensorsLogger';
import createActivityIndicator from '../src/middlewares/createActivityIndicator';
import routerConfig from './router';
import { request as requestConfig, persist as persistConfig } from '../src/config';
// import { initFspMethod } from '../src/utils';
// import permission from '../src/permissions';
import { dva as dvaHelper, dom } from '../src/helper';

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
  // Modal.confirm({
  //   title: '请确认',
  //   content: msg,
  //   onOk() { callback(true); },
  //   onCancel() { callback(false); },
  // });
  callback(true);
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
app.model(require('./models/global'));
// 3. Model
app.model(require('../src/models/app'));
app.model(require('../src/models/feedback'));
app.model(require('../src/models/report'));
app.model(require('../src/models/manage'));
app.model(require('../src/models/edit'));
app.model(require('../src/models/preview'));
app.model(require('../src/models/history'));
app.model(require('../src/models/permission'));
app.model(require('../src/models/customerPool'));
// 合作合约
app.model(require('../src/models/contract'));
// 服务订购
app.model(require('../src/models/commission'));
app.model(require('../src/models/commissionChange'));
// 通道类型协议
app.model(require('../src/models/channelsTypeProtocol'));
app.model(require('../src/models/channelsEdit'));
app.model(require('../src/models/taskList/tasklist'));
app.model(require('../src/models/taskList/performerView'));
app.model(require('../src/models/taskList/managerView'));
// 零售非零售客户划转
app.model(require('../src/models/demote'));
// 分公司客户划转
app.model(require('../src/models/filialeCustTransfer'));
// 汇报关系树
app.model(require('../src/models/relation'));
// 客户反馈
app.model(require('../src/models/customerFeedback'));
// 任务反馈
app.model(require('../src/models/taskFeedback'));
// 主职位 model
app.model(require('../src/models/mainPosition'));
// 晨报
app.model(require('../src/models/morningBoradcast'));
// 售前适当性查询
app.model(require('../src/models/preSaleQuery'));
// 个股资讯
app.model(require('../src/models/stock'));
// 积分兑换历史查询
app.model(require('../src/models/pointsExchange'));
// 用户中心
app.model(require('../src/models/userCenter'));
// 电话申请和分配
app.model(require('../src/models/telephoneNumberManage'));
// 精选组合
app.model(require('../src/models/choicenessCombination'));
// 组合详情
app.model(require('../src/models/combinationDetail'));
// 投资建议模版
app.model(require('../src/models/investmentAdvice'));
// 用户标签
app.model(require('../src/models/operationCenter'));
// 营业部非投顾签约客户分配
app.model(require('../src/models/businessDepartmentCustDistribute'));
// 分公司客户分配
app.model(require('../src/models/custAllot'));
// 消息通知提醒
app.model(require('../src/models/messageCenter'));

// 4. Router
app.router(routerConfig);

// 5. Start
app.start('#exApp');

// start后_store才被初始化
const store = app._store; // eslint-disable-line

// 6. redux-persist
if (persistConfig.active) {
  persistStore(store, persistConfig);
}

dvaHelper.initApp(app, history);

// 7. 初始化权限配置
// permission.init(store);

// 8. 初始化fsp方法
// 所有需要暴露给fsp的数据方法都通过这个方法
// initFspMethod({ store, push: history.push });
