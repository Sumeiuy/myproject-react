/**
 * @file routes.js
 * @author maoquan(maoquan@htsc.com)
 */

import React from 'react';
import {
  Router,
  Route,
  IndexRedirect,
} from 'dva/router';

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

function switchRouter() {
  const fsp = document.querySelector('#workspace-content>.wrapper');
  if (fsp) {
    fsp.scrollTop = 0;
  } else {
    window.scrollTo(0, 0);
  }
}

const routes = ({ history }) => (// eslint-disable-line
  <Router onUpdate={switchRouter} history={history}>
    <Route path="/" component={Main}>
      <IndexRedirect to="/history" />
      <Route path="empty" component={Empty} />
      <Route path="report" component={ReportHome} />
      <Route path="preview" component={PreviewReport} />
      <Route path="history" component={HistoryHome} />
      <Route path="invest" component={ReportHome} />
      <Route path="business" component={BusinessHome} />
      <Route path="feedback" component={FeedBack} />
      <Route path="modal" component={TemplModal} />
      <Route path="boardManage" component={BoardManageHome} />
      <Route path="boardEdit" component={BoardEditHome} />
    </Route>
  </Router>
);

export default routes;
