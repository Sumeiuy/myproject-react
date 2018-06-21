/**
* @file fspSrc/routes.js
* 前端路由配置文件
* @author zhufeiyang
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  routerRedux,
  Redirect,
} from 'dva/router';

import App from './layouts/Main';
import FSPComponent from './routes/fspPage/FSPComponent';
import Empty from '../src/routes/empty/Home';
import FeedBack from '../src/routes/feedback/Home';
import MyFeedback from '../src/routes/feedback/MyFeedback';
import CommissionHome from '../src/routes/commission/Home';
import CommissionChangeHome from '../src/routes/commissionChange/Home';
import CommissionAdjustmentHome from '../src/routes/commissionAdjustment/Home';
import TemplModal from '../src/routes/templeModal/Home';
import BoardManageHome from '../src/routes/boardManage/Home';
import BoardEditHome from '../src/routes/boardEdit/Home';
import ReportHome from '../src/routes/reports/Home';
import PreviewReport from '../src/routes/reports/PreviewReport';
import HistoryHome from '../src/routes/history/Home';
import CustomerPoolHome from '../src/routes/customerPool/Home';
import ToDo from '../src/routes/customerPool/ToDo';
import CustomerList from '../src/routes/customerPool/CustomerList';
import CustomerGroup from '../src/routes/customerPool/CustomerGroup';
import CreateTask from '../src/routes/customerPool/CreateTask';
import CustomerGroupManage from '../src/routes/customerPool/CustomerGroupManage';
import ViewpointList from '../src/routes/customerPool/ViewpointList';
import ViewpointDetail from '../src/routes/customerPool/ViewpointDetail';
import ServiceLog from '../src/routes/customerPool/ServiceLog';
import TaskFlow from '../src/routes/customerPool/TaskFlow';
import ChannelsTypeProtocol from '../src/routes/channelsTypeProtocol/Home';
import PermissonHome from '../src/routes/permission/Home';
import PermissonEdit from '../src/routes/permission/Edit';
import Contract from '../src/routes/contract/Home';
import Form from '../src/routes/contract/Form';
import ChannelsTypeProtocolEdit from '../src/routes/channelsTypeProtocol/Edit';
import TaskListHome from '../src/routes/taskList/connectedHome';
import Demote from '../src/routes/demote/Home';
import RelationHome from '../src/routes/relation/Home';
import CustomerFeedback from '../src/routes/customerFeedback/Home';
import TaskFeedback from '../src/routes/taskFeedback/Home';
import MainPosition from '../src/routes/mainPosition/Home';
import MainPositionEdit from '../src/routes/mainPosition/Edit';
import MainPositionNotifies from '../src/routes/mainPosition/Notifies';
import FilialeCustTransfer from '../src/routes/filialeCustTransfer/Home';
import FilialeCustTransferEdit from '../src/routes/filialeCustTransfer/Edit';
import FilialeCustTransferNotifies from '../src/routes/filialeCustTransfer/Notifies';
// 晨间播报
import { BroadcastDetail, BroadcastList } from '../src/routes/morningBroadcast';
import PreSaleQuery from '../src/routes/preSaleQuery/Home';
// 个股
import Stock from '../src/routes/stock/Home';
import StockDetail from '../src/routes/stock/Detail';
import Exchange from '../src/routes/pointsExchange/Home';
import Phone from '../src/routes/phone/Home';
// 用户中心
import UserBasicInfo from '../src/routes/userCenter/UserBasicInfo';
// 平台参数设置
import PlatformParameterSetting from '../src/routes/platformParameterSetting/Home';
// 用户信息审核
import userInfoApproval from '../src/routes/userCenter/userInfoApproval';
// 公务手机和电话卡号管理
import TelephoneNumberManage from '../src/routes/telephoneNumberManage/Home';
// 公务手机和电话卡号管理修改页面
import TelephoneNumberManageEdit from '../src/routes/telephoneNumberManage/ApplyEdit';
// 精选组合
import ChoicenessCombination from '../src/routes/choicenessCombination/Home';
// 营业部非投顾签约客户分配页面
import BussinessDepartmentCustDistribute from '../src/routes/businessDepartmentCustDistribute/ConnectedHome';
import CombinationDetail from '../src/routes/choicenessCombination/CombinationDetail';
import ReportDetail from '../src/routes/choicenessCombination/ReportDetail';
// 投顾业务能力竞赛
import InvestmentConsultantRace from '../src/routes/investmentConsultantRace/Home';
// 客户划转
import CustAllot from '../src/routes/custAllot/Home';
import CustAllotNotifies from '../src/routes/custAllot/Notifies';
// 消息通知提醒
import MessageCenter from '../src/routes/messageCenter/Home';

const { ConnectedRouter } = routerRedux;

// 路由Collection
const routes = [
  // 不可匹配的路由会显示空白页
  { path: '/empty', component: Empty },
  { path: '/phone', component: Phone },
  // 直接进入
  { path: '/report', component: ReportHome },
  // 直接进入
  { path: '/boardManage', component: BoardManageHome },
  // 从 boardManage 页面点击看板进入
  { path: '/boardEdit', component: BoardEditHome },
  // 在 boardEdit 页面右下角点击预览进入
  { path: '/preview', component: PreviewReport },
  // 再 report 页面左上角下拉列表-自定义看板-选择一个点击进入
  { path: '/history', component: HistoryHome },
  // 直接进入
  { path: '/feedback', component: FeedBack },
  // 直接进入
  { path: '/myFeedback', component: MyFeedback },
  // 直接进入
  { path: '/commission', component: CommissionHome },
  // ['佣金调整', '资讯订阅', '资讯退订']
  // const arr = ['SINGLE', 'SUBSCRIBE', 'UNSUBSCRIBE']
  // 从 commission 页面左侧列表中选择一条类型在 arr 中的数据，找到返回数据中的 flowCode 或 flowId
  // localhost:9088/#/commissionChange?flowId=xxxxxx&type=SINGLE
  // type 为对应的类型值
  { path: '/commissionChange', component: CommissionChangeHome },
  // 直接进入没有数据，需要一个 custid，不知道是什么
  { path: '/commissionAdjustment', component: CommissionAdjustmentHome },
  // 可直接进入看页面，所需数据未知
  { path: '/preSaleQuery', component: PreSaleQuery },
  // 可直接进入，部分公用组件的展示路由
  { path: '/modal', component: TemplModal },
  // 需要有权限的角色进入
  { path: '/relation', component: RelationHome },
  // 直接进入，拼接 url 为 localhost:9088/?empId=002332&grayFlag=true#/tasklist 打开所有下拉选项
  { path: '/taskList', component: TaskListHome },
  // 直接进入
  { path: '/exchange', component: Exchange },
  // 直接进入
  {
    path: '/permission',
    component: PermissonHome,
    children: [
      // 从 permission 页面左侧列表中选择一条数据，找到请求回来的 flowId,
      // 拼接路由 /permission/edit?flowId=xxxxxxxx&empId=xxxx，
      // empId 需要设置为 edit 获取到的详情里的审批人
      // 由此进入为有数据页面
      { path: '/edit', component: PermissonEdit },
    ],
  },
  // 直接进入
  {
    path: '/contract',
    component: Contract,
    children: [
      // 从 contract 页面左侧列表中选择一条数据，找到请求回来的 flowId,
      // 拼接路由 /contract/form?flowId=xxxxxxxx&empId=xxxx,
      // empId 需要设置为 edit 获取到的详情里的审批人
      // 由此进入为有数据页面
      { path: '/form', component: Form },
    ],
  },
  // 直接进入
  {
    path: '/channelsTypeProtocol',
    component: ChannelsTypeProtocol,
    children: [
      // 从 channelsTypeProtocol 页面左侧列表中选择一条数据，找到请求回来的 flowId,
      // 拼接路由 /channelsTypeProtocol/edit?flowId=xxxxxxxx&empId=xxxx,
      // empId 需要设置为 edit 获取到的详情里的审批人
      // 由此进入为有数据页面
      { path: '/edit', component: ChannelsTypeProtocolEdit },
    ],
  },
  // 直接进入
  {
    path: '/customerPool',
    component: CustomerPoolHome,
    children: [
      // 从 customerPool 页面右下角资讯列表任意标题进入
      { path: '/viewpointDetail', component: ViewpointDetail },
      // 从 customerPool 页面右下角资讯列表--更多进入
      { path: '/viewpointList', component: ViewpointList },
      // 从 customerPool 搜索框下方--任务概览--第三个选项【代办流程】进入
      { path: '/todo', component: ToDo },
      // 从 customerPool 页面中上部的搜索框输入搜索条件、或搜索框下方--猜你感兴趣进入
      { path: '/list', component: CustomerList },
      // customerPool/customerGroup 直接进入，所需数据未知
      { path: '/customerGroup', component: CustomerGroup },
      // 分组管理发起任务
      // customerPool/createTaskFromCustGroup 直接进入，所需数据未知
      { path: '/createTaskFromCustGroup', component: CreateTask },
      // 管理者视图进度条发起任务
      { path: '/createTaskFromProgress', component: CreateTask },
      // 管理者视图饼图发起任务
      { path: '/createTaskFromPie', component: CreateTask },
      // 从代办流程进去，任务驳回修改
      { path: '/createTaskFromTaskRejection1', component: CreateTask },
      // 从任务管理，创建者视图驳回中的任务，进行任务驳回修改
      { path: '/createTaskFromTaskRejection2', component: CreateTask },
      // 从管理者视图服务经理维度发起任务
      { path: '/createTaskFromCustScope', component: CreateTask },
      // 客户列表发起任务
      { path: '/createTask', component: CreateTask },
      // 客户分组管理
      { path: '/customerGroupManage', component: CustomerGroupManage },
      { path: '/serviceLog', component: ServiceLog },
      // 从 /taskList 页面，点击右上角新建进入
      { path: '/taskFlow', component: TaskFlow },
    ],
  },
  // 从 FSP 消息提醒进入，亦可直接进入，需要数据需后台配置
  {
    path: '/demote',
    component: Demote,
  },
  // 从 FSP 消息提醒进入
  { path: '/userInfoRemind', component: userInfoApproval },

  // 消息提醒
  { path: '/messageCenter', component: MessageCenter },
  // 直接进入
  {
    path: '/filialeCustTransfer',
    component: FilialeCustTransfer,
    children: [
      // 从 filialeCustTransfer 页面左侧列表中选择一条数据，找到请求回来的 flowId,
      // 拼接路由 /filialeCustTransfer/edit?flowId=xxxxxxxx&empId=xxxx,
      // empId 需要设置为 edit 获取到的详情里的审批人
      // 由此进入为有数据页面
      { path: '/edit', component: FilialeCustTransferEdit },
      // 从 fsp 消息提醒对应类型进入，本地可直接进入，如需要数据，需向后端要一个 appId 以及 type
      { path: '/notifies', component: FilialeCustTransferNotifies },
    ],
  },
  // 直接进入
  {
    path: '/customerFeedback',
    component: CustomerFeedback,
  },
  // 直接进入
  {
    path: '/taskFeedback',
    component: TaskFeedback,
  },
  // 直接进入
  {
    path: '/mainPosition',
    component: MainPosition,
    children: [
      // 从 mainPosition 页面左侧列表中选择一条数据，找到请求回来的 flowId,
      // 拼接路由 /mainPosition/edit?flowId=xxxxxxxx&empId=xxxx,
      // empId 需要设置为 edit 获取到的详情里的审批人
      // 由此进入为有数据页面
      { path: '/edit', component: MainPositionEdit },
      // 从 fsp 消息提醒对应类型进入，本地可直接进入，如需要数据，需向后端要一个 appId
      { path: '/notifies', component: MainPositionNotifies },
    ],
  },
  // 晨间播报
  // 直接进入，或从 customerPool 页面右侧-晨间播报-更多进入
  {
    path: '/broadcastList',
    component: BroadcastList,
  },
  // 从 broadcastList 点击任意记录进入
  { path: '/broadcastDetail', component: BroadcastDetail },
  // 个股点评
  // 直接进入
  {
    path: '/stock',
    component: Stock,
    children: [
      // 在 stock 页面的列表中点击任意记录进入
      { path: '/detail', component: StockDetail },
    ],
  },
  // 直接进入
  {
    path: '/userCenter',
    component: UserBasicInfo,
    children: [
      // userCenter/userInfoApproval 直接进入，需要参数未知
      {
        path: '/userInfoApproval',
        component: userInfoApproval,
      },
    ],
  },
  {
    path: '/platformParameterSetting',
    component: PlatformParameterSetting,
    exact: false,
  },
  {
    path: '/telephoneNumberManage',
    component: TelephoneNumberManage,
    exact: false,
  },
  {
    path: '/telephoneNumberManageEdit',
    component: TelephoneNumberManageEdit,
    exact: false,
  },
  // 营业部非投顾签约客户分配申请页面，直接进入
  { path: '/businessDepartmentCustDistribute', component: BussinessDepartmentCustDistribute },
  // 精选组合，直接进入
  {
    path: '/choicenessCombination',
    component: ChoicenessCombination,
    children: [
      {
        // 组合详情 /choicenessCombination/combinationDetail?id=xxx  id为组合id
        path: '/combinationDetail',
        component: CombinationDetail,
      },
      {
        // 历史报告详情 /choicenessCombination/reportDetail?id=xxx&combinationCode=xxx
        // id为报告 id，combinationCode 为组合 id
        path: '/reportDetail',
        component: ReportDetail,
      },
    ],
  },
  // 投顾业务能力竞赛
  { path: '/investmentConsultantRace', component: InvestmentConsultantRace },
  // 直接进入
  {
    path: '/custAllot',
    component: CustAllot,
    children: [
      // 从 fsp 消息提醒对应类型进入，本地可直接进入，如需要数据，需向后端要一个 appId 以及 type
      { path: '/notifies', component: CustAllotNotifies },
    ],
  },
];

// 递归创建路由
function recursiveRouter(routeArray, parentPath = '') {
  return routeArray.map(({ path, component, children, exact = true }) => {
    const recursivePath = parentPath + path;
    if (!children) {
      return (
        <Route exact={exact} key={recursivePath} path={recursivePath} component={component} />
      );
    }
    return (
      <Switch key={recursivePath}>
        <Route exact={exact} path={recursivePath} component={component} />
        {recursiveRouter(children, recursivePath)}
      </Switch>
    );
  });
}

// 路由器
const Routers = ({ history }) => (
  <ConnectedRouter history={history}>
    <App>
      <div>
        <Route exact path="/" render={() => (<Redirect to="/customerPool" />)} />
        <Route exact path="/invest" render={() => (<Redirect to="/report" />)} />
        {recursiveRouter(routes)}
        <Route path="/fsp/(.*)" component={FSPComponent} />
        <Route path="*" render={() => (<Redirect to="/empty" />)} />
      </div>
    </App>
  </ConnectedRouter>
);

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};

export default Routers;
