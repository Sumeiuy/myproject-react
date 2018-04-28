/*
 * @Author: XuWenKang
 * @Description: 精选组合-近一周表现前十的证券
 * @Date: 2018-04-17 16:38:02
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-18 14:26:10
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import InfoTitle from '../common/InfoTitle';
import Icon from '../common/Icon';
import config from './config';
import styles from './weeklySecurityTopTen.less';

const titleStyle = {
  fontSize: '16px',
};
// securityType 里股票对应的值
const STOCK_CODE = config.securityType[0].value;

export default class WeeklySecurityTopTen extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    permission: PropTypes.bool.isRequired,
    orgId: PropTypes.string,
    openCustomerListPage: PropTypes.func.isRequired,
    openStockPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    orgId: '',
  }

  // constructor(props) {
  //   super(props);
  // }

  // 证券名称点击事件
  @autobind
  securityHandle(type, code) {
    if (type === STOCK_CODE) {
      console.warn('是股票');
      const { openStockPage } = this.props;
      const openPayload = {
        code,
      };
      openStockPage(openPayload);
    }
  }

  @autobind
  percentChange(value) {
    let newValue = value;
    if (value > 0) {
      newValue = `+${newValue}`;
    } else {
      newValue = `-${newValue}`;
    }
    return newValue;
  }

  @autobind
  renderList() {
    const { data, openCustomerListPage } = this.props;
    return data.map((item, index) => {
      const {
        securityType,
        name,
        code,
        callInTime,
        priceLimit,
        combinationName,
        reason,
      } = item;
      const key = `${code}${index}`;
      const change = this.percentChange(priceLimit.toFixed(2));
      const bigThanZero = priceLimit > 0;
      const changeClassName = classnames({
        [styles.up]: bigThanZero,
        [styles.down]: !bigThanZero,
      });
      const openPayload = {
        name,
        code,
        type: securityType,
      };
      return (
        <li key={key}>
          <div className={`${styles.summary} clearfix`}>
            <a
              className={styles.securityName}
              title={`${name} ${code}`}
              onClick={() => this.securityHandle(securityType, code)}
            >
              {name}（{code}）
            </a>
            <span className={styles.adjustTime} title={callInTime}>{callInTime}</span>
            <span className={styles.upAndDown}>
              <i className={changeClassName}>
                {change}%
              </i>
            </span>
            <span className={styles.combinationName} title={combinationName}>
              {combinationName}
            </span>
            <span className={styles.client}>
              <a onClick={() => openCustomerListPage(openPayload)}><Icon type="kehuzu" /></a>
            </span>
          </div>
          <p className={styles.reason}>{reason || '暂无'}</p>
        </li>
      );
    });
  }

  render() {
    return (
      <div className={styles.weeklySecurityTopTenBox}>
        <InfoTitle
          head="近一周表现前十的证券"
          titleStyle={titleStyle}
        />
        <div className={styles.weeklySecurityTopTenContainer}>
          <div className={`${styles.titleBox} clearfix`}>
            <span className={styles.securityName}>证券名称及代码</span>
            <span className={styles.adjustTime}>调入时间</span>
            <span className={styles.upAndDown}>涨跌幅</span>
            <span className={styles.combinationName}>组合名称</span>
            <span className={styles.client}>持仓客户</span>
          </div>
          <ul className={styles.bodyBox}>
            {this.renderList()}
          </ul>
        </div>
      </div>
    );
  }
}
