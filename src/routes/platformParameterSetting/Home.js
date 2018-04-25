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
import CustomerFeedback from '../../routes/customerFeedback/Home';
import LabelManager from '../../components/platformParameterSetting/routers/LabelManager';
import TaskFeedback from '../taskFeedback/Home';
import InvestmentAdvice from '../investmentAdvice/Home';

export default class PlatformParameterSetting extends PureComponent {
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
          <Route exact path="/platformParameterSetting/taskOperation/customerFeedback" component={CustomerFeedback} />
          <Route exact path="/platformParameterSetting/taskOperation/taskFeedback" component={TaskFeedback} />
          <Route exact path="/platformParameterSetting/taskOperation/investmentAdvice" component={InvestmentAdvice} />
          <Route exact path="/platformParameterSetting/labelManager" component={LabelManager} />
          <Route path="*" render={() => (<Redirect to="/empty" />)} />
        </Switch>
      </Main>
    );
  }
}
