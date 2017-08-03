/**
 * @file customerPool/TradingVolume.js
 *  目标客户池-交易量
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
// import _ from 'lodash';
// import { autobind } from 'core-decorators';
import Icon from '../../components/common/Icon';
import styles from './performanceIndicators.less';

export default class TradingVolume extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  numFormat(num) {
    // 默认传递的数字至少都在万元以上
    let unit = '万元';
    let newNum = num;
    if (newNum !== '--') {
      // 超过1亿
      if (newNum >= 10000) {
        newNum /= 10000;
        unit = '亿元';
      }
      if (newNum > 1000 || newNum < -1000) {
        newNum = parseFloat(newNum).toFixed(1);
      } else if (newNum.toString().indexOf('.') > 0 && newNum.toString().split('.')[1].length > 1) {
        newNum = parseFloat(newNum).toFixed(2);
      }
      return (
        <div className="numLabel">
          {newNum}
          <span className="unit">{unit}</span>
        </div>
      );
    }
    return (
      <div className="numLabel">
        {'--'}
      </div>
    );
  }

  render() {
    const { data } = this.props;
    const {
      purRakeGjpdt,
      purAddCustaset,
      tranAmtBasicpdt,
      tranAmtTotpdt,
    } = data;
    return (
      <div className={styles.indexItemBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <Icon type="jiaoyiliang" />交易量（万）
                    </div>
          <div className={`${styles.content} ${styles.jyContent}`}>
            <ul>
              <li>
                <p>{purAddCustaset || '--'}</p>
                <div>净新增客户资产</div>
              </li>
              <li>
                <p>{tranAmtBasicpdt || '--'}</p>
                <div>累计基础交易量</div>
              </li>
              <li>
                <p>{tranAmtTotpdt || '--'}</p>
                <div>累计综合交易量</div>
              </li>
              <li>
                <p>{purRakeGjpdt || '--'}</p>
                <div>股基累计净佣金</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
