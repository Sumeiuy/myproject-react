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
        orient: 'vertical',
        x: 'bottom',
        data: ['个人', '一般机构', '产品机构', '净手续费', '净佣金', '净利息'],
      },
      series: [
        {
          name: '净收入',
          type: 'pie',
          selectedMode: 'single',
          radius: ['45%', '60%'],
          color: ['#ffa800', '#f0ce30', '#fa7911'],
          label: {
            normal: {
              position: 'center',
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
          radius: ['70%', '85%'],

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
