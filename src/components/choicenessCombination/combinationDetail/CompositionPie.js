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
  }

  constructor(props) {
    super(props);
    this.state = {
      // 时间默认值
      time: '',
    };
  }

  render() {
    const { data } = this.props;
    const newData = data.map((item) => {
      const newItem = { ...item };
      newItem.oldName = newItem.name;
      newItem.name = `${newItem.name},${newItem.value},${newItem.number}`;
      return newItem;
    });

    const labelArray = _.map(newData, 'name');
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const { data: { oldName, value, number } } = params;
          return `<span style="margin-right: 20px">${oldName}</span><span style="margin-right: 20px">${value}%</span>       ${number}`;
        },
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        icon: 'circle',
        right: 0,
        top: 10,
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
              width: 70,
            },
            percent: {
              width: 40,
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
          radius: ['30%', '40%'],
          center: [70, 100],
          avoidLabelOverlap: false,
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
                fontSize: '16',
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
            height: '330px',
            marginTop: '15px',
          }}
        />
      </div>
    );
  }
}
