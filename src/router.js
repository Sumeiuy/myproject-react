/**
* @file routes.js
* @author maoquan(maoquan@htsc.com)
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
  Redirect,
  routerRedux,
} from 'dva/router';

import dynamic from 'dva/dynamic';
// import { fspContainer } from './config';

import Main from './layouts/Main';

import Empty from './routes/empty/Home';

// import RejectionAndAmendment from './components/commissionAdjustment/RejectionAndAmendment';
// import TemplModal from './routes/templeModal/Home';
// import Approval from './routes/approval/Home';
// import Contract from './routes/contract/Home';
// import ChannelsTypeProtocol from './routes/channelsTypeProtocol/Home';

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
import ChannelsTypeProtocolEdit from './routes/channelsTypeProtocol/Edit';

const { ConnectedRouter } = routerRedux;

/* function switchRouter() {
  const fsp = document.querySelector(fspContainer.container);
  if (!((this.state.location.state || {}).noScrollTop || false)) {
    if (fsp) {
      fsp.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }
} */

export default function Routers({ history, app }) {
  const routes = [
    {
      path: '/empty',
      component: Empty,
    },
    {
      path: '/customerPool',
      component: CustomerPoolHome,
      children: [
        {
          path: '/viewpointDetail',
          component: ViewpointDetail,
        },
        {
          path: '/viewpointList',
          component: ViewpointList,
        },
        {
          path: '/todo',
          component: ToDo,
        },
        {
          path: '/list',
          component: CustomerList,
        },
        {
          path: '/customerGroup',
          component: CustomerGroup,
        },
        {
          path: '/createTask',
          component: CreateTask,
        },
        {
          path: '/customerGroupManage',
          component: CustomerGroupManage,
        },
        {
          path: '/serviceLog',
          component: ServiceLog,
        },
        {
          path: '/taskFlow',
          component: TaskFlow,
        },
      ],
    },
    {
      path: '/channelsTypeProtocol',
      component: ChannelsTypeProtocol,
      children: [
        {
          path: '/edit',
          component: ChannelsTypeProtocolEdit,
        },
      ],
    },
  ];
  const dynamicRoutes = [
    {
      path: '/feedback',
      models: () => [import('./models/feedback')],
      component: () => import('./routes/feedback/Home'),
    },
    {
      path: '/commission',
      models: () => [import('./models/commission')],
      component: () => import('./routes/commission/Home'),
    },
    {
      path: '/commissionChange',
      models: () => [import('./models/commissionChange')],
      component: () => import('./routes/commissionChange/Home'),
    },
    {
      path: '/modal',
      component: () => import('./routes/templeModal/Home'),
    },
    {
      path: '/permission',
      models: () => [import('./models/permission')],
      component: () => import('./routes/permission/Home'),
    },
    {
      path: '/report',
      models: () => [import('./models/report')],
      component: () => import('./routes/reports/Home'),
    },
    {
      path: '/preview',
      models: () => [import('./models/preview')],
      component: () => import('./routes/reports/PreviewReport'),
    },
    {
      path: '/history',
      models: () => [import('./models/history')],
      component: () => import('./routes/history/Home'),
    },
    {
      path: '/boardManage',
      models: () => [import('./models/manage')],
      component: () => import('./routes/boardManage/Home'),
    },
    {
      path: '/boardEdit',
      models: () => [import('./models/edit')],
      component: () => import('./routes/boardEdit/Home'),
    },
    {
      path: '/fullChannelServiceRecord',
      models: () => [import('./models/fullChannelServiceRecord')],
      component: () => import('./routes/fullChannelServiceRecord/Home'),
    },
    {
      path: '/contract',
      models: () => [import('./models/contract')],
      component: () => import('./routes/contract/Home'),
    },
    {
      path: '/approval',
      component: () => import('./routes/approval/Home'),
    },
  ];

  function recursiveRouter(routeArray, parentPath = '') {
    return routeArray.map(({ path, component, children }) => {
      if (!children) {
        return (
          <Route
            key={parentPath + path}
            exact
            path={parentPath + path}
            component={component}
          />
        );
      }
      const recursivePath = parentPath + path;
      return (
        <Switch key={parentPath + path}>
          <Route
            exact
            path={parentPath + path}
            component={component}
          />
          {
            recursiveRouter(children, recursivePath)
          }
        </Switch>
      );
    });
  }

  return (
    <ConnectedRouter history={history}>
      <Main>
        <Route exact path="/" render={() => (<Redirect to="/empty" />)} />
        <Route exact path="/invest" render={() => (<Redirect to="/report" />)} />
        {
          recursiveRouter(routes)
        }
        <Switch>
          {
            dynamicRoutes.map(({ path, ...dynamics }) => (
              <Route
                key={path}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
              ))
            }
        </Switch>
      </Main>
    </ConnectedRouter>
  );
}

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};
