/*
 * @Description: 客户反馈 home 页面
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-28 16:34:08
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import { Tabs } from 'antd';
import _ from 'lodash';

import MissionBind from '../../components/operationManage/customerFeedback/MissionBind';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';

import styles from './home.less';

const TabPane = Tabs.TabPane;

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
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 获取任务列表
    getMissionList: PropTypes.func.isRequired,
    emptyMissionData: PropTypes.func.isRequired,
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
    };
  }

  componentDidMount() {
    // 第一次进入页面时将tab状态初始化到url中，避免subscriptions中重复请求
    const {
      replace,
      location: {
        pathname,
        query,
        query: {
          parentActiveKey,
          childActiveKey,
        },
      },
    } = this.props;
    if (_.isEmpty(parentActiveKey) || _.isEmpty(childActiveKey)) {
      replace({
        pathname,
        query: {
          ...query,
          parentActiveKey: parentActiveKey || '1',
          childActiveKey: childActiveKey || '1',
        },
      });
    }
  }

  // 查询任务列表
  @autobind
  queryMissionList(type = 1, pageNum = 1, pageSize = 20) {
    const {
      replace,
      getMissionList,
      location: {
        pathname,
        query,
      },
    } = this.props;
    const params = {
      type,
      pageNum,
      pageSize,
    };
    getMissionList(params).then(() => {
      const { missionData } = this.props;
      const missionPage = missionData.page;
      replace({
        pathname,
        query: {
          ...query,
          pageNum: missionPage.pageNum,
          pageSize: missionPage.pageSize,
        },
      });
    });
  }

  // 查询客户反馈列表
  @autobind
  queryFeedbackList(keyword = '', pageNum = 1, pageSize = 20) {
    const { getFeedbackList } = this.props;
    const params = {
      keyword,
      pageNum,
      pageSize,
    };
    return getFeedbackList(params);
  }

  // 切换tab
  @autobind
  handleChangeTab(key) {
    const {
      replace,
      location: {
        pathname,
        query,
      },
    } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        parentActiveKey: key,
        pageNum: 1,
      },
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
      location,
      location: {
        query: {
          parentActiveKey = TAB_LIST[0].key,
        },
      },
     } = this.props;
    const missionBindProps = {
      getMissionList,
      missionData,
      getFeedbackList,
      feedbackData,
      delCustomerFeedback,
      addCustomerFeedback,
      emptyMissionData,
      replace,
      location,
      queryMissionList: this.queryMissionList,
      queryFeedbackList: this.queryFeedbackList,
    };
    const missionBindComponent = <MissionBind {...missionBindProps} />;
    switch (parentActiveKey) {
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
          <Tabs onChange={this.handleChangeTab} activeKey={parentActiveKey} type="card">
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
