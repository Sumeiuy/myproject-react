/**
 * @file customerPool/TradingVolume.js
 *  目标客户池-交易量
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';
import { Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import Icon from '../../common/Icon';
import styles from './performanceIndicators.less';

const MILLION = '万';
const BILLION = '亿';
const EMPTY_OBJECT = {};
export default class TradingVolume extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      unit: MILLION,
      purRakeGjpdt: '--',
      purAddCustaset: '--',
      tranAmtBasicpdt: '--',
      tranAmtTotpdt: '--',
    };
  }

  // 计算基本单位
  @autobind
  basicUnit(data) {
    if (data.length < 1) {
      return '';
    }
    let unit = '';
    const newNum = Math.min(...data);
    // 超过1亿
    if (newNum >= 10000) {
      unit = MILLION;
    } else if (newNum >= 100000000) {
      unit = BILLION;
    } else {
      unit = MILLION;
    }
    return unit;
  }

  @autobind
  numFormat(num) {
    let newNum;
    if (!_.isEmpty(num) && num !== '--') {
      const { data } = this.props;
      const unit = this.basicUnit(data);
      if (num === '0') {
        return '0';
      }
      newNum = _.parseInt(num, 10);
      // 超过1万
      if (unit === MILLION) {
        newNum /= 10000;
      }
      // 超过1亿
      if (unit === BILLION) {
        newNum /= 100000000;
      }
      if (newNum.toString().indexOf('.') > 0 && newNum.toString().split('.')[1].length > 1) {
        newNum = parseFloat(newNum).toFixed(2);
      }
      return (<b title={`${newNum}`}>{newNum}</b>);
    }
    return '--';
  }

  render() {
    const { data } = this.props;
    const {
       purAddCustaset,
      purRakeGjpdt,
      tranAmtBasicpdt,
      tranAmtTotpdt,
    } = data;
    return (
      <div className={styles.indexItemBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <Icon type="jiaoyiliang" />交易量（{this.basicUnit(data)}元）
          </div>
          <div className={`${styles.content} ${styles.jyContent}`}>
            <div className={styles.rowBox}>
              <Row gutter={0}>
                <Col span={13}>
                  <ul>
                    <li>
                      <p>{this.numFormat(purAddCustaset || '--')}</p>
                      <div>净新增客户资产</div>
                    </li>
                  </ul>
                </Col>
                <Col span={11}>
                  <ul>
                    <li className={styles.bd_un_r}>
                      <p>{this.numFormat(tranAmtBasicpdt || '--')}</p>
                      <div>累计基础交易量</div>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row gutter={0} className={styles.bd_un_b}>
                <Col span={13}>
                  <ul>
                    <li>
                      <p>{this.numFormat(tranAmtTotpdt || '--')}</p>
                      <div>累计综合交易量</div>
                    </li>
                  </ul>
                </Col>
                <Col span={11}>
                  <ul>
                    <li className={styles.bd_un_r}>
                      <p>{this.numFormat(purRakeGjpdt || '--')}</p>
                      <div>股基累计净佣金</div>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
