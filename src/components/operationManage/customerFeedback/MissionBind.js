/* eslint-disable */
/*
 * @Description: 任务绑定客户反馈
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-26 11:10:18
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Tabs, Modal, Collapse, Icon, Popover, Button, Pagination } from 'antd';
import _ from 'lodash';

import withRouter from '../../../decorators/withRouter';
import FeedbackAdd from './FeedbackAdd';
import seibelHelper from '../../../helper/page/seibel';

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

@withRouter
export default class MissionBind extends PureComponent {
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
    // 清空任务列表数据
    emptyMissionData: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      showModal: false,
      collapseActiveKey: '',
      beAddMissionId: '',
    };
  }

  componentDidMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const { activeKey } = this.state;
    this.queryMissionList(activeKey, pageNum, pageSize);
    this.queryFeedbackList();
  }

  // 查询任务列表
  @autobind
  queryMissionList(type = 1, pageNum = 1, pageSize = 20) {
    const {
      getMissionList,
      replace,
      location: { pathname, query, },
    } = this.props;
    const params = {
      type,
      pageNum,
      pageSize,
    };
    getMissionList(params).then(()=> {
      const { missionData } = this.props;
      const missionPage = missionData.page;
      replace({
        pathname,
        query: {
          pageNum: missionPage.pageNum,
          pageSize: missionPage.pageSize,
        },
      });
    })
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
    getFeedbackList(params);
  }

  @autobind
  handleChangeTab(key) {
    const { emptyMissionData } = this.props;
    this.setState({
      activeKey: key,
    }, ()=> {
      emptyMissionData().then(()=> {
        this.queryMissionList(key);
      })
    });
  }

  @autobind
  handleAddFeedback() {
    console.log('onok',this.feedbackAddComponent)
    const { beAddMissionId } = this.state;
    let feedback;
    if(this.feedbackAddComponent) {
      feedback = this.feedbackAddComponent.getData();
      console.log('feedback',feedback);
    }
  }

  @autobind
  handleCancel() {
    this.setState({
      showModal: false,
    });
  }

  @autobind
  handleChangeCollapse(v) {
    this.setState({
      collapseActiveKey: v,
    });
  }

  @autobind
  handlePageChange(pageNum) {
    console.log(pageNum);
    const { activeKey } = this.state;
    this.queryMissionList(activeKey, pageNum);
  }

  // 删除任务下所关联客户反馈选项
  @autobind
  handleDelCustomerFeedback(missionId, feedbackId) {
    console.log(missionId,feedbackId);
    const { delCustomerFeedback } = this.props;
    confirm({
      title: '提示',
      content: '确认要删除吗?',
      onOk() {
        delCustomerFeedback({
          missionId,
          feedbackId
        })
      },
    });
  }

  @autobind
  handleShowAddFeedbackModal(missionId) {
    this.setState({
      showModal: true,
      beAddMissionId: missionId,
    })
  }

  @autobind
  getFeedbackItem(list, missionId) {
    return list.map(v=>{
      const content = <ul className={styles.popoverCentent}>
                        {
                          v.childList.map((sv, si)=>(
                            <li key={sv.id}>{`${String.fromCharCode(65+si)}. ${sv.name}`}</li>
                          ))
                        }
                      </ul>;
      return <div className={styles.feedbackItem} key={v.id}>
              <Popover placement="rightTop" content={content}>
                <span>{v.name}</span>
              </Popover>
              <Icon type="delete" onClick={()=>this.handleDelCustomerFeedback(missionId, v.id)} />
            </div>
    })
  }

  @autobind
  getPanelList() {
    const { missionData } = this.props;
    const missionList = missionData.missionList || EMPTY_LIST;
    return missionList.map(v=>{
      const header = <div className={styles.collapseHead}>
                        <span className={styles.parentClass}>{v.parentClassName}</span>
                        <span className={styles.childClass}>{v.childClassName}</span>
                        <span className={styles.optionClass}>{`${v.length}项`}<Icon type='up' /><Icon type='down' /></span>
                      </div>
      return <Panel header={header} key={v.id}>
              <div className={styles.feedbackListBox}>
                {
                  this.getFeedbackItem(v.feedbackList, v.id)
                }
                <Button onClick={()=>this.handleShowAddFeedbackModal(v.id)}>+新增</Button>
              </div>
            </Panel>
    })
  }

  render() {
    const {
      activeKey,
      showModal,
      collapseActiveKey,
      beAddMissionId,
    } = this.state;
    const {
      missionData,
      getFeedbackList,
      feedbackData,
    } = this.props;
    const missionPage = missionData.page || EMPTY_OBJECT;
    const page = {
      current: Number(missionPage.pageNum),
      pageSize: Number(missionPage.pageSize),
      total: Number(missionPage.totalCount),
      onChange: this.handlePageChange,
    }
    const modalProps = {
      title: '请选择恰当的客户反馈',
      visible: showModal,
      onOk: this.handleAddFeedback,
      onCancel: this.handleCancel,
      width: 650,
    };
    const collapseProps = {
      activeKey: collapseActiveKey,
      onChange: this.handleChangeCollapse,
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
          <Tabs onChange={this.handleChangeTab} activeKey={activeKey} >
            {
              TAB_LIST.map(v => (
                <TabPane tab={v.tabName} key={v.key} />
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
          <div className={styles.clear}></div>
        </div>
        <Modal {...modalProps}>
          <FeedbackAdd
            missionId={beAddMissionId}
            queryFeedbackList={this.queryFeedbackList}
            feedbackData={feedbackData}
            ref={ref => this.feedbackAddComponent = ref}
            />
        </Modal>
      </div>
    );
  }
}
/* eslint-disable */