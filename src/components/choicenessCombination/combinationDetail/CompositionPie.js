/**
 * @Description: 组合构成-雷达图
 * @Author: Liujianshu
 * @Date: 2018-05-09 15:17:47
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-11 09:24:01
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import _ from 'lodash';

import IECharts from '../../IECharts';
import styles from './compositionPie.less';

export default class CompositionPie extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
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
    // const newData = data.map((item) => {
    //   const newItem = { ...item };
    //   newItem.label = {
    //     normal: {
    //       formatter: [
    //         `{title}${newItem.name}${newItem.value}`,
    //       ].join('\n'),
    //       backgroundColor: '#eee',
    //       borderColor: '#777',
    //       borderWidth: 1,
    //       borderRadius: 4,
    //       rich: {
    //         title: {
    //           color: '#eee',
    //           align: 'center',
    //         },
    //       },
    //     },
    //   };
    //   return newItem;
    // });

    const labelArray = _.map(data, 'name');
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const { data: { name, number }, percent } = params;
          return `分类名称：${name}<br />持仓占比：${percent}%<br />证券数：${number}`;
        },
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        icon: 'circle',
        right: 15,
        top: 10,
        itemWidth: 8,
        itemHeight: 8,
        data: labelArray,
      },
      series: [
        {
          name: '组合构成',
          type: 'pie',
          radius: ['45%', '55%'],
          center: [90, 100],
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
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
          data,
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
