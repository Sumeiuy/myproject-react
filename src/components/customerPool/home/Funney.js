/**
 * @file components/customerPool/home/Funney.js
 * @author zhangjunli
 */
import React, { PropTypes } from 'react';
import _ from 'lodash';

import IECharts from '../../IECharts';
import styles from './funney.less';

function getDataConfig(data) {
  return data.map(item => ({
    value: item.value,
    name: item.name,
    itemStyle: {
      normal: {
        color: item.bgColor,
      },
    },
  }));
}

function renderIntro(data) {
  return _.map(
    data,
    (item, index) => (
      <div className={styles.row} key={`row${index}`}>
        <div className={styles.count1}>{item.value}</div>
        <div className={styles.count2}>{`/${item.property}`}</div>
      </div>
    ),
  );
}

function Funney({ dataSource }) {
  const { data, color, custUnit, propertyUnit } = dataSource;
  const funnelOption = {
    tooltip: {
      trigger: 'item',
      formatter: `{b} : {c} ${custUnit}`,
      position: ['10%', '35%'],
    },
    series: [
      {
        name: '漏斗图',
        type: 'funnel',
        left: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        min: _.last(data).value,
        max: _.head(data).value,
        minSize: '20%',
        maxSize: '100%',
        sort: 'none',
        label: {
          normal: {
            show: true,
            position: 'inside',
            fontSize: 12,
            color,
            fontFamily: 'PingFangSC-Regular',
          },
        },
        itemStyle: {
          normal: {
            borderWidth: 0,
          },
        },
        data: getDataConfig(data),
      },
    ],
  };
  return (
    <div className={styles.container}>
      <div className={styles.uintRow}>{`户数/资产(${propertyUnit})`}</div>
      <div className={styles.content}>
        <div className={styles.left}>
          <IECharts
            option={funnelOption}
            resizable
            style={{
              height: '102px',
            }}
          />
        </div>
        <div className={styles.right}>
          {renderIntro(data)}
        </div>
      </div>
    </div>
  );
}

Funney.propTypes = {
  dataSource: PropTypes.object.isRequired,
};

export default Funney;
