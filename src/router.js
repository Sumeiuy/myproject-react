/**
 * @file routes.js
 * @author maoquan(maoquan@htsc.com)
 */

import React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  IndexRedirect,
} from 'dva/router';

import Main from './layouts/Main';

import Empty from './routes/empty/Home';
import InvestHome from './routes/invest/Home';
import BusinessHome from './routes/business/Home';
import FeedBack from './routes/feedback/Home';
import TemplModal from './routes/templeModal/Home';
import BoardManageHome from './routes/boardManage/Home';
import BoardEditHome from './routes/boardEdit/Home';
import ReportHome from './routes/reports/Home';
import PreviewReport from './routes/reports/PreviewReport';

const routes = ({ history }) => (// eslint-disable-line
  <Router history={history}>
    <Route path="/" component={Main}>
      <IndexRedirect to="/empty" />
      <Route path="empty">
        <IndexRoute component={Empty} />
      </Route>
      <Route path="report">
        <IndexRoute component={ReportHome} />
      </Route>
      <Route path="preview">
        <IndexRoute component={PreviewReport} />
      </Route>
      <Route path="invest">
        <IndexRoute component={InvestHome} />
      </Route>
      <Route path="business">
        <IndexRoute component={BusinessHome} />
      </Route>
      <Route path="feedback">
        <IndexRoute component={FeedBack} />
      </Route>
      <Route path="modal">
        <IndexRoute component={TemplModal} />
      </Route>
      <Route path="boardManage">
        <IndexRoute component={BoardManageHome} />
      </Route>
      <Route path="boardEdit">
        <IndexRoute component={BoardEditHome} />
      </Route>
    </Route>
  </Router>
);

export default routes;
