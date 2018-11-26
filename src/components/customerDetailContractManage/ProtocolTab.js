/**
 * @Description: 合约管理-协议tab
 * @Author: Liujianshu-K0240007
 * @Date: 2018-11-21 15:30:04
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-22 13:31:48
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';

import Icon from '../common/Icon';
import Table from '../common/table';
import Tooltip from '../common/Tooltip';
import Button from '../common/Button';
import logable from '../../decorators/logable';
import {
  PROTOCOL_COLUMNS,
  FORMAT_TIME,
  FORMAT_TIME_ALL,
  NOT_TOUGU_SUBTYPE,
  CHARGING_MODE_CODE,
  TOUGU_SUBTYPE,
} from './config';
import styles from './protocolTab.less';

const KEY_ID = 'id';
const KEY_START_TIME = 'startTime';
const KEY_END_TIME = 'endTime';
const KEY_HANDLER_NAME = 'handlerName';
const KEY_OPERATION = 'operation';

export default class ProtocolTab extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    custInfo: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    queryList: PropTypes.func.isRequired,
    loginInfo: PropTypes.object.isRequired,
    queryLoginInfo: PropTypes.func.isRequired,
    queryPassPrecondition: PropTypes.func.isRequired,
    passPrecondition: PropTypes.object.isRequired,
    submitProtocol: PropTypes.func.isRequired,
    submitData: PropTypes.object.isRequired,
    deleteProtocol: PropTypes.func.isRequired,
    deleteData: PropTypes.object.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.queryData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: {
          custId: prevCustId = '',
        },
      },
    } = prevProps;
    const {
      location: {
        query: {
          custId = '',
        },
      },
    } = this.props;
    if (!_.isEqual(prevCustId, custId)) {
      this.queryData();
    }
  }

  // 进入页面后获取数据
  @autobind
  queryData() {
    const {
      empInfo: { empInfo = {} },
      queryList,
      queryLoginInfo,
      location: { query: { custId } }
    } = this.props;
    const { rowId = ''  } = empInfo;
    // 查询列表数据
    queryList({
      custId,
    });
    // 查询登陆人信息
    queryLoginInfo({
      custId,
      rowId,
    });
  }

  @autobind
  getProtocolColumns(list) {
    const newList = [...list];
    // 协议编号列 render
    const idColumn = this.findColumn(newList, KEY_ID);
    idColumn.render = (text, record) => this.renderIdColumn(text, record);
    const handlerNameColumn = this.findColumn(newList, KEY_HANDLER_NAME);
    handlerNameColumn.render = (text, record) => {
      return !_.isEmpty(text)
      ? `${text} (${record.handlerId})`
      : '--';
    };
    // 开始日期
    const startTimeColumn = this.findColumn(newList, KEY_START_TIME);
    startTimeColumn.render = text => this.renderTimeColumn(text);
    // 结束日期
    const endTimeColumn = this.findColumn(newList, KEY_END_TIME);
    endTimeColumn.render = text => this.renderTimeColumn(text);
    // 操作列
    const operationColumn = this.findColumn(newList, KEY_OPERATION);
    operationColumn.render = (text, record) => this.renderOperationColumn(text, record);
    return newList;
  }

  // 通过 key 找到对应的 column
  @autobind
  findColumn(list, key) {
    return _.find(list, o => o.key === key);
  }

  // 渲染编号列-不同类型的协议跳转不同的地址
  @autobind
  renderIdColumn(text, record) {
    const {
      subTypeCode,
    } = record;
    // 投顾协议 非投顾协议 需要跳转不同的地址
    const linkHandle = subTypeCode === TOUGU_SUBTYPE
    ? () => this.handleJumpFspProtocol(record)
    : () => this.handleJumpReactProtocol(record);
    return (
      <div>
        <a onClick={linkHandle}>{text}</a>
      </div>
    );
  }


  // 渲染时间渲染列
  @autobind
  renderTimeColumn(text) {
    if (!_.isEmpty(text)) {
      return (
        <Tooltip title={moment(text).format(FORMAT_TIME_ALL)}>
          {moment(text).format(FORMAT_TIME)}
        </Tooltip>
      );
    }
    return '--';
  }

  // 渲染操作列表
  @autobind
  renderOperationColumn(text, record) {
    const {
      // 状态
      statusCode,
      // 收费模式
      chargingModeCode,
      // 节点
      node,
    } = record;
    // 协议状态为新建时，操作类型为：编辑、删除
    if (statusCode === 'New') {
      return (
        <div className={styles.iconWrapper}>
          <Icon
            type="bianji"
            onClick={() => this.handleEditProtocol(record)}
          />
          <Icon
            type="shanchu"
            onClick={() => this.handleDeleteProtocol(record)}
          />
        </div>
      );
    } else if (statusCode === 'Agree') {
      // 协议状态为同意时，操作类型为：变更、查看历史记录
      // qitawenjian\wenben
      return (
        <div className={styles.iconWrapper}>
          <Icon
            type="shuaxin"
            onClick={() => this.handleUpdateProtocol(record)}
          />
          <Icon
            type="chakanwenjian"
            onClick={() => this.handleViewHistoryProtocol(record)}
          />
        </div>
      );
    } else if (chargingModeCode === CHARGING_MODE_CODE
    && statusCode === 'Process'
    && node === '待扣款') {
      // return '终止、查看历史记录';
      return (
        <div className={styles.iconWrapper}>
          <Icon type="chakanwenjian" />终止
          <Icon type="chakanwenjian" />
        </div>
      );
    } else {
      return (
        <div className={styles.iconWrapper}>
          <Icon
            type="chakanwenjian"
            onClick={() => this.handleViewHistoryProtocol(record)}
          />
        </div>
      );
    }
    // status
    // '新建'
    // '处理中'
    // '终止'
    // '同意'
    // node
    // '待扣款'
    // '流程中终止'
    // '同意'
    // '终止'

    // '处理中'、'代扣款' = 犹豫期
  }


  // 跳转 FSP 的协议详情
  @autobind
  handleJumpFspProtocol(record) {
    console.warn('这里是跳转到旧 FSP 详情的方法');
    const { push } = this.context;
    const { custInfo = {} } = this.props;
    const { custNature = 'per' } = custInfo;
    const { rowId } = record;
    push({
      pathname: '/fsp/customerCenter/360OrderDetail',
      state: {
        url: `/customerCenter/360/${custNature}/orderDetail?rowId=${rowId}&flowCode=`,
      }
    });
  }

  // 跳转 React 的协议详情
  @autobind
  handleJumpReactProtocol(record) {
    console.warn('这里是跳转到 React 详情的方法');
    const { push } = this.context;
    const { custInfo = {} } = this.props;
    const { custId, name } = custInfo;
    const { subTypeCode = '' } = record;
    const newSubTypeCode = subTypeCode.replace(' ', '');
    push({
      pathname: '/businessApplyment/channelsTypeProtocol',
      query: {
        custName: name,
        custNumber: custId,
        subType: NOT_TOUGU_SUBTYPE[newSubTypeCode],
      },
    });
  }

  // 编辑协议
  @autobind
  handleEditProtocol(record = {}) {
    const { push } = this.context;
    const { custInfo = {} } = this.props;
    const { custId = '' } = custInfo;
    const temp = 'per:investcontract';
    push({
      pathname: '/fsp/contractWizard',
      state: {
        url: `/client/investcontract/wizard/main?busiId=${custId}&routeType=${temp}`,
      }
    });
  }

  @autobind
  handleUpdateProtocol(record) {
    // /fsp/customerCenter/360OperateType
    // TODO:字段
    const { push } = this.context;
    const { custInfo = {} } = this.props;
    const { custNature = 'per' } = custInfo;
    const { rowId = '' } = record;
    push({
      pathname: '/fsp/customerCenter/360OperateType',
      state: {
        url: `/customerCenter/360/${custNature}/operateType?rowId=${rowId}&custTypeCode=per&argId=&xSubmitFlag=&argEnd=`,
      }
    });
  }

  // 删除协议
  @autobind
  handleDeleteProtocol(record) {
    const {
      deleteProtocol,
      location: { query: { custId } },
    } = this.props;
    console.warn('record', record);
    deleteProtocol({
      custId,
      rowId: record.rowId || '',
    }).then(() => {
      message.success('删除成功');
      const {
        queryList,
        location: { query: { custId } },
      } = this.props;
      // 查询列表数据
      queryList({
        custId,
      });
    });
  }

  // 查看历史记录
  @autobind
  handleViewHistoryProtocol(record) {
    const { push } = this.context;
    const { custInfo = {} } = this.props;
    const { custNature = 'per' } = custInfo;
    const { rowId } = record;
    console.warn('查看历史记录', record);
    push({
      pathname: '/fsp/customerCenter/360orderHisDetail',
      state: {
        url: `/customerCenter/360/${custNature}/orderHisDetail?rowId=${rowId}&agrId=&custType=per&flowCode=`,
      }
    });
  }


  // 处理投顾签约，判断是否通过前置条件后决定是否跳转
  @autobind
  handlePassPrecondition() {
    const {
      queryPassPrecondition,
      location: { query: { custId } },
    } = this.props;
    queryPassPrecondition({
      custId,
    }).then(() => {
      this.handleEditProtocol();
    });
  }

  // 跳转到新建投顾签约的 fsp 页面
  @autobind
  handleJumpCreateFspProtocol() {
    const { passPrecondition } = this.props;
    console.warn('passPrecondition', passPrecondition);
  }

  // 渲染投顾签约按钮
  @autobind
  renderTouGuBtn({ isTouGu = false, isSameOrg = false }) {
    const { custInfo = {} } = this.props;
    const { isMainEmp = false } = custInfo;
    if (isMainEmp && isTouGu && isSameOrg) {
      return (
        <div className={styles.btnWrapper}>
          <Button
            type="primary"
            ghost
            onClick={this.handlePassPrecondition}
          >
            投顾签约
          </Button>
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      data: { list = [] },
      loginInfo,
    } = this.props;
    const titleList = this.getProtocolColumns(PROTOCOL_COLUMNS);
    return (
      <div className={styles.protocolTab}>
        {this.renderTouGuBtn(loginInfo)}
        <Table
          columns={titleList}
          dataSource={list}
          pagination={false}
          rowKey="id"
        />
      </div>
    );
  }
}
