/*
 * @Author: zuoguangzu
 * @Date: 2018-11-12 19:25:08
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-11-30 10:14:32
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, message } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import logable from '../../../decorators/logable';
import { openRctTab } from '../../../utils';
import {
  RETURN_TASK_FROM_TODOLIST,
} from '../../../config/createTaskEntry';
import { env } from '../../../helper';
import Pagination from '../../common/Pagination';

import styles from './taskList.less';
import emptyImg from './img/empty.png';

const systemCode = '102330';  // 系统代码（理财服务平台为102330）
const USER_INFO_APPROVE = '投顾信息维护审核流程'; // 用户基本信息审核标识;

export default class TaskList extends PureComponent {

  static propTypes = {
    data: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    // 数据类型
    listType: PropTypes.string.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
    // 无任务的时候提示文字
    emptyText: PropTypes.string.isRequired,
    // 分页
    page: PropTypes.object,
    onPageChange: PropTypes.func,
  }

  static defaultProps = {
    onPageChange: _.noop,
    page: {},
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      flowId: null,
      curPageNum: 1
    };
    this.columns = this.getColumnsByListType();
  }

  componentDidMount() {
    this.updateEmptyHeight();
    window.addEventListener('resize', this.handlewindowResize);
  }

  componentDidUpdate() {
    this.updateEmptyHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handlewindowResize);
  }

  @autobind
  handlewindowResize() {
    this.updateEmptyHeight();
  }

  // 空列表时空数据样式的盒子的高度
  updateEmptyHeight() {
    if (!env.isInReact()) {
      let topBarHeight = 0;
      const winHeight = document.body.clientHeight || document.documentElement.clientHeight;
      const topBar = document.querySelector('#workspace-taskbar');
      if (topBar) {
        topBarHeight = topBar.offsetHeight;
      }
      const emptyTip = document.querySelector('.ant-table-placeholder');
      if (emptyTip) {
        emptyTip.style.height = `${winHeight - topBarHeight - 127}px`;
      }
    }
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '任务名称',
    },
  })
  handleOpenNewPage(id) {
    const { data, getTaskBasicInfo, clearCreateTaskData } = this.props;
    const flowData = _.find(data, ['id', Number(id)]);
    // 判断是否被驳回任务，进行不同页面跳转
    // 后台无法返回状态码，只能判断文字
    clearCreateTaskData(RETURN_TASK_FROM_TODOLIST);
    if (flowData.stepName === '待发起人修改或终止') {
      this.setState({
        flowId: flowData.flowId,
      });
      // 请求任务基本信息，跳转到编辑页面
      getTaskBasicInfo({
        flowId: flowData.flowId,
        systemCode,
      }).then(this.handleSuccess);
    } else if (flowData.flowClass === USER_INFO_APPROVE) {
      this.toApproveUserInfo(flowData.flowId);
    } else {
      // 跳转到审批页面
      window.open(`${flowData.dispatchUri}&workFlowName=${encodeURI(flowData.workFlowName)}`);
    }
  }

  // 跳转到基本信息审核页面
  @autobind
  toApproveUserInfo(flowId) {
    const { location: { query } } = this.props;
    const { push } = this.context;
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
    const { location: { query }, taskBasicInfo } = this.props;
    const { push } = this.context;
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

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    this.setState({
      curPageNum: nextPage,
    });
    this.props.onPageChange(nextPage);
  }

  // 根据type获取列表数据
  @autobind
  getColumnsByListType() {
    let taskColumns = [];
    switch (this.props.listType) {
      case 'apply':
        taskColumns = [
          {
            title: '任务名称',
            dataIndex: 'subject',
            key: 'subject',
            render: (item, record) =>
              (<a
                target="_blank"
                rel="noopener noreferrer"
                title={item}
                data={record.id}
                onClick={() => this.handleOpenNewPage(record.id)}
                className={styles.title}
              >
                {record.subject}
              </a>),
          },
          {
            title: '类型',
            dataIndex: 'workFlowName',
            key: 'workFlowName',
            render: (item, record) => (<span>{record.workFlowName}</span>),
          },
          {
            title: '提交时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (item, record) => (<span>{moment(Number(record.startTime)).format('YYYY-MM-DD')}</span>),
          },
        ];
        break;
      case 'approve':
        taskColumns =  [
          {
            title: '任务名称',
            dataIndex: 'subject',
            key: 'subject',
            render: (item, record) =>
              (<a
                target="_blank"
                rel="noopener noreferrer"
                title={item}
                data={record.id}
                onClick={() => this.handleOpenNewPage(record.id)}
                className={styles.title}
              >
                {record.subject}
              </a>),
          },
          {
            title: '类型',
            dataIndex: 'workFlowName',
            key: 'workFlowName',
            render: (item, record) => (<span>{record.workFlowName}</span>),
          },
          {
            title: '提交人工号',
            dataIndex: 'originator',
            key: 'originator',
            render: (item, record) => (<span>{record.originator}</span>),
          },
          {
            title: '提交人姓名',
            dataIndex: 'originatorName',
            key: 'originatorName',
            render: (item, record) => (<span>{record.originatorName}</span>),
          },
          {
            title: '提交时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (item, record) => (<span>{moment(Number(record.startTime)).format('YYYY-MM-DD')}</span>),
          },
          {
            title: '审批时间',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (item, record) => (<span>{moment(Number(record.endTime)).format('YYYY-MM-DD')}</span>),
          },
        ];
        break;
        default:
          break;
    }
    return taskColumns;
  }
  render() {
    const {
      className,
      data,
      emptyText,
    } = this.props;
    // 生成页码器，此页码器配置项与Antd的一致
    const {
      page: {
        pageSize,
        curPageNum,
        totalRecordNum,
      }
    } = this.props;

    //数据为空
    if (_.isEmpty(data)) {
      return (
        <div className={styles.empty}>
            <div className={styles.emptyContainer}>
              <img src={emptyImg} alt="" />
              <p>{emptyText}</p>
            </div>
        </div>
      );
    }
    return (
      <div className={styles.taskList}>
        <Table
          className={className}
          rowKey='id'
          columns={this.columns}
          dataSource={data}
          pagination={false}
        />
        <Pagination
          total={totalRecordNum}
          pageSize={pageSize}
          defaultCurrent={1}
          onChange={this.handlePageNumberChange}
          current={curPageNum}
        />
      </div>
    );
  }
}
