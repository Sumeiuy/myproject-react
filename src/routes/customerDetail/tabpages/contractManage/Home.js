/**
 * @Description: 客户360-合约管理页面
 * @Author: Liujianshu-K0240007
 * @Date: 2018-11-20 14:41:29
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-21 10:07:57
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import { Tabs } from 'antd';

import { dva } from '../../../../helper';
import withRouter from '../../../../decorators/withRouter';
import logable, { logCommon } from '../../../../decorators/logable';
import {
  DEFAULT_ACTIVE_TAB,
  CONTRACT_MANAGE_TABS,
  PROTOCOL_COLUMNS,
  CONTRACT_COLUMNS,
  AGREEMENT_COLUMNS,
} from '../../../../components/customerDetailContractManage/config';
import styles from './home.less';

const dispatch = dva.generateEffect;

const TabPane = Tabs.TabPane;

const effects = {
  // 获取左侧列表
  getList: 'app/getNewSeibleList',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // 员工基本信息
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getList: dispatch(effects.getList, { forceFull: true }),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ContractManage extends PureComponent {
  static propTypes = {
    dict: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 默认激活的Tab，协议
      activeTabKey: DEFAULT_ACTIVE_TAB,
    };
  }

  // 切换Tab,并且记录日志，这样主要是由于切换Tab的onChange回调没有返回Tab的名称
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey }, this.queryApiForTab);
    logCommon({
      type: 'Click',
      payload: {
        name: CONTRACT_MANAGE_TABS[activeTabKey],
      },
    });
  }

  render() {
    const { activeTabKey } = this.state;
    return (
      <div className={styles.wrapper}>
        <Tabs type="card" onChange={this.handleTabChange} activeKey={activeTabKey}>
          <TabPane tab="协议" key="protocol">
            <div className={styles.tabPaneWrap}>
              123
            </div>
          </TabPane>
          <TabPane tab="合约" key="contract">
            <div className={styles.tabPaneWrap}>
              456
            </div>
          </TabPane>
          <TabPane tab="合同" key="agreement">
            <div className={styles.tabPaneWrap}>
              789
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
