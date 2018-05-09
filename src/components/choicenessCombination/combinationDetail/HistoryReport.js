/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-历史报告
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-09 15:29:18
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Popover, Table } from 'antd';
import config from '../config';
import styles from './historyReport.less';

// const { directionRange } = config;
// const directionArray = _.filter(directionRange, o => o.value);
// securityType 里股票对应的值
// const STOCK_CODE = config.securityType[0].value;
// 持仓历史
// const HISTORY_TYPE = config.typeList[0];
const EMPTY_LIST = [];
const titleList = config.titleList.historyReport;
export default class HistoryReport extends PureComponent {
  static propTypes = {
    // 历史报告数据
    data: PropTypes.object.isRequired,
    showModal: PropTypes.func.isRequired,
    // 打开历史报告详情
    openReportDetail: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  @autobind
  getNewTitleList(list) {
    const newTitleList = [...list];
    newTitleList[0].render = text => (
      this.renderPopover(text)
    );
    return newTitleList;
  }

  @autobind
  handleMoreClick() {
    const { showModal } = this.props;
    showModal();
  }

  // 设置 popover
  @autobind
  renderPopover(value) {
    const { openReportDetail } = this.props;
    let reactElement = null;
    if (value) {
      reactElement = (<Popover
        placement="bottomLeft"
        content={value}
        trigger="hover"
        overlayStyle={{
          width: '240px',
          padding: '10px',
          wordBreak: 'break-all',
        }}
      >
        <div className={styles.ellipsis} onClick={() => openReportDetail()}>
          {value}
        </div>
      </Popover>);
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
        />
      </div>
    );
  }
}
