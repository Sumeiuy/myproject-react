/**
 * @file components/customerPool/ProductSales.js
 *  客户池-产品销售
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Progress } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../../components/common/Icon';
import { getMaxAndMinMoney } from '../chartRealTime/FixNumber';
import styles from './productSales.less';

const MILLION = '万';
const BILLION = '亿';
export default class ProductSales extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      unit: '',
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { data: preData } = this.props;
    const { data: nextData } = nextProps;
    const { fundTranAmt, privateTranAmt, finaTranAmt, otcTranAmt } = nextData;
    if (!_.isEmpty(preData, nextData)) {
      const data = [_.parseInt(fundTranAmt, 10),
        _.parseInt(privateTranAmt, 10),
        _.parseInt(finaTranAmt, 10),
        _.parseInt(otcTranAmt, 10)];
      this.setState({
        unit: this.basicUnit(data),
      });
    }
  }

  // 计算基本单位
  @autobind
  basicUnit(data) {
    let unit = '';
    if (!_.isEmpty(data) && data.length > 0) {
      const newNum = Math.max(...data);
      // 超过1亿
      if (newNum >= 100000000) {
        unit = BILLION;
      } else if (newNum >= 10000) {
        unit = MILLION;
      }
    }
    return unit;
  }

  @autobind
  numFormat(num) {
    const { unit } = this.state;
    let newNum;
    if (num !== '--') {
      newNum = _.parseInt(num, 10);
      if (num === '0') {
        return '0';
      }
      // 超过1万
      if (unit === MILLION) {
        newNum /= 10000;
      }
      // 超过1亿
      if (unit === BILLION) {
        newNum /= 100000000;
      }
      if (newNum > 1000 || newNum < -1000) {
        newNum = parseFloat(newNum).toFixed(1);
      } else if (newNum.toString().indexOf('.') > 0 && newNum.toString().split('.')[1].length > 1) {
        newNum = parseFloat(newNum).toFixed(2);
      }
      return newNum;
    }
    return '--';
  }

  // 换算最大整数
  padFixedMoney(m, method) {
    const money = Math.abs(m);
    const mLength = money.toString().length || 0;
    let value = 0;
    const powm = Math.pow(10, mLength - 1);  // eslint-disable-line
    const addwm = Math.pow(10, mLength - 2);  // eslint-disable-line
    if (mLength > 0 && money >= powm) {
      value = (Math[method](m / powm) * powm) + addwm;
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
    const { fundTranAmt, privateTranAmt, finaTranAmt, otcTranAmt } = data;
    const { unit } = this.state;
    return (
      <div className={styles.indexItemBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <Icon type="chanpinxiaoshou" />产品销售（{unit}元）
          </div>
          <div className={styles.content}>
            <div className={styles.productBox}>
              <div className={styles.product}>
                <div className={styles.productItem}>
                  <span className={styles.name}>公募基金</span>
                  <div className={styles.Progressbox}>
                    <Progress percent={this.handleDataShadow(fundTranAmt || 0)} showInfo={false} status="active" />
                  </div>
                  <span className={styles.num}>{this.numFormat(fundTranAmt || '--')}</span>
                </div>
                <div className={styles.productItem}>
                  <span className={styles.name}>证券投资</span>
                  <div className={styles.Progressbox}>
                    <Progress percent={this.handleDataShadow(privateTranAmt || 0)} showInfo={false} status="active" />
                  </div>
                  <span className={styles.num}>{this.numFormat(privateTranAmt || '--')}</span>
                </div>
                <div className={styles.productItem}>
                  <span className={styles.name}>紫金产品</span>
                  <div className={styles.Progressbox}>
                    <Progress percent={this.handleDataShadow(finaTranAmt || 0)} showInfo={false} status="active" />
                  </div>
                  <span className={styles.num}>{this.numFormat(finaTranAmt || '--')}</span>
                </div>
                <div className={styles.productItem}>
                  <span className={styles.name}>OTC</span>
                  <div className={styles.Progressbox}>
                    <Progress percent={this.handleDataShadow(otcTranAmt || 0)} showInfo={false} status="active" />
                  </div>
                  <span className={styles.num}>{this.numFormat(otcTranAmt || '--')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

