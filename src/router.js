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

const routes = ({ history }) => (// eslint-disable-line
  <Router history={history}>
    <Route path="/" component={Main}>
      <IndexRedirect to="/invest" />
      <Route path="empty">
        <IndexRoute component={Empty} />
      </Route>
      <Route path="invest">
        <IndexRoute component={InvestHome} />
      </Route>
      <Route path="business">
        <IndexRoute component={BusinessHome} />
      </Route>
    </Route>
  </Router>
);

export default routes;
