/**
 * @Description: 组合构成
 * @Author: Liujianshu
 * @Date: 2018-05-09 15:17:47
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-11 09:24:14
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';

import CompositionPie from './CompositionPie';
import CompositionTable from './CompositionTable';
import styles from './composition.less';

export default class Composition extends PureComponent {
  static propTypes = {
    pieData: PropTypes.array.isRequired,
    tableData: PropTypes.array.isRequired,
  }

  render() {
    const { pieData, tableData } = this.props;
    return (
      <div className={styles.composition}>
        <h2 className={styles.title}>组合构成</h2>
        <div className={styles.left}>
          {/* 雷达图 */}
          <CompositionPie data={pieData} />
        </div>
        <div className={styles.right}>
          {/* 表格 */}
          <CompositionTable data={tableData} />
        </div>
      </div>
    );
  }
}
