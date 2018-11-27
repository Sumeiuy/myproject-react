/**
 * @Description: 合约管理-合同tab
 * @Author: Liujianshu-K0240007
 * @Date: 2018-11-22 13:28:51
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-22 13:31:34
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';

import Table from '../common/table';
import Tooltip from '../common/Tooltip';
import logable from '../../decorators/logable';
import { url as urlHelper } from '../../helper';
import {
  AGREEMENT_COLUMNS,
  FORMAT_TIME,
  FORMAT_TIME_ALL,
  AGREEMENT_LIST,
} from './config';
import styles from './protocolTab.less';

const KEY_START_TIME = 'startTime';
const KEY_END_TIME = 'endTime';
const KEY_CONTENT = 'content';

export default class AgreementTab extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    queryList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      queryList,
      location: { query: { custId } }
    } = this.props;
    queryList({
      custId,
    });
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
      queryList,
    } = this.props;
    if (!_.isEqual(prevCustId, custId)) {
      queryList({
        custId,
      });
    }
  }

  @autobind
  getProtocolColumns(list) {
    const newList = [...list];
    // 开始日期
    const startTimeColumn = _.find(newList, o => o.key === KEY_START_TIME);
    startTimeColumn.render = text => this.renderTimeColumn(text);
    // 结束日期
    const endTimeColumn = _.find(newList, o => o.key === KEY_END_TIME);
    endTimeColumn.render = text => this.renderTimeColumn(text);
    // 内容
    const contentColumn = _.find(newList, o => o.key === KEY_CONTENT);
    contentColumn.render = (text, record) => this.renderContentColumn(text, record);
    return newList;
  }

  // 生成时间渲染列
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

  @autobind
  renderContentColumn(text, record) {
    return (
      <div>
        <a onClick={() => this.handleJumpAgreementReport(record)}>{text}</a>
      </div>
    );
  }

  @autobind
  @logable({ type: 'ViewItem', payload: { name: '合同内容' } })
  handleJumpAgreementReport(record) {
    const {
      empInfo: { empInfo = {} },
    } = this.props;
    const { login = ''  } = empInfo;
    const {
      name = '',
      ptyId = '',
    } = record;
    const filterAgreement = _.filter(AGREEMENT_LIST, o => o.name === name);
    const query = {
      'iv-user': login,
      menuId: filterAgreement[0].menuId || '',
      pty_id: ptyId,
    };
    const url = `/acrmbi/login?${urlHelper.stringify(query)}`;
    const w = window.open('about:blank');
    w.location.href = url;
  }

  render() {
    const {
      data: { list = [] },
    } = this.props;
    const titleList = this.getProtocolColumns(AGREEMENT_COLUMNS);
    return (
      <div className={styles.protocolTab}>
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
