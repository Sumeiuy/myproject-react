/*
 * @Description: 任务绑定客户反馈
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-01-02 13:53:14
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs, Modal, Collapse, Icon, Popover, Button, Pagination, message } from 'antd';
import _ from 'lodash';

import FeedbackAdd from './FeedbackAdd';

import styles from './missionBind.less';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const confirm = Modal.confirm;
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

export default class MissionBind extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 获取任务列表
    queryMissionList: PropTypes.func.isRequired,
    missionData: PropTypes.object.isRequired,
    // 删除任务下所关联客户反馈选项
    delCustomerFeedback: PropTypes.func.isRequired,
    // 添加任务下所关联客户反馈选项
    addCustomerFeedback: PropTypes.func.isRequired,
    // 查询客户反馈列表
    queryFeedbackList: PropTypes.func.isRequired,
    feedbackData: PropTypes.object.isRequired,
    // 清空任务列表数据
    emptyMissionData: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 是否显示弹层
      showModal: false,
      // 折叠面板打开的id
      collapseActiveKey: '',
      // 被添加客户反馈的任务id
      beAddMissionId: '',
    };
  }

  // 获取客户反馈气泡
  @autobind
  getFeedbackItem(list, missionId) {
    return list.map((item) => {
      const content = (<ul className={styles.popoverCentent}>
        {
          item.childList.map((childItem, childIndex) => (
            <li key={childItem.id}>{`${String.fromCharCode(65 + childIndex)}. ${childItem.name}`}</li>
          ))
        }
      </ul>);
      return (<div className={styles.feedbackItem} key={item.id}>
        <Popover placement="rightTop" content={content}>
          <span>{item.name}</span>
        </Popover>
        <Icon type="delete" onClick={() => this.handleDelCustomerFeedback(missionId, item.id)} />
      </div>);
    });
  }

  // 获取任务Panel
  @autobind
  getPanelList() {
    const { missionData } = this.props;
    const missionList = missionData.missionList || EMPTY_LIST;
    return missionList.map((item) => {
      const header = (<div className={styles.collapseHead}>
        <span className={styles.parentClass}>{item.parentClassName}</span>
        <span className={styles.childClass}>{item.childClassName}</span>
        <span className={styles.optionClass}>{`${item.length}项`}<Icon type="up" /><Icon type="down" /></span>
      </div>);
      return (<Panel header={header} key={item.id}>
        <div className={styles.feedbackListBox}>
          {
            this.getFeedbackItem(item.feedbackList, item.id)
          }
          <Button onClick={() => this.handleShowAddFeedbackModal(item.id)}>+新增</Button>
        </div>
      </Panel>);
    });
  }

  // 关闭弹窗
  @autobind
  handleCloseModal() {
    this.setState({
      showModal: false,
    });
  }

  // 切换折叠面板
  @autobind
  handleChangeCollapse(collapseActiveKey) {
    this.setState({
      collapseActiveKey,
    });
  }

  @autobind
  handlePageChange(pageNum) {
    const {
      queryMissionList,
      location: {
        query: { childActiveKey },
      },
    } = this.props;
    queryMissionList(childActiveKey, pageNum);
  }

  // 删除任务下所关联客户反馈选项
  @autobind
  handleDelCustomerFeedback(missionId, feedbackId) {
    const {
      delCustomerFeedback,
      queryMissionList,
      location: {
        query: {
          childActiveKey,
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    confirm({
      title: '提示',
      content: '确认要删除吗?',
      onOk() {
        delCustomerFeedback({
          missionId,
          feedbackId,
          type: childActiveKey,
        }).then(() => {
          // 删除成功之后更新任务列表
          queryMissionList(childActiveKey, pageNum, pageSize);
        });
      },
    });
  }

  // 显示添加客户反馈弹层
  @autobind
  handleShowAddFeedbackModal(missionId) {
    this.setState({
      showModal: true,
      beAddMissionId: missionId,
    });
  }

  // 添加客户反馈弹框点击确认
  @autobind
  handleAddFeedback() {
    const { beAddMissionId } = this.state;
    const {
      addCustomerFeedback,
      queryMissionList,
      location: {
        query: {
          childActiveKey,
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    if (this.feedbackAddComponent) {
      const feedback = this.feedbackAddComponent.getData();
      if (_.isEmpty(feedback)) {
        message.error('请选择需要添加的客户反馈');
        return;
      }
      addCustomerFeedback({
        missionId: beAddMissionId,
        feedbackId: feedback.id,
        type: childActiveKey,
      }).then(() => {
        this.handleCloseModal();
        // 添加成功之后更新任务列表
        queryMissionList(childActiveKey, pageNum, pageSize);
      });
    }
  }

  // 切换tab
  @autobind
  handleChangeTab(key) {
    const {
      replace,
      emptyMissionData,
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
      },
    });
    emptyMissionData();
  }

  render() {
    const {
      showModal,
      collapseActiveKey,
      beAddMissionId,
    } = this.state;
    const {
      missionData,
      queryFeedbackList,
      feedbackData,
      location: {
        query: {
          childActiveKey = TAB_LIST[0].key, // 默认显示第一个tab
        },
      },
    } = this.props;
    const missionPage = missionData.page || EMPTY_OBJECT;
    const page = {
      current: Number(missionPage.pageNum),
      pageSize: Number(missionPage.pageSize),
      total: Number(missionPage.totalCount),
      onChange: this.handlePageChange,
    };
    const modalProps = {
      title: '请选择恰当的客户反馈',
      visible: showModal,
      onOk: this.handleAddFeedback,
      onCancel: this.handleCloseModal,
      width: 650,
    };
    const collapseProps = {
      activeKey: collapseActiveKey,
      onChange: this.handleChangeCollapse,
      accordion: true,
    };
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
          <Tabs onChange={this.handleChangeTab} activeKey={childActiveKey} >
            {
              TAB_LIST.map(item => (
                <TabPane tab={item.tabName} key={item.key} />
              ))
            }
          </Tabs>
        </div>
        <div className={styles.collapseBox}>
          <div className={styles.titleBox}>
            <span className={styles.parentClass}>任务大类</span>
            <span className={styles.childClass}>任务子类/事件名称</span>
            <span className={styles.optionClass}>客户反馈选项</span>
          </div>
          <Collapse {...collapseProps}>
            {
              this.getPanelList()
            }
          </Collapse>
          <div className={styles.pageBox}>
            <Pagination {...page} />
          </div>
          <div className={styles.clear} />
        </div>
        {
          showModal ?
            <Modal {...modalProps}>
              <FeedbackAdd
                missionId={beAddMissionId}
                queryFeedbackList={queryFeedbackList}
                feedbackData={feedbackData}
                ref={ref => this.feedbackAddComponent = ref}
              />
            </Modal>
            :
            null
        }
      </div>
    );
  }
}
