/**
 * @Author: hongguangqing
 * @Descripter: 公务手机管理
 * @Date: 2018-04-27 10:13:09
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-27 10:13:46
 */

import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';
import PropTypes from 'prop-types';
import menu from './menu';
import { linkTo } from '../../utils';
import Main from '../../components/platformParameterSetting/Main';
import { getRoutes } from '../../utils/router';

export default class TelephoneNumberManage extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    routerData: PropTypes.object.isRequired,
  };

  static contextTypes= {
    push: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const url = '/sysOperate/telephoneNumberManage/distribute';
    linkTo({
      url,
      routerAction: this.context.push,
      pathname: url,
    });
  }

  render() {
    const { match: { path }, routerData } = this.props;
    return (
      <Main menu={menu} matchPath={path}>
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
