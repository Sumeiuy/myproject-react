/*
 * @Description: 任务绑定客户反馈
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-08 11:03:04
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs, Modal, Collapse, Icon, Popover, Button, message, Input } from 'antd';
import _ from 'lodash';

import FeedbackAdd from './FeedbackAdd';
import Pagination from '../../common/Pagination';
import styles from './missionBind.less';
import logable from '../../../decorators/logable';
import {
  TABLIST,
  MOT_TASK,
  SERVICE_MANAGER_ROLE,
  ZHANGLE_ROLE,
} from './config';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const confirm = Modal.confirm;
const Search = Input.Search;

export default class MissionBind extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
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
    // 切换tab
    missionBindChangeTab: PropTypes.func.isRequired,
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
      // 服务经理或客户可选项
      roleType: SERVICE_MANAGER_ROLE.key,
    };
  }

  // 获取客户反馈气泡
  @autobind
  getFeedbackItem(list = [], missionId, obj) {
    return list.map((item) => {
      const content = (<ul className={styles.popoverCentent}>
        {
          (item.childList || []).map((childItem, childIndex) => (
            <li key={childItem.id}>{`${String.fromCharCode(65 + childIndex)}. ${childItem.name}`}</li>
          ))
        }
      </ul>);
      return (
        <div className={styles.feedbackItem} key={item.id}>
          {
            obj.needPopover && item.childList && item.childList.length
            ?
              <Popover placement="bottomLeft" content={content} overlayClassName={styles.opcityPopover}>
                <span>{item.name}</span>
              </Popover>
            :
              <span>{item.name}</span>
          }
          <Icon
            type="close-circle"
            onClick={() => this.handleDelCustomerFeedback(missionId, item.id, obj.roleType)}
          />
        </div>);
    });
  }

  // 渲染涨乐客户反馈可选项
  @autobind
  getZLFeedbackItem(list = []) {
    // 数据中存在一个name,custFeedbackName字段，在渲染涨乐的时候需要使用custFeedbackName
    return list.map(item => (
      <div className={styles.zlfeedbackItem} key={`ZL-${item.id}`}>
        <span>{item.custFeedbackName ? item.custFeedbackName : ''}</span>
      </div>
    ));
  }

  // 获取任务Panel
  @autobind
  getPanelList() {
    const { missionData } = this.props;
    const { location: { query: { childActiveKey = MOT_TASK.key } } } = this.props;
    const missionList = missionData.missionList || [];
    const isMOTMission = childActiveKey === MOT_TASK.key;
    return missionList.map((item) => {
      const header = (<div className={styles.collapseHead}>
        <span
          className={isMOTMission ? styles.parentClass : styles.parentClassSelf}
        >
          {item.parentClassName}
        </span>
        {
          isMOTMission ?
            <span className={styles.missionId}>{item.id}</span> :
            null
        }
        <span className={styles.childClass} title={item.childClassName}>{item.childClassName}</span>
        <span className={styles.optionClass}>查看<Icon type="up" /><Icon type="down" /></span>
      </div>);
      return (<Panel header={header} key={item.id}>
        <div className={styles.feedbackListBox}>
          <h2>{SERVICE_MANAGER_ROLE.name}</h2>
          {
            this.getFeedbackItem(item.feedbackList, item.id, {
              needPopover: true,
              roleType: SERVICE_MANAGER_ROLE.key,
            })
          }
          <Button
            ghost
            icon="plus"
            type="primary"
            onClick={() => this.showAddFeedbackModal(item.id, SERVICE_MANAGER_ROLE.key)}
          >
            新增
          </Button>
        </div>
        <div className={styles.feedbackListBox}>
          <h2>{ZHANGLE_ROLE.name}</h2>
          {
            this.getZLFeedbackItem(item.feedbackList, item.id, {
              needPopover: false,
              roleType: ZHANGLE_ROLE.key,
            })
          }
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
  @logable({ type: 'Click', payload: { name: '切换折叠面板' } })
  handleChangeCollapse(collapseActiveKey) {
    this.setState({
      collapseActiveKey,
    });
  }

  @autobind
  handlePageChange(pageNum, pageSize) {
    const { location: { query: { childActiveKey, keyWord } } } = this.props;
    this.props.queryMissionList({ type: childActiveKey, pageNum, pageSize, keyWord });
  }

  // 删除任务下所关联客户反馈选项
  @autobind
  handleDelCustomerFeedback(missionId, feedbackId, roleType) {
    const {
      location: { query: { childActiveKey, pageNum = 1, pageSize = 20, keyWord } },
    } = this.props;
    const { missionData, delCustomerFeedback, queryMissionList } = this.props;
    const { missionList } = missionData;
    const missionItem = _.find(missionList, v => v.id === missionId);
    // 任务绑定的反馈不能少于一条并且 roleType 为服务经理可选项
    if (missionItem.feedbackList.length < 2 && roleType === SERVICE_MANAGER_ROLE.key) {
      message.error('每条任务绑定的客户反馈不能少于一条');
      return;
    }
    confirm({
      title: '提示',
      content: '删除的信息在系统中实时生效，会影响到已关联的任务，确认要删除吗？',
      onOk() {
        delCustomerFeedback({
          missionId,
          feedbackId,
          type: childActiveKey,
          roleType,
        }).then(() => {
          // 删除成功之后更新任务列表
          queryMissionList({ type: childActiveKey, pageNum, pageSize, keyWord });
        });
      },
    });
  }

  // 显示添加客户反馈弹层
  @autobind
  showAddFeedbackModal(missionId, roleType) {
    this.setState({
      showModal: true,
      beAddMissionId: missionId,
      roleType,
    });
  }

  // 添加客户反馈弹框点击确认
  @autobind
  handleAddFeedback() {
    const { beAddMissionId, roleType } = this.state;
    const {
      location: { query: { childActiveKey, pageNum = 1, pageSize = 20, keyWord } },
    } = this.props;
    const { addCustomerFeedback, queryMissionList } = this.props;
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
        roleType,
      }).then(() => {
        this.handleCloseModal();
        // 添加成功之后更新任务列表
        queryMissionList({ type: childActiveKey, pageNum, pageSize, keyWord });
      });
    }
  }

  /**
   * 搜索Mot任务列表
   * @param value 搜索关键字
   * @param pageNum 列表页，默认为第一页
   * @param pageSize 列表页容量，默认为20
   */
  @autobind
  @logable({ type: 'Click', payload: { name: '搜索Mot任务列表', value: '$args[0]' } })
  searchMotMission(keyWord, pageNum = 1, pageSize = 20) {
    this.props.queryMissionList({ type: MOT_TASK.key, pageNum, pageSize, keyWord });
  }
  // 修复tab上input中左右键切换不符合预期
  preventKeyDownPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：MOT任务/自建任务' } })
  handleSwitchTabClick(key) {
    this.props.missionBindChangeTab(key);
  }

  render() {
    const {
      showModal,
      collapseActiveKey,
      beAddMissionId,
      roleType,
    } = this.state;
    const { location: { query: { childActiveKey = MOT_TASK.key } } } = this.props;
    const { missionData, queryFeedbackList, feedbackData } = this.props;
    const missionPage = missionData.page || {};

    const isMOTMission = childActiveKey === MOT_TASK.key;
    const missionList = missionData.missionList || [];

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
          <Tabs
            onChange={this.handleSwitchTabClick}
            activeKey={childActiveKey}
            tabBarExtraContent={
              isMOTMission ?
                <Search
                  onKeyDown={this.preventKeyDownPropagation}
                  placeholder="事件ID/事件名称"
                  style={{ width: 186 }}
                  onSearch={this.searchMotMission}
                  enterButton
                /> :
                null
            }
          >
            {
              TABLIST.map(item => (<TabPane tab={item.name} key={item.key} />))
            }
          </Tabs>
        </div>
        <div className={styles.collapseBox}>
          <div className={styles.titleBox}>
            <span className={isMOTMission ? styles.parentClass : styles.parentClassSelf}>任务大类</span>
            {
              !isMOTMission ? null : (<span className={styles.missionId}>事件ID</span>)
            }
            <span className={styles.childClass}>任务子类/事件名称</span>
            <span className={styles.optionClass}>客户反馈选项</span>
          </div>
          {
            missionList.length ?
              <span>
                <Collapse
                  activeKey={collapseActiveKey}
                  onChange={this.handleChangeCollapse}
                  accordion
                >
                  { this.getPanelList() }
                </Collapse>
                <div className={styles.pageBox}>
                  <Pagination
                    current={missionPage.pageNum}
                    total={missionPage.totalCount}
                    pageSize={missionPage.pageSize}
                    onChange={this.handlePageChange}
                  />
                </div>
              </span> :
              <div className={styles.emptyContent}>
                <span><Icon type="frown-o" />暂无数据</span>
              </div>
          }
          <div className={styles.clear} />
        </div>
        {
          !showModal ? null
          : (
            <Modal
              title="请选择恰当的客户反馈"
              visible={showModal}
              onOk={this.handleAddFeedback}
              onCancel={this.handleCloseModal}
              width={650}
              wrapClassName={styles.feedbackAddModalWarp}
            >
              <FeedbackAdd
                missionId={beAddMissionId}
                queryFeedbackList={queryFeedbackList}
                feedbackData={feedbackData}
                roleType={roleType}
                ref={ref => this.feedbackAddComponent = ref}
              />
            </Modal>
          )
        }
      </div>
    );
  }
}
