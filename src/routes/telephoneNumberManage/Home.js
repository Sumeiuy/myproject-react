/**
 * @Descripter: 平台参数设置
 * @Author: xiaZhiQiang
 * @Date: 2018/4/12
 */

import React, { PureComponent } from 'react';
import { Route, Switch, Redirect } from 'dva/router';
import PropTypes from 'prop-types';
import menu from './menu';
import Main from '../../components/platformParameterSetting/Main';
import DistributeHome from './DistributeHome';
import ApplyHome from './ApplyHome';

export default class TelephoneNumberManage extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };
  render() {
    const {
      match: {
        path,
      },
    } = this.props;
    return (
      <Main menu={menu} matchPath={path}>
        <Switch>
          <Route exact path="/telephoneNumberManage/distribute" component={DistributeHome} />
          <Route exact path="/telephoneNumberManage/apply" component={ApplyHome} />
          <Route path="*" render={() => (<Redirect to="/empty" />)} />
        </Switch>
      </Main>
    );
  }
}
