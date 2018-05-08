/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-历史报告
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-08 14:32:28
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Popover } from 'antd';
// import config from '../config';
import styles from './historyReport.less';

// const titleStyle = {
//   fontSize: '16px',
// };

// const { directionRange } = config;
// const directionArray = _.filter(directionRange, o => o.value);
// securityType 里股票对应的值
// const STOCK_CODE = config.securityType[0].value;
// 持仓历史
// const HISTORY_TYPE = config.typeList[0];
export default class HistoryReport extends PureComponent {
  static propTypes = {
    showModal: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  @autobind
  handleMoreClick() {
    const { showModal } = this.props;
    showModal();
  }

  // 设置 popover
  @autobind
  renderPopover(value) {
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
        <div className={styles.ellipsis}>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = '标题：暂无';
    }
    return reactElement;
  }

  render() {
    return (
      <div className={styles.historyReportBox}>
        <div className={`${styles.headBox} clearfix`}>
          <h3>历史报告</h3>
          <a onClick={this.handleMoreClick}>更多报告</a>
        </div>
      </div>
    );
  }
}
