/**
 * @Descripter: 平台参数设置
 * @Author: xiaZhiQiang
 * @Date: 2018/4/12
 */

import React, { PureComponent } from 'react';
import { Route, Switch, Redirect } from 'dva/router';
import PropTypes from 'prop-types';
import _ from 'lodash';
import menu from './menu';
import Main from '../../components/platformParameterSetting/Main';
import CustomerFeedback from '../../routes/customerFeedback/Home';
import TaskFeedback from '../taskFeedback/Home';
import InvestmentAdvice from '../investmentAdvice/Home';
import { LabelManager,
  CustomerLabel,
  RecommendedLabel,
} from '../../components/platformParameterSetting';

export default class PlatformParameterSetting extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };
  static contextTypes= {
    empInfo: PropTypes.object.isRequired,
  }
  render() {
    const { match: { path } } = this.props;
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
          <Route exact path="/platformParameterSetting/taskOperation/customerFeedback" component={CustomerFeedback} />
          <Route exact path="/platformParameterSetting/taskOperation/taskFeedback" component={TaskFeedback} />
          <Route exact path="/platformParameterSetting/taskOperation/investmentAdvice" component={InvestmentAdvice} />
          <Route exact path="/platformParameterSetting/labelManager" component={LabelManager} />
          <Route exact path="/platformParameterSetting/contentOperate" component={RecommendedLabel} />
          <Route exact path="/platformParameterSetting/customerLabel" component={CustomerLabel} />
          <Route path="*" render={() => (<Redirect to="/empty" />)} />
        </Switch>
      </Main>
    );
  }
}
