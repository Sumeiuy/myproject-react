/**
 * @file customerPool/ToDoList.js
 *  目标客户池 待办流程列表
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, message } from 'antd';
import _ from 'lodash';
import {
  RETURN_TASK_FROM_TODOLIST,
} from '../../../config/createTaskEntry';
import { openRctTab } from '../../../utils';
import styles from './toDoList.less';
import logable from '../../../decorators/logable';
import emptyImg from './img/empty.png';
import { linkType } from './config';

const systemCode = '102330'; // 系统代码（理财服务平台为102330）
const USER_INFO_APPROVE = '投顾信息维护审核流程'; // 用户基本信息审核标识;

export default class ToDoList extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    todolist: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object,
    clearCreateTaskData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    taskBasicInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      flowId: null,
    };
    this.columns = [
      {
        title: '任务名称',
        dataIndex: 'task',
        key: 'task',
        render: (item, record) => (
          <a
            className={styles.title}
            target="_blank"
            rel="noopener noreferrer"
            title={item.id}
            onClick={() => this.handleOpenNewPage(record)}
          >
            {item.text}
          </a>
        ),
      },
      {
        title: '当前步骤',
        dataIndex: 'stepName',
        key: 'stepName',
        render: (item, record) => (<span className={styles.stepName}>{record.stepName}</span>),
      },
      {
        title: '提交人工号',
        dataIndex: 'originator',
        key: 'originator',
        render: (item, record) => (<span className={styles.orgId}>{record.originator}</span>),
      },
      {
        title: '提交人姓名',
        dataIndex: 'originatorName',
        key: 'originatorName',
        render: (item, record) => (<span className={styles.orgName}>{record.originatorName}</span>),
      },
      {
        title: '提交日期',
        dataIndex: 'applyDate',
        key: 'applyDate',
        render: (item, record) => (<span className={styles.submitDate}>{record.applyDate}</span>),
      },
    ];
  }

  componentDidMount() {
    this.updateEmptyHeight();
    window.addEventListener('resize', () => this.updateEmptyHeight());
  }


  componentDidUpdate() {
    this.updateEmptyHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.updateEmptyHeight());
  }

  // 空列表时空数据样式的盒子的高度
  updateEmptyHeight() {
    let topBarHeight = 0;
    const winHeight = document.body.clientHeight || document.documentElement.clientHeight;
    const topBar = document.getElementById('workspace-taskbar');
    if (topBar) {
      topBarHeight = topBar.offsetHeight;
    }
    const emptyTip = document.querySelector('.ant-table-placeholder');
    if (emptyTip) {
      emptyTip.style.height = `${winHeight - topBarHeight - 127}px`;
    }
  }

  @autobind
  handleChange(page) {
    this.props.onPageChange({
      curPageNum: page,
    });
  }

  @autobind
  handleSizeChange(current, size) {
    this.props.onSizeChange({
      pageSize: size,
      curPageNum: 1,
    });
  }


  @autobind
  handleOpenpages(record) {
    const {
      sourceFlag = '',
      stepName = '',
      applyId,
      originator,
    } = record;
    if (stepName === '驳回修改') {
      window.open(`/bpc/standalone.html#/bpc/highrisk/edit?requestId=${applyId}&empId=${originator}`);
    } else {
      const url = (_.filter(linkType, o => o.type === sourceFlag))[0].approvalUrl;
      window.open(`/fspa/spy${url}?requestId=${applyId}&empId=${originator}`);
    }
  }


  @autobind
  handleOpenOldpages(record) {
    const { getTaskBasicInfo } = this.props;
    if (record && record.stepName === '待发起人修改或终止') {
      this.setState({
        flowId: record.flowId,
      });
      // 请求任务基本信息，跳转到编辑页面
      getTaskBasicInfo({
        flowId: record.flowId,
        systemCode,
      }).then(this.handleSuccess);
    } else if (record && record.flowClass === USER_INFO_APPROVE) {
      this.toApproveUserInfo(record.flowId);
    } else {
      // 跳转到审批页面
      window.open(`${record.dispatchUri}&workFlowName=${encodeURI(record.flowClass)}`);
    }
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '任务名称',
    },
  })
  handleOpenNewPage(record) {
    const {
      sourceFlag = ''
    } = record;
    const { clearCreateTaskData } = this.props;
    // 判断是否被驳回任务，进行不同页面跳转
    // 后台无法返回状态码，只能判断文字
    clearCreateTaskData(RETURN_TASK_FROM_TODOLIST);
    if (sourceFlag) {
      // 如果存在sourceFlag，为特殊跳转，统一处理
      this.handleOpenpages(record);
    } else {
      // 跳转到后端返回的url
      this.handleOpenOldpages(record);
    }
  }

  // 跳转到基本信息审核页面
  @autobind
  toApproveUserInfo(flowId) {
    const { push, location: { query } } = this.props;
    const param = {
      id: 'USER_CENTER_BACKLOG_FLOW',
      title: '待办流程',
    };
    openRctTab({
      routerAction: push,
      url: `/userCenter/userInfoApproval?flowId=${flowId}`,
      param,
      pathname: '/userCenter/userInfoApproval',
      query: {
        ...query,
        flowId,
      },
    });
  }

  // 请求基本信息成功，页面跳转
  @autobind
  handleSuccess() {
    const { push, location: { query }, taskBasicInfo } = this.props;
    const { flowId } = this.state;
    // 判断返回信息中msg是否报错
    if (!_.isEmpty(taskBasicInfo.msg)) {
      message.error(taskBasicInfo.msg);
    }
    if (!_.isEmpty(taskBasicInfo) && _.isEmpty(taskBasicInfo.msg)) {
      const param = {
        id: 'RCT_FSP_CREATE_TASK_FROM_ToDoList',
        title: '自建任务',
      };
      openRctTab({
        routerAction: push,
        url: `/customerPool/createTaskFromTaskRejection1?source=${RETURN_TASK_FROM_TODOLIST}&flowId=${flowId}`,
        param,
        pathname: '/customerPool/createTaskFromTaskRejection1',
        query: {
          ...query,
          flowId,
          source: RETURN_TASK_FROM_TODOLIST,
        },
      });
    }
  }

  render() {
    const { className, data, todolist } = this.props;
    // 没有待办流程
    if (todolist.length === 0) {
      return (
        <div className={styles.empty}>
          <Table
            className={`${className} ${styles.todoListEmpty}`}
            rowKey={record => record.id}
            columns={this.columns}
            dataSource={todolist}
            locale={{ emptyText: '' }}
          />
          <div className={styles.emptyWrapper}>
            <div className="empty-container">
              <img src={emptyImg} alt="" />
              <p>暂无待办流程</p>
            </div>
          </div>
        </div>
      );
    }
    // 搜索结果为空
    if (data.length === 0) {
      return (
        <div className={styles.empty}>
          <Table
            className={`${className} ${styles.todoListEmpty}`}
            rowKey={record => record.id}
            columns={this.columns}
            dataSource={data}
            locale={{ emptyText: '' }}
          />
          <div className={styles.emptyWrapper}>
            <div className="empty-container">
              <img src={emptyImg} alt="" />
              <p>抱歉！没有找到相关结果</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <Table
        className={className}
        rowKey={record => record.id}
        columns={this.columns}
        dataSource={data}
      />
    );
  }
}
