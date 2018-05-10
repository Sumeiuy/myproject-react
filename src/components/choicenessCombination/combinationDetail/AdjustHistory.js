/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-组合调仓组件
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-10 14:38:07
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import { Popover } from 'antd';
import config from '../config';
import { time } from '../../../helper';
import styles from './adjustHistory.less';

// securityType 里股票对应的值
const STOCK_CODE = config.securityType[0].value;
const directionRange = config.directionRange;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
export default class AdjustHistory extends PureComponent {
  static propTypes = {
    showModal: PropTypes.func.isRequired,
    // 调仓历史数据
    data: PropTypes.object.isRequired,
    // openCustomerListPage: PropTypes.func.isRequired,
    openStockPage: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  @autobind
  getHistoryList(list) {
    return list.map((item, index) => {
      const directList = _.filter(directionRange, v => item.directionCode === Number(v.value))
        || EMPTY_LIST;
      const iconText = (directList[0] || EMPTY_OBJECT).icon;
      const itemClass = classnames({
        [styles.itemBox]: true,
        clearfix: true,
        [styles.in]: item.directionCode === directionRange[1].value,
      });
      const key = `${index}${item.securityCode}`;
      return (<div className={itemClass} key={key}>
        <div className={styles.icon}>
          {iconText}
        </div>
        <div className={styles.text}>
          <div className={`${styles.top} clearfix`}>
            <span className={styles.security}>
              <a
                title={`${item.securityName} (${item.securityCode}) `}
                onClick={() => this.handleSecurityClick(item.directionCode, item.securityCode)}
              >
                {`${item.securityName} (${item.securityCode}) `}
              </a>
            </span>
            <span className={styles.time}>{time.format(item.time, config.formatStr)}</span>
            <span className={styles.const}>{item.price}</span>
            <span className={styles.change}>{item.change || '持仓变化：暂无'}</span>
          </div>
          {
            this.renderPopover(item.reason)
          }
        </div>
      </div>);
    });
  }

  @autobind
  handleMoreClick() {
    const { showModal } = this.props;
    showModal();
  }

  // 证券名称点击事件
  @autobind
  handleSecurityClick(type, code) {
    if (type === STOCK_CODE) {
      const { openStockPage } = this.props;
      const openPayload = {
        code,
      };
      openStockPage(openPayload);
    }
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
        <div className={styles.reason}>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = <div className={styles.reason}>调仓理由：暂无</div>;
    }
    return reactElement;
  }

  render() {
    const { data: { list = EMPTY_LIST } } = this.props;
    return (
      <div className={styles.adjustHistoryBox}>
        <div className={`${styles.headBox} clearfix`}>
          <h3>调仓历史</h3>
          <a onClick={this.handleMoreClick}>更多调仓历史</a>
        </div>
        <div className={`${styles.titleBox} clearfix`}>
          <span className={styles.security}>证券名称及代码</span>
          <span className={styles.time}>成交时间</span>
          <span className={styles.const}>成交价(元)</span>
          <span className={styles.change}>持仓变化</span>
        </div>
        <div className={styles.bodyBox}>
          {this.getHistoryList(list)}
        </div>
      </div>
    );
  }
}
