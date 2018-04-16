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

import { getRouterData } from './common/router';
import Main from './layouts/Main';

const { ConnectedRouter } = routerRedux;

// 路由器
const Routers = ({ history, app }) => {
  const routerData = getRouterData(app);
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route
          path="/"
          render={() => <Main routerData={routerData} />}
        />
        <Redirect exact from="/" to="/empty" />
        <Redirect exact from="/invest" to="/report" />
        <Route render={() => (<Redirect to="/empty" />)} />
      </Switch>
    </ConnectedRouter>
  );
};

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};

export default Routers;
