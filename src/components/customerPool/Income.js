/**
 * @file components/customerPool/Income.js
 *  客户池-收入
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import IECharts from '../IECharts';
import styles from './customerService.less';

export default class Income extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props);
    console.log(props);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  render() {
    const options = {
      tooltip: {
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      color: ['#60c1ea', '#756fb8', '#7d9be0'],
      legend: {
        orient: 'left',
        x: 'right',
        right: 'right',
        data: [
        { name: '个人', icon: 'square' },
        { name: '一般机构', icon: 'square' },
        { name: '产品机构', icon: 'square' },
        { name: '净手续费', icon: 'square' },
        { name: '净佣金', icon: 'square' },
        { name: '净利息', icon: 'square' }],
      },
      series: [
        {
          name: '净收入',
          type: 'pie',
          selectedMode: 'single',
          center: [100, 100],
          radius: ['45%', '60%'],
          color: ['#ffa800', '#f0ce30', '#fa7911'],
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: 335, name: '个人' },
            { value: 679, name: '一般机构' },
            { value: 1548, name: '产品机构' },
          ],
        },
        {
          name: '收入',
          type: 'pie',
          center: [100, 100],
          radius: ['70%', '85%'],
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: 335, name: '净手续费' },
            { value: 310, name: '净佣金' },
            { value: 234, name: '净利息' },
          ],
        },
      ],
    };
    return (
      <div className={styles.serviceBox}>
        <div className={styles.chartBox}>
          <IECharts
            option={options}
            resizable
            style={{
              height: '200px',
              width: '100%',
            }}
          />
        </div>
      </div>
    );
  }
}
