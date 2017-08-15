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
      unit: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: preData } = this.props;
    const { data: nextData } = nextProps;
    const { purAddCustaset: prePurAddCustaset } = preData;
    const { purAddCustaset: nextPurAddCustaset,
      purRakeGjpdt, tranAmtBasicpdt, tranAmtTotpdt } = nextData;
    if (prePurAddCustaset !== nextPurAddCustaset) {
      const data = [nextPurAddCustaset, purRakeGjpdt, tranAmtBasicpdt, tranAmtTotpdt];
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
      if (newNum >= 10000) {
        unit = MILLION;
      } else if (newNum >= 100000000) {
        unit = BILLION;
      }
    }
    return unit;
  }

  @autobind
  numFormat(num) {
    const { unit } = this.state;
    let newNum;
    if (num !== '--') {
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
      return (
        { newNum }
      );
    }
    return '--';
  }

  render() {
    const { data } = this.props;
    const {
      purRakeGjpdt,
      purAddCustaset,
      tranAmtBasicpdt,
      tranAmtTotpdt,
    } = data;
    const { unit } = this.state;
    return (
      <div className={styles.indexItemBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <Icon type="jiaoyiliang" />交易量（{unit}元）
                    </div>
          <div className={`${styles.content} ${styles.jyContent}`}>
            <ul>
              <li>
                <p>{this.numFormat(purAddCustaset || '--')}</p>
                <div>净新增客户资产</div>
              </li>
              <li>
                <p>{this.numFormat(tranAmtBasicpdt || '--')}</p>
                <div>累计基础交易量</div>
              </li>
              <li>
                <p>{this.numFormat(tranAmtTotpdt || '--')}</p>
                <div>累计综合交易量</div>
              </li>
              <li>
                <p>{this.numFormat(purRakeGjpdt || '--')}</p>
                <div>股基累计净佣金</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
