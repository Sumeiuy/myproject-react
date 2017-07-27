/**
 * @file components/customerPool/ProductSales.js
 *  客户池-产品销售
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Progress } from 'antd';
import { getMaxAndMinMoney } from '../chartRealTime/FixNumber';
import styles from './productSales.less';

export default class ProductSales extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props);
    console.log(props);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  // 换算最大整数
  padFixedMoney(m, method) {
    const money = Math.abs(m);
    const mLength = money.toString().length || 0;
    let value = 0;
    const powm = Math.pow(10, mLength - 1);  // eslint-disable-line
    if (mLength > 0 && money >= powm) {
      value = Math[method](m / powm) * powm;
    } else {
      value = Math[method](m);
    }
    return value;
  }

  // 百分比计算
  handleDataShadow(num) {
    const data = [18203, 23489, 29034, 104970];
    const maxAndMin = getMaxAndMinMoney(data);
    const maxX = this.padFixedMoney(maxAndMin.max, 'ceil');
    const percentage = (num / maxX) * 100;
    // debugger;
    return percentage;
  }

  render() {
    return (
      <div className={styles.productBox}>
        <div className={styles.product}>
          <div className={styles.productItem}>
            <span className={styles.name}>公募基金</span>
            <div className={styles.Progressbox}>
              <Progress percent={this.handleDataShadow(18203)} showInfo={false} status="active" />
            </div>
            <span className={styles.num}>18203</span>
          </div>
          <div className={styles.productItem}>
            <span className={styles.name}>证券投资</span>
            <div className={styles.Progressbox}>
              <Progress percent={this.handleDataShadow(23489)} showInfo={false} status="active" />
            </div>
            <span className={styles.num}>23489</span>
          </div>
          <div className={styles.productItem}>
            <span className={styles.name}>紫金产品</span>
            <div className={styles.Progressbox}>
              <Progress percent={this.handleDataShadow(29034)} showInfo={false} status="active" />
            </div>
            <span className={styles.num}>29034</span>
          </div>
          <div className={styles.productItem}>
            <span className={styles.name}>OTC</span>
            <div className={styles.Progressbox}>
              <Progress percent={this.handleDataShadow(104970)} showInfo={false} status="active" />
            </div>
            <span className={styles.num}>104970</span>
          </div>
        </div>
      </div>
    );
  }
}

