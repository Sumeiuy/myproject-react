import { createElement } from 'react';
import dynamic from 'dva/dynamic';

import CustomerPool from '../routes/customerPool/Home';
import TaskList from '../routes/taskList/connectedHome';
import TaskFlow from '../routes/customerPool/TaskFlow';
import CustomerList from '../routes/customerPool/CustomerList';
import ReportHome from '../routes/reports/Home';
import CreateTask from '../routes/customerPool/CreateTask';
import CustomerGroupManage from '../routes/customerPool/CustomerGroupManage';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        // eslint-disable-next-line
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`),
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        // eslint-disable-next-line
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

export const getRouterData = (app) => {
  const routerConfig = {
    '/empty': {
      component: dynamicWrapper(app, [], () => import('../routes/empty/Home')),
    },
    '/phone': {
      component: dynamicWrapper(app, [], () => import('../routes/phone/Home')),
    },
    // 直接进入
    '/report': {
      component: ReportHome,
    },
    // 直接进入，
    '/boardManage': {
      component: dynamicWrapper(app, [], () => import('../routes/boardManage/Home')),
    },
    // 从 boardManage 页面点击看板进入
    '/boardEdit': {
      component: dynamicWrapper(app, [], () => import('../routes/boardEdit/Home')),
    },
    // 在 boardEdit 页面右下角点击预览进入
    '/preview': {
      component: dynamicWrapper(app, ['report'], () => import('../routes/reports/PreviewReport')),
    },
    // 再 report 页面左上角下拉列表-自定义看板-选择一个点击进入
    '/history': {
      component: dynamicWrapper(app, ['history'], () => import('../routes/history/Home')),
    },
    // 直接进入
    '/feedback': {
      component: dynamicWrapper(app, ['feedback'], () => import('../routes/feedback/Home')),
    },
    // 直接进入
    '/commission': {
      component: dynamicWrapper(app, ['commission'], () => import('../routes/commission/Home')),
    },
    // ['佣金调整', '资讯订阅', '资讯退订']
    // const arr = ['SINGLE', 'SUBSCRIBE', 'UNSUBSCRIBE']
    // 从 commission 页面左侧列表中选择一条类型在 arr 中的数据，找到返回数据中的 flowCode 或 flowId
    // localhost:9088/#/commissionChange?flowId=xxxxxx&type=SINGLE
    // type 为对应的类型值
    '/commissionChange': {
      component: dynamicWrapper(app, ['commissionChange'], () => import('../routes/commissionChange/Home')),
    },
    // 直接进入没有数据，需要一个 custid，不知道是什么
    '/commissionAdjustment': {
      component: dynamicWrapper(app, [], () => import('../routes/commissionAdjustment/Home')),
    },
    // 可直接进入看页面，所需数据未知
    '/preSaleQuery': {
      component: dynamicWrapper(app, ['preSaleQuery'], () => import('../routes/preSaleQuery/Home')),
    },
    // 可直接进入，部分公用组件的展示路由
    '/modal': {
      component: dynamicWrapper(app, [], () => import('../routes/templeModal/Home')),
    },
    // 需要有权限的角色进入
    '/relation': {
      component: dynamicWrapper(app, ['relation'], () => import('../routes/relation/Home')),
    },
    // 直接进入，拼接 url 为 localhost:9088/?empId=002332&grayFlag=true#/tasklist 打开所有下拉选项
    '/taskList': {
      component: TaskList,
    },
    // 直接进入
    '/exchange': {
      component: dynamicWrapper(app, ['pointsExchange'], () => import('../routes/pointsExchange/Home')),
    },
    // 直接进入
    '/permission': {
      component: dynamicWrapper(app, ['permission'], () => import('../routes/permission/Home')),
    },
    // 从 permission 页面左侧列表中选择一条数据，找到请求回来的 flowId,
    // 拼接路由 /permission/edit?flowId=xxxxxxxx&empId=xxxx，
    // empId 需要设置为 edit 获取到的详情里的审批人
    // 由此进入为有数据页面
    '/permission/edit': {
      component: dynamicWrapper(app, ['permission'], () => import('../routes/permission/Edit')),
    },
    // 直接进入
    '/contract': {
      component: dynamicWrapper(app, ['contract'], () => import('../routes/contract/Home')),
    },
    // 从 contract 页面左侧列表中选择一条数据，找到请求回来的 flowId,
    // 拼接路由 /contract/form?flowId=xxxxxxxx&empId=xxxx,
    // empId 需要设置为 edit 获取到的详情里的审批人
    // 由此进入为有数据页面
    '/contract/form': {
      component: dynamicWrapper(app, ['contract'], () => import('../routes/contract/Form')),
    },
    // 直接进入
    '/channelsTypeProtocol': {
      component: dynamicWrapper(app, ['channelsTypeProtocol'], () => import('../routes/channelsTypeProtocol/Home')),
    },
    // 从 channelsTypeProtocol 页面左侧列表中选择一条数据，找到请求回来的 flowId,
    // 拼接路由 /channelsTypeProtocol/edit?flowId=xxxxxxxx&empId=xxxx,
    // empId 需要设置为 edit 获取到的详情里的审批人
    // 由此进入为有数据页面
    '/channelsTypeProtocol/edit': {
      component: dynamicWrapper(app, ['channelsTypeProtocol'], () => import('../routes/channelsTypeProtocol/Edit')),
    },

    // 直接进入
    '/customerPool': {
      component: CustomerPool,
    },
    // 从 customerPool 页面右下角资讯列表任意标题进入
    '/customerPool/viewpointDetail': {
      component: dynamicWrapper(app, ['customerPool'], () => import('../routes/customerPool/ViewpointDetail')),
    },
    // 从 customerPool 页面右下角资讯列表--更多进入
    '/customerPool/viewpointList': {
      component: dynamicWrapper(app, ['customerPool'], () => import('../routes/customerPool/ViewpointList')),
    },
    // 从 customerPool 搜索框下方--任务概览--第三个选项【代办流程】进入
    '/customerPool/todo': {
      component: dynamicWrapper(app, ['customerPool'], () => import('../routes/customerPool/ToDo')),
    },
    // 从 customerPool 页面中上部的搜索框输入搜索条件、或搜索框下方--猜你感兴趣进入
    '/customerPool/list': {
      component: CustomerList,
    },
    // customerPool/customerGroup 直接进入，所需数据未知
    '/customerPool/customerGroup': {
      component: dynamicWrapper(app, ['customerPool'], () => import('../routes/customerPool/CustomerGroup')),
    },
    // 分组管理发起任务
    // customerPool/createTaskFromCustGroup 直接进入，所需数据未知
    '/customerPool/createTaskFromCustGroup': {
      component: CreateTask,
    },
    // 管理者视图进度条发起任务
    '/customerPool/createTaskFromProgress': {
      component: CreateTask,
    },
    // 管理者视图饼图发起任务
    '/customerPool/createTaskFromPie': {
      component: CreateTask,
    },
    // 从代办流程进去，任务驳回修改
    '/customerPool/createTaskFromTaskRejection1': {
      component: CreateTask,
    },
    // 从任务管理，创建者视图驳回中的任务，进行任务驳回修改
    '/customerPool/createTaskFromTaskRejection2': {
      component: CreateTask,
    },
    // 客户列表发起任务
    '/customerPool/createTask': {
      component: CreateTask,
    },
    // 客户分组管理
    '/customerPool/customerGroupManage': {
      component: CustomerGroupManage,
    },
    '/customerPool/serviceLog': {
      component: dynamicWrapper(app, ['customerPool'], () => import('../routes/customerPool/ServiceLog')),
    },
    // 从 /taskList 页面，点击右上角新建进入
    '/customerPool/taskFlow': {
      component: TaskFlow,
    },

    // 从 FSP 消息提醒进入，亦可直接进入，需要数据需后台配置
    '/demote': {
      component: dynamicWrapper(app, ['demote'], () => import('../routes/demote/Home')),
    },
    // 从 FSP 消息提醒进入
    // 用户信息审核
    '/userInfoRemind': {
      component: dynamicWrapper(app, ['userCenter'], () => import('../routes/userCenter/userInfoApproval')),
    },
    // 消息通知提醒
    '/messgeCenter': {
      component: dynamicWrapper(app, ['messageCenter'], () => import('../routes/messageCenter/Home')),
    },
    // 直接进入
    '/filialeCustTransfer': {
      component: dynamicWrapper(app, ['filialeCustTransfer'], () => import('../routes/filialeCustTransfer/Home')),
    },
    // 从 filialeCustTransfer 页面左侧列表中选择一条数据，找到请求回来的 flowId,
    // 拼接路由 /filialeCustTransfer/edit?flowId=xxxxxxxx&empId=xxxx,
    // empId 需要设置为 edit 获取到的详情里的审批人
    // 由此进入为有数据页面
    '/filialeCustTransfer/edit': {
      component: dynamicWrapper(app, ['filialeCustTransfer'], () => import('../routes/filialeCustTransfer/Edit')),
    },
    // 从 fsp 消息提醒对应类型进入，本地可直接进入，如需要数据，需向后端要一个 appId 以及 type
    '/filialeCustTransfer/notifies': {
      component: dynamicWrapper(app, ['filialeCustTransfer'], () => import('../routes/filialeCustTransfer/Notifies')),
    },
    // 直接进入
    '/customerFeedback': {
      component: dynamicWrapper(app, ['customerFeedback'], () => import('../routes/customerFeedback/Home')),
    },
    // 直接进入
    '/taskFeedback': {
      component: dynamicWrapper(app, ['taskFeedback'], () => import('../routes/taskFeedback/Home')),
    },
    // 直接进入
    '/mainPosition': {
      component: dynamicWrapper(app, ['mainPosition'], () => import('../routes/mainPosition/Home')),
    },
    // 从 mainPosition 页面左侧列表中选择一条数据，找到请求回来的 flowId,
    // 拼接路由 /mainPosition/edit?flowId=xxxxxxxx&empId=xxxx,
    // empId 需要设置为 edit 获取到的详情里的审批人
    // 由此进入为有数据页面
    '/mainPosition/edit': {
      component: dynamicWrapper(app, ['mainPosition'], () => import('../routes/mainPosition/Edit')),
    },
    // 从 fsp 消息提醒对应类型进入，本地可直接进入，如需要数据，需向后端要一个 appId
    '/mainPosition/notifies': {
      component: dynamicWrapper(app, ['mainPosition'], () => import('../routes/mainPosition/Notifies')),
    },

    // 晨间播报
    // 直接进入，或从 customerPool 页面右侧-晨间播报-更多进入
    '/broadcastList': {
      component: dynamicWrapper(app, ['morningBoradcast'], () => import('../routes/morningBroadcast/BroadcastList')),
    },
    // 从 broadcastList 点击任意记录进入
    '/broadcastDetail': {
      component: dynamicWrapper(app, ['morningBoradcast'], () => import('../routes/morningBroadcast/BroadcastDetail')),
    },
    // 个股点评
    // 直接进入
    '/stock': {
      component: dynamicWrapper(app, ['stock'], () => import('../routes/stock/Home')),
    },
    // 在 stock 页面的列表中点击任意记录进入
    '/stock/detail': {
      component: dynamicWrapper(app, ['stock'], () => import('../routes/stock/Detail')),
    },
    // 直接进入
    // 用户中心
    '/userCenter': {
      component: dynamicWrapper(app, ['userCenter'], () => import('../routes/userCenter/UserBasicInfo')),
    },
    // userCenter/userInfoApproval 直接进入，需要参数未知
    '/userCenter/userInfoApproval': {
      component: dynamicWrapper(app, ['userCenter'], () => import('../routes/userCenter/userInfoApproval')),
    },
    // 平台参数设置
    '/platformParameterSetting': {
      component: dynamicWrapper(app, [], () => import('../routes/platformParameterSetting/Home')),
      exact: false,
    },
    // 公务手机和电话卡号管理
    '/telephoneNumberManage': {
      component: dynamicWrapper(app, ['telephoneNumberManage'], () => import('../routes/telephoneNumberManage/Home')),
      exact: false,
    },
    // 公务手机和电话卡号管理修改页面
    '/telephoneNumberManageEdit': {
      component: dynamicWrapper(app, ['telephoneNumberManage'], () => import('../routes/telephoneNumberManage/ApplyEdit')),
      exact: false,
    },
    // 精选组合，直接进入
    '/choicenessCombination': {
      component: dynamicWrapper(app, ['choicenessCombination'], () => import('../routes/choicenessCombination/Home')),
    },
    // 组合详情 /choicenessCombination/combinationDetail?id=xxx  id为组合id
    '/choicenessCombination/combinationDetail': {
      component: dynamicWrapper(app, ['choicenessCombination'], () => import('../routes/choicenessCombination/CombinationDetail')),
    },
    // 历史报告详情 /choicenessCombination/reportDetail?id=xxx&combinationCode=xxx
    // id为报告 id，combinationCode 为组合 id
    '/choicenessCombination/reportDetail': {
      component: dynamicWrapper(app, ['choicenessCombination'], () => import('../routes/choicenessCombination/ReportDetail')),
    },
    // 营业部非投顾签约客户分配页面
    '/businessDepartmentCustDistribute': {
      component: dynamicWrapper(app, ['businessDepartmentCustDistribute'], () => import('../routes/businessDepartmentCustDistribute/ConnectedHome')),
    },
    // 投顾业务能力竞赛
    '/investmentConsultantRace': {
      component: dynamicWrapper(app, [], () => import('../routes/investmentConsultantRace/Home')),
    },
    // 直接进入
    '/custAllot': {
      component: dynamicWrapper(app, ['custAllot'], () => import('../routes/custAllot/Home')),
    },
    // 从 fsp 消息提醒对应类型进入，本地可直接进入，如需要数据，需向后端要一个 appId 以及 type
    '/custAllot/notifies': {
      component: dynamicWrapper(app, ['custAllot'], () => import('../routes/custAllot/Notifies')),
    }
  };
  return routerConfig;
};

// 采取分布式配置的路由路径
export const distributeRouters = [
  // 路径：例如 '/abc'
];

export default {};
