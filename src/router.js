/**
* @file routes.js
* @author maoquan(maoquan@htsc.com)
*/

import React from 'react';
import {
  Router,
  Route,
  IndexRedirect,
  IndexRoute,
  Redirect,
} from 'dva-react-router-3/router';

import { fspContainer } from './config';

import Main from './layouts/Main';
import Empty from './routes/empty/Home';
import FeedBack from './routes/feedback/NewHome';
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
import FullChannelServiceRecord from './routes/fullChannelServiceRecord/Home';
import CustomerGroupManage from './routes/customerPool/CustomerGroupManage';
import ViewpointList from './routes/customerPool/ViewpointList';
import ViewpointDetail from './routes/customerPool/ViewpointDetail';
import ServiceLog from './routes/customerPool/ServiceLog';
import TaskFlow from './routes/customerPool/TaskFlow';
import ChannelsTypeProtocol from './routes/channelsTypeProtocol/Home';
import Approval from './routes/approval/Home';
import PermissonHome from './routes/permission/Home';
import PermissonEdit from './routes/permission/Edit';
import Contract from './routes/contract/Home';
import Form from './routes/contract/Form';
import ChannelsTypeProtocolEdit from './routes/channelsTypeProtocol/Edit';
import RelationHome from './routes/relation/Home';
import TaskList from './routes/customerPool/TaskList__';
import Demote from './routes/demote/Home';
import FilialeCustTransfer from './routes/filialeCustTransfer/Home';

function switchRouter() {
  const fsp = document.querySelector(fspContainer.container);
  if (!((this.state.location.state || {}).noScrollTop || false)) {
    if (fsp) {
      fsp.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }
}

const routes = ({ history }) => (// eslint-disable-line
  <Router onUpdate={switchRouter} history={history}>
    <Route path="/" component={Main}>
      <IndexRedirect to="/empty" />
      <Redirect from="invest" to="report" />
      <Route path="empty" component={Empty} />
      <Route path="report" component={ReportHome} />
      <Route path="preview" component={PreviewReport} />
      <Route path="history" component={HistoryHome} />
      <Route path="feedback" component={FeedBack} />
      <Route path="commission" component={CommissionHome} />
      <Route path="commissionChange" component={CommissionChangeHome} />
      <Route path="modal" component={TemplModal} />
      <Route path="boardManage" component={BoardManageHome} />
      <Route path="boardEdit" component={BoardEditHome} />
      <Route path="permission">
        <IndexRoute component={PermissonHome} />
        <Route path="edit" component={PermissonEdit} />
      </Route>
      <Route path="relation" component={RelationHome} />
      <Route path="contract">
        <IndexRoute component={Contract} />
        <Route path="form" component={Form} />
      </Route>
      <Route path="channelsTypeProtocol">
        <IndexRoute component={ChannelsTypeProtocol} />
        <Route path="edit" component={ChannelsTypeProtocolEdit} />
      </Route>
      <Route path="approval" component={Approval} />
      <Route path="customerPool">
        <IndexRoute component={CustomerPoolHome} />
        <Route path="viewpointDetail" component={ViewpointDetail} />
        <Route path="viewpointList" component={ViewpointList} />
        <Route path="todo" component={ToDo} />
        <Route path="list" component={CustomerList} />
        <Route path="customerGroup" component={CustomerGroup} />
        <Route path="createTask" component={CreateTask} />
        <Route path="customerGroupManage" component={CustomerGroupManage} />
        <Route path="serviceLog" component={ServiceLog} />
        <Route path="taskFlow" component={TaskFlow} />
        <Route path="tasklist" component={TaskList} />
      </Route>
      <Route path="fullChannelServiceRecord" component={FullChannelServiceRecord} />
      <Route path="demote" component={Demote} />
      <Route path="filialeCustTransfer" component={FilialeCustTransfer} />
    </Route>
  </Router>
);

export default routes;
