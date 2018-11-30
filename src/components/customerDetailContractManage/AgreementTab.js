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
import IfTableWrap from '../common/IfTableWrap';
import logable from '../../decorators/logable';
import { url as urlHelper } from '../../helper';
import {
  AGREEMENT_COLUMNS,
  FORMAT_TIME,
  AGREEMENT_LIST,
  DEFAULT_TEXT,
} from './config';
import styles from './protocolTab.less';

const KEY_NAME = 'name';
const KEY_START_TIME = 'startTime';
const KEY_END_TIME = 'endTime';
const KEY_CONTENT = 'content';
const KEY_REMARK = 'remark';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

export default class AgreementTab extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    queryList: PropTypes.func.isRequired,
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
    // 合同名称
    const nameColumn = _.find(newList, o => o.key === KEY_NAME);
    nameColumn.render = text => this.renderTooltipColumn(text);
    // 开始日期
    const startTimeColumn = _.find(newList, o => o.key === KEY_START_TIME);
    startTimeColumn.render = text => this.renderTimeColumn(text);
    // 结束日期
    const endTimeColumn = _.find(newList, o => o.key === KEY_END_TIME);
    endTimeColumn.render = text => this.renderTimeColumn(text);
    // 内容
    const contentColumn = _.find(newList, o => o.key === KEY_CONTENT);
    contentColumn.render = (text, record) => this.renderContentColumn(text, record);
    const remarkColumn = _.find(newList, o => o.key === KEY_REMARK);
    remarkColumn.render = text => this.renderTooltipColumn(text);
    return newList;
  }

  @autobind
  renderTooltipColumn(text) {
    if (!_.isEmpty(text)) {
      return (
        <Tooltip title={text}>
          <div className={styles.ellipsis}>
            {text}
          </div>
        </Tooltip>
      );
    }
    return DEFAULT_TEXT;
  }

  // 生成时间渲染列
  @autobind
  renderTimeColumn(text) {
    if (!_.isEmpty(text)) {
      return moment(text).format(FORMAT_TIME);
    }
    return DEFAULT_TEXT;
  }

  @autobind
  renderContentColumn(text, record) {
    if (!_.isEmpty(text)) {
      return (
        <div className={styles.ellipsis}>
          <Tooltip title={text}>
            <a onClick={() => this.handleJumpAgreementReport(record)}>{text}</a>
          </Tooltip>
        </div>
      );
    }
    return DEFAULT_TEXT;
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: { name: '合同内容' },
  })
  handleJumpAgreementReport(record) {
    const {
      empInfo: { empInfo = EMPTY_OBJECT },
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
      data: { list = EMPTY_ARRAY },
    } = this.props;
    const titleList = this.getProtocolColumns(AGREEMENT_COLUMNS);
    const isRender = !_.isEmpty(list);
    return (
      <div className={styles.protocolTab}>
        <IfTableWrap isRender={isRender} text="暂无合同信息">
          <Table
            columns={titleList}
            dataSource={list}
            rowKey="id"
            pagination={false}
          />
        </IfTableWrap>
      </div>
    );
  }
}
