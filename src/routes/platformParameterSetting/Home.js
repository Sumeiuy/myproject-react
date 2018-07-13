/**
 * @Descripter: 平台参数设置
 * @Author: xiaZhiQiang
 * @Date: 2018/4/12
 */

import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';
import PropTypes from 'prop-types';
import _ from 'lodash';
import menu from './menu';
import Main from '../../components/platformParameterSetting/Main';
import { getRoutes } from '../../utils/router';

export default class PlatformParameterSetting extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    routerData: PropTypes.object.isRequired,
  };
  static contextTypes= {
    empInfo: PropTypes.object.isRequired,
  }
  render() {
    const { match: { path }, routerData } = this.props;
    const { empInfo: { empRespList = [] } } = this.context;
    const premissionList = empRespList.map(item => item.respId);
    const finalMenu = _.filter(menu, (item) => {
      if (!item.permission) {
        return true;
      }
      return _.includes(premissionList, item.permission);
    });
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
