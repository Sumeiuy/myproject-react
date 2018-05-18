/**
 * @Description: 组合构成-雷达图
 * @Author: Liujianshu
 * @Date: 2018-05-09 15:17:47
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-11 18:59:03
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import _ from 'lodash';

import IECharts from '../../IECharts';
import styles from './compositionPie.less';

export default class CompositionPie extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    height: PropTypes.string.isRequired,
  }

  render() {
    const { data, height } = this.props;
    const newData = data.map((item) => {
      const newItem = { ...item };
      const { name, value, number } = newItem;
      newItem.oldName = name;
      // name 为分类名称
      // value 为百分比，取小数点后两位
      const newValue = value.toFixed(2);
      // number 为股票数量，若 name 是现金，则 number 值为 -1，要求不显示
      const newNumber = number === -1 ? '' : number;
      // 将三个参数以逗号拼接起来供 legend 使用
      newItem.name = `${name},${newValue}%,${newNumber}`;
      return newItem;
    });

    const labelArray = _.map(newData, 'name');
    const option = {
      tooltip: {
        trigger: 'item',
        // 参照 legend 参数显示 tooltip
        formatter: (params) => {
          const { data: { oldName, value, number } } = params;
          // value 为百分比，取小数点后两位
          const newValue = value.toFixed(2);
          // number 为股票数量，若 name 是现金，则 number 值为 -1，要求不显示
          const newNumber = number === -1 ? '' : number;
          return `<span style="margin-right: 10px">${oldName}</span>
          <span style="margin-right: 20px">${newValue}%</span>
          ${newNumber}`;
        },
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        icon: 'circle',
        right: 10,
        top: '5%',
        bottom: 20,
        itemWidth: 8,
        itemHeight: 8,
        data: labelArray,
        formatter: (name) => {
          const legendArray = name.split(',');
          return [`{name|${legendArray[0]}}{percent|${legendArray[1]}}{number|${legendArray[2]}}`].join('\n');
        },
        textStyle: {
          rich: {
            name: {
              width: 112,
            },
            percent: {
              width: 56,
            },
            number: {
              width: 20,
            },
          },
        },
      },
      series: [
        {
          name: '组合构成',
          type: 'pie',
          radius: ['40%', '50%'],
          center: [100, 100],
          avoidLabelOverlap: false,
          hoverOffset: 5,
          emphasis: {
            label: {
              show: false,
            },
          },
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              formatter: (params) => {
                const { data: { oldName } } = params;
                return oldName;
              },
              textStyle: {
                fontSize: '14',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: newData,
        },
      ],
      color: ['#23d8f2', '#4897f1', '#756fb8', '#c0bbff', '#a7effa', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
    };

    return (
      <div className={styles.pie}>
        <IECharts
          option={option}
          resizable
          style={{
            height,
            marginTop: '15px',
          }}
        />
      </div>
    );
  }
}
