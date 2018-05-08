/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-组合调仓组件
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-08 17:37:37
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Popover } from 'antd';
import config from '../config';
import styles from './adjustHistory.less';

// const titleStyle = {
//   fontSize: '16px',
// };

// const { directionRange } = config;
// const directionArray = _.filter(directionRange, o => o.value);
// securityType 里股票对应的值
const STOCK_CODE = config.securityType[0].value;
// 持仓历史
// const HISTORY_TYPE = config.typeList[0];
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
        <div className={styles.reason}>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = '调仓理由：暂无';
    }
    return reactElement;
  }

  @autobind
  getHistoryList() {
    // const { data: { list } } = this.props;
  }

  render() {
    return (
      <div className={styles.adjustHistoryBox}>
        <div className={`${styles.headBox} clearfix`}>
          <h3>调仓历史</h3>
          <a onClick={this.handleMoreClick}>更多调仓历史</a>
        </div>
        <div className={`${styles.titleBox} clearfix`}>
          <span className={styles.security}>证券名称及代码</span>
          <span className={styles.time}>成交时间</span>
          <span className={styles.const}>成交价</span>
          <span className={styles.change}>持仓变化</span>
        </div>
        <div className={styles.bodyBox}>
          <div className={`${styles.itemBox} clearfix`}>
            <div className={styles.icon}>
              买
            </div>
            <div className={styles.text}>
              <div className={`${styles.top} clearfix`}>
                <span className={styles.security}>
                  <a>神马证券(203223)</a>
                </span>
                <span className={styles.time}>2018/2/13 15:00</span>
                <span className={styles.const}>5.02</span>
                <span className={styles.change}>0.00% -&gt; 12.65%</span>
              </div>
              {
                this.renderPopover('理由理由理由理由理由理由理由理由')
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
