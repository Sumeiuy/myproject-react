/**
* @file routes.js
* @author maoquan(maoquan@htsc.com)
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  routerRedux,
  Redirect,
} from 'dva/router';

import Main from './layouts/Main';
import Empty from './routes/empty/Home';
import FeedBack from './routes/feedback/Home';
import CommissionHome from './routes/commission/Home';
import CommissionChangeHome from './routes/commissionChange/Home';
import TemplModal from './routes/templeModal/Home';
import BoardManageHome from './routes/boardManage/Home';
import BoardEditHome from './routes/boardEdit/Home';
import ReportHome from './routes/reports/Home';
import PreviewReport from './routes/reports/PreviewReport';
import HistoryHome from './routes/history/Home';
import CustomerPoolHome from './routes/customerPool/Home';
import ToDo from './routes/customerPool/ToDo';
import CustomerList from './routes/customerPool/CustomerList';
import CustomerGroup from './routes/customerPool/CustomerGroup';
import CreateTask from './routes/customerPool/CreateTask';
import CustomerGroupManage from './routes/customerPool/CustomerGroupManage';
import ViewpointList from './routes/customerPool/ViewpointList';
import ViewpointDetail from './routes/customerPool/ViewpointDetail';
import ServiceLog from './routes/customerPool/ServiceLog';
import TaskFlow from './routes/customerPool/TaskFlow';
import ChannelsTypeProtocol from './routes/channelsTypeProtocol/Home';
import PermissonHome from './routes/permission/Home';
import PermissonEdit from './routes/permission/Edit';
import Contract from './routes/contract/Home';
import Form from './routes/contract/Form';
import ChannelsTypeProtocolEdit from './routes/channelsTypeProtocol/Edit';
import TaskListHome from './routes/taskList/Home';
import Demote from './routes/demote/Home';
import RelationHome from './routes/relation/Home';
import CustomerFeedback from './routes/customerFeedback/Home';
import TaskFeedback from './routes/taskFeedback/Home';
import MainPosition from './routes/mainPosition/Home';
import FilialeCustTransfer from './routes/filialeCustTransfer/Home';
import PreSaleQuery from './routes/preSaleQuery/Home';

const { ConnectedRouter } = routerRedux;

// 路由Collection
const routes = [
  { path: '/empty', component: Empty },
  { path: '/report', component: ReportHome },
  { path: '/boardManage', component: BoardManageHome },
  { path: '/boardEdit', component: BoardEditHome },
  { path: '/preview', component: PreviewReport },
  { path: '/history', component: HistoryHome },
  { path: '/feedback', component: FeedBack },
  { path: '/commission', component: CommissionHome },
  { path: '/commissionChange', component: CommissionChangeHome },
  { path: '/preSaleQuery', component: PreSaleQuery },
  { path: '/modal', component: TemplModal },
  { path: '/relation', component: RelationHome },
  { path: '/taskList', component: TaskListHome },
  {
    path: '/permission',
    component: PermissonHome,
    children: [
      { path: '/edit', component: PermissonEdit },
    ],
  },
  { path: '/contract',
    component: Contract,
    children: [
      { path: '/form', component: Form },
    ],
  },
  { path: '/channelsTypeProtocol',
    component: ChannelsTypeProtocol,
    children: [
      { path: '/edit', component: ChannelsTypeProtocolEdit },
    ],
  },
  { path: '/customerPool',
    component: CustomerPoolHome,
    children: [
      { path: '/viewpointDetail', component: ViewpointDetail },
      { path: '/viewpointList', component: ViewpointList },
      { path: '/todo', component: ToDo },
      { path: '/list', component: CustomerList },
      { path: '/customerGroup', component: CustomerGroup },
      { path: '/createTask', component: CreateTask },
      { path: '/customerGroupManage', component: CustomerGroupManage },
      { path: '/serviceLog', component: ServiceLog },
      { path: '/taskFlow', component: TaskFlow },
    ],
  },
  {
    path: '/demote',
    component: Demote,
  },
  {
    path: '/filialeCustTransfer',
    component: FilialeCustTransfer,
  },
  {
    path: '/customerFeedback',
    component: CustomerFeedback,
  },
  {
    path: '/taskFeedback',
    component: TaskFeedback,
  },
  {
    path: '/mainPosition',
    component: MainPosition,
  },
];

// 递归创建路由
function recursiveRouter(routeArray, parentPath = '') {
  return routeArray.map(({ path, component, children }) => {
    const recursivePath = parentPath + path;
    if (!children) {
      return (<Route exact key={recursivePath} path={recursivePath} component={component} />);
    }
    return (
      <Switch key={recursivePath}>
        <Route exact path={recursivePath} component={component} />
        {recursiveRouter(children, recursivePath)}
      </Switch>
    );
  });
}

// 路由器
const Routers = ({ history }) => (
  <ConnectedRouter history={history}>
    <Main>
      <Route exact path="/" render={() => (<Redirect to="/empty" />)} />
      <Route exact path="/invest" render={() => (<Redirect to="/report" />)} />
      {recursiveRouter(routes)}
      <Route path="*" render={() => (<Redirect to="/empty" />)} />
    </Main>
  </ConnectedRouter>
);

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};

export default Routers;
