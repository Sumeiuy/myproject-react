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

import Table from '../common/table';
import Tooltip from '../common/Tooltip';
import Button from '../common/Button';
import logable from '../../decorators/logable';
import {
  PROTOCOL_COLUMNS,
  FORMAT_TIME,
  FORMAT_TIME_ALL,
  NOT_TOUGU_SUBTYPE_LIST,
} from './config';
import styles from './protocolTab.less';

const KEY_ID = 'id';
const KEY_START_TIME = 'startTime';
const KEY_END_TIME = 'endTime';

export default class ProtocolTab extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
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

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      queryList,
      queryLoginInfo,
    } = this.props;
    // 查询列表数据
    queryList({
      custId: '1234',
    });
    // 查询登陆人信息
    queryLoginInfo({
      custId: '12344',
      rowId: '1234',
    });
  }

  @autobind
  getProtocolColumns(list) {
    const newList = [...list];
    // 协议编号列 render
    const idColumn = _.find(newList, o => o.key === KEY_ID);
    idColumn.render = (text, record) => this.renderIdColumn(text, record);
    // 开始日期
    const startTimeColumn = _.find(newList, o => o.key === KEY_START_TIME);
    startTimeColumn.render = text => this.renderTimeColumn(text);
    // 结束日期
    const endTimeColumn = _.find(newList, o => o.key === KEY_END_TIME);
    endTimeColumn.render = text => this.renderTimeColumn(text);
    return newList;
  }

  // 渲染编号列-不同类型的协议跳转不同的地址
  @autobind
  renderIdColumn(text, record) {
    const {
      subTypeCode,
    } = record;
    // 投顾协议 非投顾协议 需要跳转不同的地址
    const linkHandle = _.includes(NOT_TOUGU_SUBTYPE_LIST, subTypeCode)
    ? this.handleJumpReactProtocol
    : this.handleJumpFspProtocol;
    return (
      <div>
        <a onClick={linkHandle}>{text}</a>
      </div>
    );
  }

  // 跳转 FSP 的协议详情
  @autobind
  handleJumpFspProtocol() {
    console.warn('这里是跳转到旧 FSP 详情的方法');
  }

  // 跳转 React 的协议详情
  @autobind
  handleJumpReactProtocol() {
    console.warn('这里是跳转到 React 详情的方法');
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
    return null;
  }

  // 处理投顾签约，判断是否通过前置条件后决定是否跳转
  @autobind
  handlePassPrecondition() {
    const { queryPassPrecondition } = this.props;
    queryPassPrecondition({
      custId: '123445',
    }).then(this.handleJumpCreateFspProtocol());
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
    // TODO: main service manager
    if (isTouGu && isSameOrg) {
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
      list,
      loginInfo,
    } = this.props;
    const titleList = this.getProtocolColumns(PROTOCOL_COLUMNS);
    return (
      <div className={styles.protocolTab}>
        {this.renderTouGuBtn(loginInfo)}
        <Table
          columns={titleList}
          dataSource={list}
          rowKey="id"
          pagination={false}
        />
      </div>
    );
  }
}
