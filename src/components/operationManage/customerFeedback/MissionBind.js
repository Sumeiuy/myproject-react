/* eslint-disable */
/*
 * @Description: 任务绑定客户反馈
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-22 09:03:08
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import _ from 'lodash';

import withRouter from '../../../decorators/withRouter';

import styles from './missionBind.less';

const TabPane = Tabs.TabPane;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

// tab切换选项
const TAB_LIST = [
  {
    tabName: 'MOT任务',
    key: '1',
  },
  {
    tabName: '自建任务',
    key: '2',
  },
];

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 客户列表
  custList: state.filialeCustTransfer.custList,
});

const mapDispatchToProps = {
  // 获取客户列表
  getCustList: fetchDataFunction(false, 'filialeCustTransfer/getCustList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class MissionBind extends PureComponent {
  static propTypes = {
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
    };
  }

  @autobind
  handleChangeTab(key) {
    this.setState({
      activeKey: key,
    });
  }

  render() {
    const {
      activeKey,
    } = this.state;
    return (
      <div className={styles.missionBindWapper}>
        <div className={styles.tipsBox}>
          <p>
          请基于任务子类型（或MOT事件）定义服务经理可以选择的客户反馈，每个类型可以定义多条可选反馈。
          <br />
          注意反馈修改会实时生效，并会影响到所有已关联的任务。
          </p>
        </div>
        <div className={styles.tabBox}>
          <Tabs onChange={this.handleChangeTab} activeKey={activeKey} >
            {
              TAB_LIST.map(v => (
                <TabPane tab={v.tabName} key={v.key} />
              ))
            }
          </Tabs>
        </div>
        <div className={styles.componentBox}>
          222
        </div>
      </div>
    );
  }
}
/* eslint-disable */