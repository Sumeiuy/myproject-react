/**
 * @file components/customerPool/ProductSales.js
 *  客户池-产品销售
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Progress } from 'antd';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { getMaxAndMinMoney } from '../chartRealTime/FixNumber';
import styles from './productSales.less';

export default class ProductSales extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
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
  @autobind
  handleDataShadow(num) {
    const { data } = this.props;
    const { fundTranAmt = 0, privateTranAmt = 0, finaTranAmt = 0, otcTranAmt = 0 } = data;
    const datas = [];
    datas.push(fundTranAmt, privateTranAmt, finaTranAmt, otcTranAmt);
    const maxAndMin = getMaxAndMinMoney(datas);
    const maxX = this.padFixedMoney(maxAndMin.max, 'ceil');
    const percentage = (num / maxX) * 100;
    return percentage;
  }

  render() {
    const { data } = this.props;
    const { fundTranAmt = 0, privateTranAmt = 0, finaTranAmt = 0, otcTranAmt = 0 } = data;
    return (
      <div className={styles.productBox}>
        <div className={styles.product}>
          <div className={styles.productItem}>
            <span className={styles.name}>公募基金</span>
            <div className={styles.Progressbox}>
              <Progress percent={this.handleDataShadow(fundTranAmt)} showInfo={false} status="active" />
            </div>
            <span className={styles.num}>{fundTranAmt}</span>
          </div>
          <div className={styles.productItem}>
            <span className={styles.name}>证券投资</span>
            <div className={styles.Progressbox}>
              <Progress percent={this.handleDataShadow(privateTranAmt)} showInfo={false} status="active" />
            </div>
            <span className={styles.num}>{privateTranAmt}</span>
          </div>
          <div className={styles.productItem}>
            <span className={styles.name}>紫金产品</span>
            <div className={styles.Progressbox}>
              <Progress percent={this.handleDataShadow(finaTranAmt)} showInfo={false} status="active" />
            </div>
            <span className={styles.num}>{finaTranAmt}</span>
          </div>
          <div className={styles.productItem}>
            <span className={styles.name}>OTC</span>
            <div className={styles.Progressbox}>
              <Progress percent={this.handleDataShadow(otcTranAmt)} showInfo={false} status="active" />
            </div>
            <span className={styles.num}>{otcTranAmt}</span>
          </div>
        </div>
      </div>
    );
  }
}

