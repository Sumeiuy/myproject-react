/**
 * @Descripter: 平台参数设置
 * @Author: xiaZhiQiang
 * @Date: 2018/4/12
 */

import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import menu from './menu';
import withRouter from '../../decorators/withRouter';
import Main from '../../components/platformParameterSetting/Main';
import { getRoutes } from '../../utils/router';

@withRouter
export default class PlatformParameterSetting extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    routerData: PropTypes.object.isRequired,
  };
  static contextTypes= {
    empInfo: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  componentDidMount() {
    // 根据路由权限过滤后平台参数设置菜单下首页面的跳转
    this.toPlatformHome();
  }

  @autobind
  hasPermissionMenu() {
    const { empInfo: { empRespList = [] } } = this.context;
    const permissionList = empRespList.map(item => item.respId);
    return _.filter(menu, (item) => {
      if (!item.permission) {
        return true;
      }
      return _.includes(permissionList, item.permission);
    });
  }

  toPlatformHome() {
    const { match: { path }, location: { pathname, query } } = this.props;
    const { replace } = this.context;
    let homePath = path;
    if (path !== pathname) {
      return;
    }
    const finalMenu = this.hasPermissionMenu();
    const getHomePath = (matchMenu) => {
      if (_.isArray(matchMenu) && matchMenu.length) {
        const firstMenuItem = matchMenu[0];
        const { path: pathItem, children } = firstMenuItem;
        homePath = `${homePath}${pathItem}`;
        getHomePath(children);
      }
    };
    getHomePath(finalMenu);
    replace({ pathname: homePath, query });
  }

  render() {
    const { match: { path }, routerData } = this.props;
    const finalMenu = this.hasPermissionMenu();

    return (
      <Main menu={finalMenu} matchPath={path}>
        <Switch>
          {
            getRoutes(path, routerData).map(item => (
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ))
          }
        </Switch>
      </Main>
    );
  }
}
