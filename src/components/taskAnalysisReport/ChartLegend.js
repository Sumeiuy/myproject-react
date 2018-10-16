/*
 * @Author: zhangjun
 * @Descripter: 图标图例组件
 * @Date: 2018-10-15 11:15:12
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-16 09:08:12
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';

import { data } from '../../helper';

import styles from './chartLegend.less';

export default function ChartLegend(props) {
  const { legendList, className } = props;
  const chartLegendClass = classnames({
    [styles.chartLegend]: true,
    [styles[className]]: !_.isEmpty(className),
  });
  const legendListData = _.map(legendList, item => (
      <div className={styles.legendItem} key={data.uuid()}>
        <div className={styles.customerNumberLegend}>
          <span className={`${styles.icon} ${styles[item.type]}`} style={{background: item.color}}></span>
          <span className={styles.name}>{item.name}</span>
        </div>
      </div>
  ));
  return (
    <div className={chartLegendClass}>
      {legendListData}
    </div>
  );
}

ChartLegend.propTypes = {
  // 图例列表
  legendList: PropTypes.array.isRequired,
  // 父组件传进来的className
  className: PropTypes.string,
};
ChartLegend.defaultProps = {
  className: ''
};
