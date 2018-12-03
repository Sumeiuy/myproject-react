/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情-调仓历史
 * @Date: 2018-04-17 13:43:55
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-15 09:50:31
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import { Popover } from 'antd';
import {
  securityType,
  typeList,
  directionRange,
  overlayStyle,
  formatDateStr,
} from '../config';
import { time } from '../../../helper';
import logable, { logPV } from '../../../decorators/logable';
import styles from './adjustHistory.less';

// securityType 里股票对应的值
const STOCK_CODE = securityType[0].value;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
export default class AdjustHistory extends PureComponent {
  static propTypes = {
    // 当前组合code
    combinationCode: PropTypes.string,
    showModal: PropTypes.func.isRequired,
    // 调仓历史数据
    data: PropTypes.object.isRequired,
    // openCustomerListPage: PropTypes.func.isRequired,
    openStockPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    combinationCode: '',
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
        [styles.in]: item.directionCode === Number(directionRange[1].value),
      });
      const key = `${index}${item.securityCode}`;
      return (
        <div className={itemClass} key={key}>
          <div className={styles.icon}>
            {iconText}
          </div>
          <div className={styles.text}>
            <div className={`${styles.top} clearfix`}>
              <span className={styles.security}>
                {
                item.securityType === STOCK_CODE
                  ? (
                    <a
                      title={`${item.securityName} (${item.securityCode}) `}
                      onClick={() => this.handleSecurityClick(item.securityType, item.securityCode, `${item.securityName}(${item.securityCode})`)}
                    >
                      {`${item.securityName} (${item.securityCode}) `}
                    </a>
                  )
                  : (
                    <span title={`${item.securityName} (${item.securityCode}) `}>
                      {`${item.securityName} (${item.securityCode}) `}
                    </span>
                  )
              }
              </span>
              <span className={styles.time}>{time.format(item.time, formatDateStr)}</span>
              <span className={styles.const}>{item.price}</span>
              <span className={styles.change}>{item.change || '持仓变化：暂无'}</span>
            </div>
            {
            this.renderPopover(item.reason)
          }
          </div>
        </div>
      );
    });
  }

  @autobind
  @logPV({
    pathname: '/modal/adjustHistoryModal',
    title: '调仓历史弹框',
  })
  handleMoreClick() {
    const { showModal, combinationCode } = this.props;
    showModal({
      type: typeList[0],
      combinationCode,
    });
  }

  // 证券名称点击事件
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '组合调仓',
      value: '$args[2]',
    },
  })
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
      reactElement = (
        <Popover
          placement="bottomLeft"
          content={value}
          trigger="hover"
          overlayStyle={overlayStyle}
        >
          <div className={styles.reason}>
            {value}
          </div>
        </Popover>
      );
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
          <span className={styles.const}>成本价(元)</span>
          <span className={styles.change}>持仓变化</span>
        </div>
        <div className={styles.bodyBox}>
          {this.getHistoryList(list)}
        </div>
      </div>
    );
  }
}
