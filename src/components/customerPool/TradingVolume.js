/**
 * @file customerPool/TradingVolume.js
 *  目标客户池-交易量
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Icon from '../../components/common/Icon';
import styles from './performanceIndicators.less';

const MILLION = '万';
const BILLION = '亿';
export default class TradingVolume extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
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

  componentWillReceiveProps(nextProps) {
    const { data: preData } = this.props;
    const { data: nextData } = nextProps;
    const { purAddCustaset: nextPurAddCustaset,
      purRakeGjpdt, tranAmtBasicpdt, tranAmtTotpdt } = nextData;
    if (!_.isEmpty(preData, nextData)) {
      const data = [_.parseInt(nextPurAddCustaset, 10),
        _.parseInt(purRakeGjpdt, 10),
        _.parseInt(tranAmtBasicpdt, 10),
        _.parseInt(tranAmtTotpdt, 10)];
      this.basicUnit(data);
    }
  }

  // 计算基本单位
  @autobind
  basicUnit(data) {
    let unit = '';
    if (!_.isEmpty(data) && data.length > 0) {
      const newNum = Math.min(...data);
      // 超过1亿
      if (newNum >= 10000) {
        unit = MILLION;
      } else if (newNum >= 100000000) {
        unit = BILLION;
      } else {
        unit = MILLION;
      }
    }
    this.setState({
      unit,
      purAddCustaset: this.numFormat(unit, data[0]),
      purRakeGjpdt: this.numFormat(unit, data[1]),
      tranAmtBasicpdt: this.numFormat(unit, data[2]),
      tranAmtTotpdt: this.numFormat(unit, data[3]),
    });
  }

  @autobind
  numFormat(unit, num) {
    let newNum;
    if (num !== '--') {
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
      return newNum;
    }
    return '--';
  }

  render() {
    const {
      unit,
      purRakeGjpdt,
      purAddCustaset,
      tranAmtBasicpdt,
      tranAmtTotpdt,
    } = this.state;
    return (
      <div className={styles.indexItemBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <Icon type="jiaoyiliang" />交易量（{unit}元）
          </div>
          <div className={`${styles.content} ${styles.jyContent}`}>
            <ul>
              <li>
                <p>{purAddCustaset}</p>
                <div>净新增客户资产</div>
              </li>
              <li>
                <p>{tranAmtBasicpdt}</p>
                <div>累计基础交易量</div>
              </li>
              <li>
                <p>{tranAmtTotpdt}</p>
                <div>累计综合交易量</div>
              </li>
              <li>
                <p>{purRakeGjpdt}</p>
                <div>股基累计净佣金</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
