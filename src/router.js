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

import Test from './routes/example/Home';
import TestDetail from './routes/example/Detail';
import Page from './routes/example/Page';
import InvestHome from './routes/invest/Home';
import BusinessHome from './routes/business/Home';

const routes = ({ history }) => (// eslint-disable-line
  <Router history={history}>
    <Route path="/" component={Main}>
      <IndexRedirect to="/invest" />
      <Route path="example">
        <IndexRoute component={Test} />
        <Route path="detail/:id" component={TestDetail} />
      </Route>
      <Route path="invest">
        <IndexRoute component={InvestHome} />
      </Route>
      <Route path="business">
        <IndexRoute component={BusinessHome} />
      </Route>
      {/** 侧栏测试 */}
      <Route path="menu:id" component={Page}>
        <Route path="menu:id" component={Page} />
      </Route>
    </Route>
  </Router>
);

export default routes;
