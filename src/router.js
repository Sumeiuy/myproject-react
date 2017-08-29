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
} from 'dva/router';

import { fspContainer } from './config';

import Main from './layouts/Main';

import Empty from './routes/empty/Home';
import BusinessHome from './routes/business/Home';
import FeedBack from './routes/feedback/Home';
import TemplModal from './routes/templeModal/Home';
import BoardManageHome from './routes/boardManage/Home';
import BoardEditHome from './routes/boardEdit/Home';
import ReportHome from './routes/reports/Home';
import PreviewReport from './routes/reports/PreviewReport';
import HistoryHome from './routes/history/Home';
import CustomerPoolHome from './routes/customerPool/Home';
import ToDo from './routes/customerPool/ToDo';
import CustomerList from './routes/customerPool/CustomerList';
import addCusSuccess from './routes/customerPool/addCusSuccess';
import customerGroup from './routes/customerPool/customerGroup';
import CreateTask from './routes/customerPool/CreateTask';

function switchRouter() {
  const fsp = document.querySelector(fspContainer.container);
  if (fsp) {
    fsp.scrollTop = 0;
  } else {
    window.scrollTo(0, 0);
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
      <Route path="business" component={BusinessHome} />
      <Route path="feedback" component={FeedBack} />
      <Route path="modal" component={TemplModal} />
      <Route path="boardManage" component={BoardManageHome} />
      <Route path="boardEdit" component={BoardEditHome} />
      <Route path="customerPool">
        <IndexRoute component={CustomerPoolHome} />
        <Route path="todo" component={ToDo} />
        <Route path="list" component={CustomerList} />
        <Route path="customerGroup" component={customerGroup} />
        <Route path="addCusSuccess" component={addCusSuccess} />
        <Route path="createTask" component={CreateTask} />
      </Route>
    </Route>
  </Router>
);

export default routes;
