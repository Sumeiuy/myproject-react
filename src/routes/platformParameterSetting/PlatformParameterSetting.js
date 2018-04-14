/**
 * @Descripter: 平台参数设置
 * @Author: xiaZhiQiang
 * @Date: 2018/4/12
 */

import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';

import Main from '../../components/platformParameterSetting/Main';
import CustomerFeedback from '../../routes/customerFeedback/Home';
import LabelManager from '../../components/platformParameterSetting/routers/LabelManager';

export default class PlatformParameterSetting extends PureComponent {
  render() {
    return (
      <Main>
        <Switch>
          <Route exact path="/platformParameterSetting/customerFeedback" component={CustomerFeedback} />
          <Route exact path="/platformParameterSetting/userCenter" component={LabelManager} />
        </Switch>
      </Main>
    );
  }
}
