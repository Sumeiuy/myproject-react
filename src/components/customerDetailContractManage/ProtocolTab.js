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
import { url as urlHelper } from '../../helper';
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
// 个人类别默认值
const DEFAULT_PER_TYPE = 'per';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

export default class ProtocolTab extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    custInfo: PropTypes.object.isRequired,
    summaryCustInfo: PropTypes.object.isRequired,
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
      empInfo: { empInfo = EMPTY_OBJECT },
      queryList,
      queryLoginInfo,
      location: { query: { custId } },
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
    ? () => this.handleViewTouGuProtocol(record)
    : () => this.handleViewOtherProtocol(record);
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
      // 子类型 code
      subTypeCode,
      // 状态
      statusCode,
      // 收费模式
      chargingMode,
      // 节点
      node,
    } = record;
    if (subTypeCode !== TOUGU_SUBTYPE) {
      return null;
    }
    // 协议状态为新建时，操作类型为：编辑、删除
    if (statusCode === 'New') {
      return (
        <div className={styles.iconWrapper}>
          <Icon
            type="bianji1"
            title="编辑"
            onClick={() => this.handleEditProtocol(record, false)}
          />
          <Icon
            type="shanchu"
            title="删除"
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
            type="shuaxin1"
            title="变更"
            onClick={() => this.handleUpdateProtocol(record)}
          />
          <Icon
            type="chakanjilu"
            title="查看历史记录"
            onClick={() => this.handleViewHistoryProtocol(record)}
          />
        </div>
      );
    } else if (chargingMode === CHARGING_MODE_CODE
    && statusCode === 'Process'
    && node === '待扣款') {
      return (
        <div className={styles.iconWrapper}>
          <Icon
            type="zhongzhi"
            title="终止"
            onClick={() => this.handleCloseProtocol(record)}
          />
          <Icon
            type="chakanjilu"
            title="查看历史记录"
            onClick={() => this.handleViewHistoryProtocol(record)}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.iconWrapper}>
          <Icon
            type="chakanjilu"
            onClick={() => this.handleViewHistoryProtocol(record)}
          />
        </div>
      );
    }
  }

  // 统一处理跳转 fsp 协议的方法
  @autobind
  handleJumpFspProtocol(payload = EMPTY_OBJECT) {
    const {
      query = EMPTY_OBJECT,
      pathname = '',
      url = '',
    } = payload;
    const { push } = this.context;
    push({
      pathname,
      state: {
        url: `${url}?${urlHelper.stringify(query)}`,
      }
    });
  }

  // 跳转 FSP 的协议详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: { name: '协议编号' },
  })
  handleViewTouGuProtocol(record) {
    const { custInfo = EMPTY_OBJECT } = this.props;
    const { custNature = DEFAULT_PER_TYPE } = custInfo;
    const { rowId } = record;
    const query = {
      rowId,
      flowCode: '',
    };
    this.handleJumpFspProtocol({
      query,
      url: `/customerCenter/360/${custNature}/orderDetail`,
      pathname: '/fsp/customerCenter/360OrderDetail',
    });
  }

  // 非投顾，跳转 React 的协议详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: { name: '协议编号' },
  })
  handleViewOtherProtocol(record) {
    const { push } = this.context;
    const { custInfo = EMPTY_OBJECT } = this.props;
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

  // 新建、编辑协议
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '编辑协议' },
  })
  handleEditProtocol(record = EMPTY_OBJECT, isAdd = false) {
    const {
      custInfo = EMPTY_OBJECT,
      summaryCustInfo = EMPTY_OBJECT,
    } = this.props;
    const { custRowId = '' } = summaryCustInfo;
    const {
      custNature = DEFAULT_PER_TYPE,
    } = custInfo;
    const { id = '' } = record;
    const routeType = isAdd
    ? `${custNature}:investcontract`
    : `${custNature}:investcontract:${id}`;
    const query = {
      busiId: custRowId,
      routeType,
    };
    this.handleJumpFspProtocol({
      query,
      url: '/client/investcontract/wizard/main',
      pathname: '/fsp/contractWizard',
    });
  }

  // 变更协议
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '变更协议' },
  })
  handleUpdateProtocol(record) {
    const {
      custInfo = EMPTY_OBJECT,
      summaryCustInfo = EMPTY_OBJECT,
    } = this.props;
    const {
      custNature = DEFAULT_PER_TYPE,
    } = custInfo;
    const { custRowId = '' } = summaryCustInfo;
    const {
      rowId = '',
      xSubmitFlag = 'N',
      argValiDate = '',
    } = record;
    const query = {
      rowId: custRowId,
      custTypeCode: custNature,
      argId: rowId,
      xSubmitFlag,
      argEnd: argValiDate,
    };
    this.handleJumpFspProtocol({
      query,
      url: `/customerCenter/360/${custNature}/operateType`,
      pathname: '/fsp/customerCenter/360OperateType',
    });
  }

  // 终止协议
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '终止协议' },
  })
  handleCloseProtocol(record) {
    const {
      submitProtocol,
      location: { query: { custId } },
    } = this.props;
    submitProtocol({
      custId,
      rowId: record.rowId,
    }).then(() => {
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

  // 删除协议
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '删除协议' },
  })
  handleDeleteProtocol(record) {
    const {
      deleteProtocol,
      location: { query: { custId } },
    } = this.props;
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
  @logable({
    type: 'ButtonClick',
    payload: { name: '查看历史记录' },
  })
  handleViewHistoryProtocol(record) {
    const { custInfo = EMPTY_OBJECT } = this.props;
    const { custNature = DEFAULT_PER_TYPE } = custInfo;
    const { rowId } = record;
    const query = {
      rowId,
      agrId: rowId,
      custType: custNature,
      flowCode: '',
    };
    this.handleJumpFspProtocol({
      query,
      url: `/customerCenter/360/${custNature}/orderHisDetail`,
      pathname: '/fsp/customerCenter/360orderHisDetail',
    });
  }

  // 处理投顾签约，判断是否通过前置条件后决定是否跳转
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '投顾签约' },
  })
  handlePassPrecondition() {
    const {
      queryPassPrecondition,
      location: { query: { custId } },
    } = this.props;
    queryPassPrecondition({
      custId,
    }).then(() => {
      this.handleEditProtocol({}, true);
    });
  }

  // 渲染投顾签约按钮
  @autobind
  renderTouGuBtn({ isTouGu = false, isSameOrg = false }) {
    const { custInfo = EMPTY_OBJECT } = this.props;
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
      data: { list = EMPTY_ARRAY },
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
