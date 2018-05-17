/**
 * @Description: 组合构成
 * @Author: Liujianshu
 * @Date: 2018-05-09 15:17:47
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-11 09:24:14
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { dom } from '../../../helper';
import CompositionPie from './CompositionPie';
import CompositionTable from './CompositionTable';
import styles from './composition.less';

// 容器要设置的最小高度
const MINI_HEIGHT = '0';
export default class Composition extends PureComponent {
  static propTypes = {
    pieData: PropTypes.array.isRequired,
    tableData: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      height: MINI_HEIGHT,
    };
  }

  componentDidUpdate() {
    const { pieData, tableData } = this.props;
    if (this.tableDiv && !_.isEmpty(tableData) && !_.isEmpty(pieData)) {
      const height = dom.getCssStyle(this.tableDiv, 'height');
      this.changeState(height);
    }
  }

  @autobind
  changeState(value) {
    this.setState({
      height: value,
    });
  }

  render() {
    const { pieData, tableData } = this.props;
    const { height } = this.state;
    return (
      <div className={styles.composition}>
        <h2 className={styles.title}>组合构成</h2>
        <div className={styles.left}>
          {/* 雷达图 */}
          <CompositionPie data={pieData} height={height} />
        </div>
        <div className={styles.right} ref={(ref) => { this.tableDiv = ref; }}>
          {/* 表格 */}
          <CompositionTable data={tableData} />
        </div>
      </div>
    );
  }
}
