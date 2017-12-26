/* eslint-disable */
/*
 * @Description: 客户反馈 home 页面
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-26 11:02:19
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import { message, Button, Modal, Tabs } from 'antd';
import _ from 'lodash';

import MissionBind from '../../components/operationManage/customerFeedback/MissionBind';
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
  // 任务列表
  missionData: state.customerFeedback.missionData,
  // 客户反馈列表
  feedbackData: state.customerFeedback.feedbackData,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取任务列表
  getMissionList: fetchDataFunction(true, 'customerFeedback/getMissionList'),
  // 删除任务下所关联客户反馈选项
  delCustomerFeedback: fetchDataFunction(false, 'customerFeedback/delCustomerFeedback'),
  // 添加任务下所关联客户反馈选项
  addCustomerFeedback: fetchDataFunction(false, 'customerFeedback/addCustomerFeedback'),
  // 查询客户反馈列表
  getFeedbackList: fetchDataFunction(true, 'customerFeedback/getFeedbackList'),
  // 清空任务列表数据
  emptyMissionData: fetchDataFunction(true, 'customerFeedback/emptyMissionData'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class CustomerFeedback extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    // 获取任务列表
    getMissionList: PropTypes.func.isRequired,
    missionData: PropTypes.object.isRequired,
    // 删除任务下所关联客户反馈选项
    delCustomerFeedback: PropTypes.func.isRequired,
    // 添加任务下所关联客户反馈选项
    addCustomerFeedback: PropTypes.func.isRequired,
    // 查询客户反馈列表
    getFeedbackList: PropTypes.func.isRequired,
    feedbackData: PropTypes.object.isRequired,
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
    let componentNode = null;
    const {
      getMissionList,
      missionData,
      getFeedbackList,
      feedbackData,
      delCustomerFeedback,
      addCustomerFeedback,
      emptyMissionData,
      replace,
     } = this.props;
    const {
      activeKey,
    } = this.state;
    const missionBindProps = {
      getMissionList,
      missionData,
      getFeedbackList,
      feedbackData,
      delCustomerFeedback,
      addCustomerFeedback,
      emptyMissionData,
      replace,
    }
    const missionBindComponent = <MissionBind {...missionBindProps} />;
    switch (activeKey) {
      case '1':
        componentNode = missionBindComponent;
        break;
      case '2':
        componentNode = '222';
        break;
      default:
        componentNode = missionBindComponent;
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