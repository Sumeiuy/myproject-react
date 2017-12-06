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
} from 'dva/router';

// import { fspContainer } from './config';
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
import FullChannelServiceRecord from './routes/fullChannelServiceRecord/Home';
import CustomerGroupManage from './routes/customerPool/CustomerGroupManage';
import ViewpointList from './routes/customerPool/ViewpointList';
import ViewpointDetail from './routes/customerPool/ViewpointDetail';
import ServiceLog from './routes/customerPool/ServiceLog';
import TaskFlow from './routes/customerPool/TaskFlow';
import ChannelsTypeProtocol from './routes/channelsTypeProtocol/Home';
import Approval from './routes/approval/Home';
import PermissonHome from './routes/permission/Home';
import Contract from './routes/contract/Home';
import Form from './routes/contract/Form';
import ChannelsTypeProtocolEdit from './routes/channelsTypeProtocol/Edit';
import TaskListHome from './routes/taskList/Home';

const { ConnectedRouter } = routerRedux;

const Routers = ({ history }) => (
  <ConnectedRouter history={history}>
    <Main>
      <Route exact path="/empty" component={Empty} />
      <Route exact path="/invest" component={ReportHome} />
      <Route exact path="/report" component={ReportHome} />
      <Route exact path="/boardManage" component={BoardManageHome} />
      <Route exact path="/boardEdit" component={BoardEditHome} />
      <Route exact path="/preview" component={PreviewReport} />
      <Route exact path="/history" component={HistoryHome} />
      <Route exact path="/feedback" component={FeedBack} />
      <Route exact path="/commission" component={CommissionHome} />
      <Route exact path="/commissionChange" component={CommissionChangeHome} />
      <Route exact path="/modal" component={TemplModal} />
      <Route exact path="/permission" component={PermissonHome} />
      <Route exact path="/contract/form" component={Form} />
      <Route exact path="/contract" component={Contract} />
      <Route exact path="/approval" component={Approval} />
      <Switch key="/channelsTypeProtocol">
        <Route exact path="/channelsTypeProtocol" component={ChannelsTypeProtocol} />
        <Route exact path="/channelsTypeProtocol/edit" component={ChannelsTypeProtocolEdit} />
      </Switch>
      <Switch key="/customerPool">
        <Route exact path="/customerPool" component={CustomerPoolHome} />
        <Route exact path="/customerPool/viewpointDetail" component={ViewpointDetail} />
        <Route exact path="/customerPool/viewpointList" component={ViewpointList} />
        <Route exact path="/customerPool/todo" component={ToDo} />
        <Route exact path="/customerPool/list" component={CustomerList} />
        <Route exact path="/customerPool/customerGroup" component={CustomerGroup} />
        <Route exact path="/customerPool/createTask" component={CreateTask} />
        <Route exact path="/customerPool/customerGroupManage" component={CustomerGroupManage} />
        <Route exact path="/customerPool/serviceLog" component={ServiceLog} />
        <Route exact path="/customerPool/taskFlow" component={TaskFlow} />
      </Switch>
      <Route exact path="/fullChannelServiceRecord" component={FullChannelServiceRecord} />
      <Route exact path="/taskList" component={TaskListHome} />
      <Route path="*" component={Empty} />
    </Main>
  </ConnectedRouter>
);

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};

export default Routers;
