/**
 * @file index.js
 *  使用分布式路由配置，在此文件中，配置子路径的详细路由。
 * @author maoquan(maoquan@htsc.com)
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'dva/router';
import { getRoutes } from '../../utils/router';
import CustomerPool from './Home';

export default class Home extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    routerData: PropTypes.object.isRequired,
  }

  render() {
    const {
      routerData,
      match,
    } = this.props;

    return (
      <Switch>
        <Route exact path={match.path} component={CustomerPool} />
        {
          getRoutes(match.path, routerData).map(item => (
            <Route
              key={item.key}
              path={item.path}
              component={item.component}
              exact={item.exact}
            />
          ))
        }
      </Switch>
    );
  }
}
