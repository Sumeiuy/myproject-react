/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-历史报告
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-11 17:18:02
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Popover, Table } from 'antd';
import {
  titleList as titleListConfig,
  typeList,
  formatDateStr,
  overlayStyle,
} from '../config';
import { time } from '../../../helper';
import logable, { logPV } from '../../../decorators/logable';
import styles from './historyReport.less';

const EMPTY_LIST = [];
const titleList = titleListConfig.historyReport;
export default class HistoryReport extends PureComponent {
  static propTypes = {
    // 当前组合code
    combinationCode: PropTypes.string,
    // 历史报告数据
    data: PropTypes.object.isRequired,
    showModal: PropTypes.func.isRequired,
    // 打开历史报告详情
    openReportDetailPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    combinationCode: '',
  }

  @autobind
  getNewTitleList(list) {
    const newTitleList = [...list];
    newTitleList[0].render = (text, record) => (
      this.renderPopover(text, record)
    );
    newTitleList[1].render = text => (
      <div className={styles.ellipsis} title={text}>
        {text}
      </div>
    );
    newTitleList[2].render = text => (
      <div className={styles.ellipsis} title={text}>
        {time.format(text, formatDateStr)}
      </div>
    );
    return newTitleList;
  }

  @autobind
  @logPV({
    pathname: '/modal/historyReportModal',
    title: '历史报告弹框',
  })
  handleMoreClick() {
    const { showModal, combinationCode } = this.props;
    showModal({
      type: typeList[1],
      combinationCode,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '历史报告',
      value: '$args[0].logName',
    },
  })
  handleOpenReportDetailPage(payload) {
    const { openReportDetailPage } = this.props;
    openReportDetailPage(payload);
  }

  // 设置 popover
  @autobind
  renderPopover(value, record) {
    let reactElement = null;
    const payload = {
      id: record.id,
      code: record.combinationCode,
      logName: value,
    };
    if (value) {
      reactElement = (
        <Popover
          placement="bottomLeft"
          content={value}
          trigger="hover"
          overlayStyle={overlayStyle}
        >
          <div className={styles.ellipsis}>
            <span
              className={styles.titleLink}
              onClick={() => this.handleOpenReportDetailPage(payload)}
            >
              {value}
            </span>
          </div>
        </Popover>
      );
    } else {
      reactElement = '标题：暂无';
    }
    return reactElement;
  }

  render() {
    const {
      data: { list = EMPTY_LIST },
    } = this.props;
    const newTitleList = this.getNewTitleList(titleList);
    return (
      <div className={styles.historyReportBox}>
        <div className={`${styles.headBox} clearfix`}>
          <h3>历史报告</h3>
          <a onClick={this.handleMoreClick}>更多报告</a>
        </div>
        <Table
          columns={newTitleList}
          dataSource={list}
          pagination={false}
          onChange={this.handlePaginationChange}
          rowKey="id"
        />
      </div>
    );
  }
}
