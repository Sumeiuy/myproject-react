/**
* @file fspSrc/routes.js
* 前端路由配置文件
* @author zhufeiyang
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  routerRedux,
  Redirect,
} from 'dva/router';
import { getRouterData, distributeRouters } from '../src/common/router';
import { getRoutes } from '../src/utils/router';

import App from './layouts/Main';
import FSPComponent from './routes/fspPage/FSPComponent';

const { ConnectedRouter } = routerRedux;

// 递归创建路由
function recursiveRouter(parentPath, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(parentPath) === 0 && routePath !== parentPath);
  // Replace path to '' eg. path='user' /user/name => /name
  routes = routes.map(item => item.replace(parentPath, ''));

  let childRouterArr = [];
  for (let j = 0, len = routes.length; j < len; j++) {
    const item = routes[j];
    if(parentPath === '/') {
      if (item.indexOf('/') !== -1 && childRouterArr.indexOf(item.split('/')[0]) === -1) {
        childRouterArr.push(item.split('/')[0]);
      }
    } else {
      if (item.lastIndexOf('/') > 0 && childRouterArr.indexOf(item.split('/')[1]) === -1) {
        childRouterArr.push('/' + item.split('/')[1]);
      }
    }
  }
  // 增加的二级路由存在，并且不在分布式配置路由名单中
  childRouterArr = childRouterArr.filter(item =>
    routes.indexOf(item) !== -1 && distributeRouters.indexOf(parentPath + item) === -1);

  let renderRoutes = [];
  if (childRouterArr.length !== 0) {
    childRouterArr.forEach((item) => {
      const path = parentPath + item;
      renderRoutes = renderRoutes.concat(recursiveRouter(path, routerData));
    });
  }

  renderRoutes = renderRoutes.concat(getRoutes(parentPath, routerData));
  return renderRoutes;
}

// 路由器
const Routers = ({ history, app }) => {
  const routerData = getRouterData(app);
  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Redirect exact from="/" to="/customerPool" />
          <Redirect exact from="/invest" to="/statisticalQuery/report" />
          <Redirect exact from="/invest" to="/statisticalQuery/report" />
          <Redirect exact from="/custAllot" to="/businessApplyment/customerPartition/custAllot" />
          <Redirect exact from="/departmentCustAllot" to="/businessApplyment/customerPartition/departmentCustAllot" />
          <Redirect exact from="/telephoneNumberManageEdit" to="/sysOperate/telephoneNumberManageEdit" />
          {
            recursiveRouter('/', routerData).map(
              item => (
                <Route
                  key={item.key}
                  path={item.path}
                  exact={item.exact}
                  render={props => <item.component {...props} />}
                />
              ),
            )
          }
          <Route path="/fsp/(.*)" component={FSPComponent} />
          <Route path="*" render={() => (<Redirect to="/empty" />)} />
        </Switch>
      </App>
    </ConnectedRouter>
  );
};

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};

export default Routers;
