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
import Button from '../common/Button';
import logable from '../../decorators/logable';
import {
  AGREEMENT_COLUMNS,
  FORMAT_TIME,
  FORMAT_TIME_ALL,
} from './config';
import styles from './protocolTab.less';

const KEY_ID = 'id';
const KEY_START_TIME = 'startTime';
const KEY_END_TIME = 'endTime';

export default class AgreementTab extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
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
