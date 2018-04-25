/*
 * @Description: 客户反馈 home 页面
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-25 10:44:35
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs } from 'antd';
import _ from 'lodash';

// import choosePage from '../../components/operationManage/choosePage';
import MissionBind from '../../components/operationManage/customerFeedback/MissionBind';
import OptionsMaintain from '../../components/operationManage/customerFeedback/OptionsMaintain';
import withRouter from '../../decorators/withRouter';
import { dva } from '../../helper';
import logable from '../../decorators/logable';
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
// Tab状态集合
const TabKeys = {
  // 任务帮顶可以反馈
  FIRST: '1',
  // 客户反馈选项维护
  SECOND: '2',
};
// 以前的fetchDataFunction提取到helper/dva里面成为公共方法使用
const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 任务列表
  missionData: state.customerFeedback.missionData,
  // 客户反馈列表
  feedbackData: state.customerFeedback.feedbackData,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 获取任务列表
  getMissionList: effect('customerFeedback/getMissionList'),
  // 删除任务下所关联客户反馈选项
  delCustomerFeedback: effect('customerFeedback/delCustomerFeedback', { loading: false }),
  // 添加任务下所关联客户反馈选项
  addCustomerFeedback: effect('customerFeedback/addCustomerFeedback', { loading: false }),
  // 查询客户反馈列表
  getFeedbackList: effect('customerFeedback/getFeedbackList'),
  // 清空任务列表数据
  emptyMissionData: effect('customerFeedback/emptyMissionData'),
  // 删除客户反馈选项
  delFeedback: effect('customerFeedback/delFeedback'),
  // 增加客户反馈选项
  addFeedback: effect('customerFeedback/addFeedback'),
  // 编辑客户反馈选项
  modifyFeedback: effect('customerFeedback/modifyFeedback'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerFeedback extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
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
    // 删除客户反馈选项
    delFeedback: PropTypes.func.isRequired,
    // 增加客户反馈选项
    addFeedback: PropTypes.func.isRequired,
    // 编辑客户反馈选项
    modifyFeedback: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: '2',
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
  queryMissionList(type = 1, pageNum = 1, pageSize = 20, keyWord = '') {
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
      keyWord,
    };
    getMissionList(params).then(() => {
      const { missionData } = this.props;
      const missionPage = missionData.page || {};
      replace({
        pathname,
        query: {
          ...query,
          pageNum: missionPage.pageNum,
          pageSize: missionPage.pageSize,
          keyWord,
        },
      });
    });
  }

  // 查询客户反馈列表
  @autobind
  queryFeedbackList(payload) {
    const { keyword = '', pageNum = 1, pageSize = 20, roleType = 0 } = payload;
    const { getFeedbackList } = this.props;
    const params = {
      keyword,
      pageNum,
      pageSize,
      roleType,
    };
    return getFeedbackList(params);
  }

  // 切换tab
  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：任务绑定客户反馈/客户反馈选项维护' } })
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

  // 任务绑定组件切换tab状态更新到url
  @autobind
  missionBindChangeTab(key) {
    const {
      emptyMissionData,
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
        childActiveKey: key,
        pageNum: 1,
        keyWord: '',
      },
    });
    emptyMissionData();
  }

  // 根据切换的TabKey，展示相关的内容组件
  @autobind
  getComponentByTabKey(tabKey) {
    let component = null;

    switch (tabKey) {
      case TabKeys.FIRST:
        component = this.getMissionBindFeedbackComponent();
        break;
      case TabKeys.SECOND:
        component = this.getCustFeedbackOptionsComponent();
        break;
      default:
        component = this.getMissionBindFeedbackComponent();
        break;
    }
    return component;
  }

  // 获取任务绑定客户反馈的内容组件
  @autobind
  getMissionBindFeedbackComponent() {
    const {
      getMissionList,
      missionData,
      feedbackData,
      delCustomerFeedback,
      addCustomerFeedback,
      replace,
      location,
      location: { query: { childActiveKey } },
     } = this.props;
    const missionBindProps = {
      getMissionList,
      missionData,
      feedbackData,
      delCustomerFeedback,
      addCustomerFeedback,
      childActiveKey,
      replace,
      location,
      queryMissionList: this.queryMissionList,
      queryFeedbackList: this.queryFeedbackList,
      missionBindChangeTab: this.missionBindChangeTab,
    };
    return (<MissionBind {...missionBindProps} />);
  }

  // 获取客户反馈可选项的内容组件
  @autobind
  getCustFeedbackOptionsComponent() {
    const {
      feedbackData,
      delFeedback,
      addFeedback,
      modifyFeedback,
      replace,
      location,
     } = this.props;
    const optionsMaintainProps = {
      queryFeedbackList: this.queryFeedbackList,
      feedbackData,
      delFeedback,
      addFeedback,
      modifyFeedback,
      location,
      replace,
    };

    return (<OptionsMaintain {...optionsMaintainProps} />);
  }

  render() {
    // let componentNode = null;
    // const {
    //   getMissionList,
    //   missionData,
    //   feedbackData,
    //   delCustomerFeedback,
    //   addCustomerFeedback,
    //   delFeedback,
    //   addFeedback,
    //   modifyFeedback,
    //   replace,
    //   location,
    //   location: {
    //     query: {
    //       parentActiveKey = TAB_LIST[0].key,
    //       childActiveKey,
    //     },
    //   },
    //  } = this.props;
    // const missionBindProps = {
    //   getMissionList,
    //   missionData,
    //   feedbackData,
    //   delCustomerFeedback,
    //   addCustomerFeedback,
    //   childActiveKey,
    //   replace,
    //   location,
    //   queryMissionList: this.queryMissionList,
    //   queryFeedbackList: this.queryFeedbackList,
    //   missionBindChangeTab: this.missionBindChangeTab,
    // };
    // const optionsMaintainProps = {
    //   queryFeedbackList: this.queryFeedbackList,
    //   feedbackData,
    //   delFeedback,
    //   addFeedback,
    //   modifyFeedback,
    //   location,
    //   replace,
    // };
    // const missionBindComponent = <MissionBind {...missionBindProps} />;
    // switch (parentActiveKey) {
    //   case TabKeys.FIRST:
    //     componentNode = missionBindComponent;
    //     break;
    //   case TabKeys.SECOND:
    //     componentNode =
    //     (<OptionsMaintain
    //       {...optionsMaintainProps}
    //     />);
    //     break;
    //   default:
    //     componentNode = missionBindComponent;
    //     break;
    // }
    const { location: { query: { parentActiveKey = TAB_LIST[0].key } } } = this.props;
    const tabContentComponent = this.getComponentByTabKey(parentActiveKey);

    return (
      <div className={styles.customerFeedbackWapper}>
        <div className={styles.tabBox}>
          <Tabs onChange={this.handleChangeTab} activeKey={parentActiveKey} type="card">
            { TAB_LIST.map(v => (<TabPane tab={v.tabName} key={v.key} />)) }
          </Tabs>
        </div>
        <div className={styles.componentBox}> {tabContentComponent} </div>
      </div>
    );
  }
}
