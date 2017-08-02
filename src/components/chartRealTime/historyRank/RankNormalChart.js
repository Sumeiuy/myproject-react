/**
 * @description 历史对比普通图表
 * @author sunweibin
 */
import React, { PropTypes, PureComponent } from 'react';
import { Icon } from 'antd';

import IECharts from '../../IECharts';
import { barColor, yAxis, xAxis, grid, /* itemInfo, */ barShadow } from './rankChartGeneralConfig';
import styles from './RankChart.less';

export default class RankNormalChart extends PureComponent {
  static propTypes = {
    chartData: PropTypes.array.isRequired,
    level: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
  };

  // constructor(props) {
  //   super(props);
  // }

  render() {
    // 普通视图配置项
    // TODO 当最小值和最大值是相同单位的时候，需要做特殊处理
    const options = {
      color: [barColor],
      tooltip: {
        show: true,
      },
      grid: {
        ...grid,
      },
      xAxis: {
        ...xAxis,
        max: 100,
        min: -10,
      },
      yAxis: {
        ...yAxis,
      },
      series: [
        {
          ...barShadow,
          name: 'y',
          stack: 'label',
          label: {
            normal: {
              show: true,
              position: 'insideLeft',
              textStyle: {
                color: '#434f62',
              },
            },
          },
          data: [-10, -10, -10, -10, -10, -10, -10, -10, -10, -10],
        },
        {
          ...barShadow,
          name: 'v',
          stack: 'label',
          label: {
            normal: {
              show: true,
              position: 'insideRight',
              textStyle: {
                color: '#999',
              },
            },
          },
          data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        },
        {
          name: 'test',
          type: 'bar',
          silent: true,
          label: {
            normal: {
              show: false,
            },
          },
          data: [-10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        },
      ],
    };
    return (
      <div className={styles.rankChart}>
        {/* 排名序号,以及名次变化 */}
        <div className={styles.ranking}>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>1</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>3名</span>
          </div>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>2</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>31名</span>
          </div>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>3</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>131名</span>
          </div>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>4</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>3名</span>
          </div>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>5</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>3名</span>
          </div>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>6</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>3名</span>
          </div>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>7</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>3名</span>
          </div>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>8</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>3名</span>
          </div>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>9</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>3名</span>
          </div>
          <div className={styles.rankNumberAndChange}>
            <span className={styles.rankNumber}>101</span>
            <span className={styles.rankUp}><Icon type="arrow-up" /></span>
            <span className={styles.rankChange}>3名</span>
          </div>
        </div>
        <div className={styles.rankingchart}>
          <IECharts
            option={options}
            resizable
            style={{
              height: '360px',
            }}
          />
        </div>
      </div>
    );
  }
}
