/*
 * @Description: 任务绑定客户反馈
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-04 18:02:25
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs, Modal, Collapse, Icon, Popover, Input } from 'antd';
// import _ from 'lodash';

import Pagination from '../../components/common/Pagination';
import logable from '../../decorators/logable';
import {
  TASK_LIST,
  MOT_TASK,
} from './config';

import styles from './taskBindTemplate.less';

const TabPane = Tabs.TabPane;
// const Panel = Collapse.Panel;
// const confirm = Modal.confirm;
const Search = Input.Search;

export default class MissionBind extends PureComponent {
  static propTypes = {
    // 查询任务绑定投资建议模板列表
    getTaskBindList: PropTypes.func.isRequired,
    // 任务绑定投资建议模板列表
    taskBindTemplate: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 展示添加投资建议模板的弹出层
      addTemplateModall: false,
      // 当前显示 MOT任务页签内容还是自建任务页签内容,默认为MOT
      active: MOT_TASK.key,
      // 显示哪个折叠面板
      collapseActiveKey: '',
      // MOT任务可以根据关键字的搜索任务
      keyWord: '',
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
      return (<div className={styles.feedbackItem} key={item.id}>
        {
          obj.needPopover && item.childList && item.childList.length
          ?
            <Popover placement="bottomLeft" content={content} overlayClassName={styles.opcityPopover}>
              <span className={styles.feedbackText}>{item.name}</span>
            </Popover>
          :
            <span className={styles.feedbackText}>{item.name}</span>
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
        <span
          className={styles.feedbackText}
          title={item.custFeedbackName ? item.custFeedbackName : ''}
        >
          {item.custFeedbackName ? item.custFeedbackName : ''}
        </span>
      </div>
    ));
  }

  // 获取任务Panel
  // @autobind
  // getPanelList() {
  //   const { missionData } = this.props;
  //   const { location: { query: { childActiveKey = MOT_TASK.key } } } = this.props;
  //   const missionList = missionData.missionList || [];
  //   const isMOTMission = childActiveKey === MOT_TASK.key;
  //   return missionList.map((item) => {
  //     const header = (<div className={styles.collapseHead}>
  //       <span
  //         className={isMOTMission ? styles.parentClass : styles.parentClassSelf}
  //       >
  //         {
  //           _.size(item.customerList) <= 4 ? null :
  //           (<Icon type="exclamation-circle" className={styles.overWarningIcon} />)
  //         }
  //         {item.parentClassName}
  //       </span>
  //       {
  //         isMOTMission ?
  //           <span className={styles.missionId}>{item.id}</span> :
  //           null
  //       }
  //       <span
  //          className={styles.childClass} title={item.childClassName}>{item.childClassName}</span>
  //       <span className={styles.optionClass}>查看<Icon type="up" /><Icon type="down" /></span>
  //     </div>);
  //     return (<Panel header={header} key={item.id}>
  //       <div className={styles.feedbackListBox}>
  //         <h2>{SERVICE_MANAGER_ROLE.name}</h2>
  //         {
  //           this.getFeedbackItem(item.feedbackList, item.id, {
  //             needPopover: true,
  //             roleType: SERVICE_MANAGER_ROLE.key,
  //           })
  //         }
  //         <Button
  //           ghost
  //           icon="plus"
  //           type="primary"
  //           onClick={() => this.showAddFeedbackModal(item.id, SERVICE_MANAGER_ROLE.key)}
  //         >
  //           新增
  //         </Button>
  //       </div>
  //       <div className={styles.feedbackListBox}>
  //         <h2>
  //           {ZHANGLE_ROLE.name}
  //           {
  //             _.size(item.customerList) <= 4 ? null
  //             : (
  //               <span className={styles.overWarningText}>客户可选项总数不能大于4项</span>
  //             )
  //           }
  //         </h2>
  //         {
  //           this.getZLFeedbackItem(item.feedbackList, item.id, {
  //             needPopover: false,
  //             roleType: ZHANGLE_ROLE.key,
  //           })
  //         }
  //       </div>
  //     </Panel>);
  //   });
  // }

  // 关闭弹窗
  @autobind
  handleCloseModal() {
    this.setState({
      addTemplateModall: false,
    });
  }

  // 切换折叠面板
  @autobind
  @logable({ type: 'Click', payload: { name: '切换折叠面板' } })
  handleChangeCollapse(collapseActiveKey) {
    this.setState({ collapseActiveKey });
  }

  @autobind
  handlePageChange(pageNum, pageSize) {
    const { active, keyWord } = this.state;
    this.props.getTaskBindList({ type: active, pageNum, pageSize, keyWord });
  }

  // 删除任务下所关联客户反馈选项
  // @autobind
  // handleDelCustomerFeedback(missionId, feedbackId, roleType) {
  //   const {
  //     location: { query: { childActiveKey, pageNum = 1, pageSize = 20, keyWord } },
  //   } = this.props;
  //   const { missionData, delCustomerFeedback, queryMissionList } = this.props;
  //   const { missionList } = missionData;
  //   const missionItem = _.find(missionList, v => v.id === missionId);
  //   // 任务绑定的反馈不能少于一条并且 roleType 为服务经理可选项
  //   if (missionItem.feedbackList.length < 2 && roleType === SERVICE_MANAGER_ROLE.key) {
  //     message.error('每条任务绑定的客户反馈不能少于一条');
  //     return;
  //   }
  //   confirm({
  //     title: '提示',
  //     content: '删除的信息在系统中实时生效，会影响到已关联的任务，确认要删除吗？',
  //     onOk() {
  //       delCustomerFeedback({
  //         missionId,
  //         feedbackId,
  //         type: childActiveKey,
  //         roleType,
  //       }).then(() => {
  //         // 删除成功之后更新任务列表
  //         queryMissionList({ type: childActiveKey, pageNum, pageSize, keyWord });
  //       });
  //     },
  //   });
  // }

  // 显示添加客户反馈弹层
  @autobind
  showAddFeedbackModal(missionId, roleType) {
    this.setState({
      addTemplateModall: true,
      beAddMissionId: missionId,
      roleType,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '搜索Mot任务列表', value: '$args[0]' } })
  searchMotMission(keyWord, pageNum = 1, pageSize = 20) {
    this.setState({ keyWord });
    this.props.getTaskBindList({ type: MOT_TASK.key, pageNum, pageSize, keyWord });
  }

  // 修复tab上input中左右键切换不符合预期
  @autobind
  preventKeyDownPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：MOT任务/自建任务' } })
  handleSwitchTabClick(active) {
    this.setState({ active });
  }

  render() {
    const {
      addTemplateModall,
      collapseActiveKey,
      active,
    } = this.state;

    const { taskBindTemplate: { page = {}, missionList = [] } } = this.props;

    const isMOTMission = active === MOT_TASK.key;

    return (
      <div className={styles.missionBindWapper}>
        <div className={styles.tipsBox}>
          <p>
            请基于任务类型（或MOT事件）定义投顾可以选择的投资建议模板，每个类型可以定义多条投资建议模板。
          </p>
        </div>
        <div className={styles.tabBox}>
          <Tabs
            onChange={this.handleSwitchTabClick}
            activeKey={active}
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
              TASK_LIST.map(item => (<TabPane tab={item.name} key={item.key} />))
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
                    current={page.pageNum}
                    total={page.totalCount}
                    pageSize={page.pageSize}
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
          !addTemplateModall ? null
          : (
            <Modal
              title="请选择恰当的投资建议模板"
              visible={addTemplateModall}
              onOk={this.handleAddFeedback}
              onCancel={this.handleCloseModal}
              width={650}
              wrapClassName={styles.feedbackAddModalWarp}
            >
              <div>暂无</div>
            </Modal>
          )
        }
      </div>
    );
  }
}
