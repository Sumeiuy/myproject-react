/* eslint-disable */
/*
 * @Description: 客户反馈 home 页面
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-25 14:08:40
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { message, Button, Modal, Tabs } from 'antd';
import _ from 'lodash';

import MissionBind from '../../components/operationManage/customerFeedback/MissionBind';
import OptionsMaintain from '../../components/operationManage/customerFeedback/OptionsMaintain';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { closeRctTabById } from '../../utils/fspGlobal';
import { env, emp } from '../../helper';

import styles from './home.less';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

// tab切换选项
const TAB_LIST = [
  {
    tabName: '任务绑定客户反馈',
    key: '1',
  },
  {
    tabName: '客户反馈选项维护',
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
@Barable
export default class CustomerFeedback extends PureComponent {
  static propTypes = {
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: '2',
    };
  }

  @autobind
  handleChangeTab(key) {
    this.setState({
      activeKey: key,
    });
  }

  render() {
    let componentNode = null;
    const {
      activeKey,
    } = this.state;
    switch (activeKey) {
      case '1':
        componentNode = <MissionBind />;
        break;
      case '2':
        componentNode = <OptionsMaintain />;
        break;
      default:
        componentNode = <OptionsMaintain />;
        break;
    }
    return (
      <div className={styles.customerFeedbackWapper}>
        <div className={styles.tabBox}>
          <Tabs onChange={this.handleChangeTab} activeKey={activeKey} type="card">
            {
              TAB_LIST.map(v => (
                <TabPane tab={v.tabName} key={v.key} />
              ))
            }
          </Tabs>
        </div>
        <div className={styles.componentBox}>
          {
            componentNode
          }
        </div>
      </div>
    );
  }
}
/* eslint-disable */