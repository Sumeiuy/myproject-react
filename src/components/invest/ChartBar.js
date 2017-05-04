/**
 * @fileOverview components/invest/ChartBar.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import createG2 from 'g2-react';

import { autobind } from 'core-decorators';

import { iconTypeMap } from '../../config';
import Icon from '../common/Icon';
import styles from './ChartBar.less';


const Chart = createG2((chart) => {
  chart.axis('name', {
    labels: {
      autoRotate: true, // 文本是否允许自动旋转
      label: {
        textAlign: 'center', // 文本对齐方向，可取值为： left center right
        fill: '#404040', // 文本的颜色
        fontSize: '12', // 文本大小
      },
    },
    title: null,
  });
  chart.coord('rect').transpose();
  chart.interval().position('name*value');
  chart.render();
});

export default class ChartBar extends PureComponent {

  static propTypes = {
    chartData: PropTypes.object,
    iconType: PropTypes.string,
  }

  static defaultProps = {
    chartData: {},
    iconType: 'zichan',
  }

  constructor(props) {
    super(props);
    this.state = {
      seeChart: true,
      width: 200,
      height: 290,
      plotCfg: {
        margin: [0, 30, 30, 40],
      },
      forceFit: true,
    };
  }

  @autobind
  getChartData(data, key) {
    const yAxisLabels = [];
    data.forEach(item => yAxisLabels.push(item[key]));
    return yAxisLabels;
  }

  @autobind
  handleClickSeeChart() {
    const { seeChart } = this.state;
    this.setState({
      seeChart: !seeChart,
    });
  }

  @autobind
  seeChart(see) {
    if (see) {
      return (
        <Icon
          type="xianshi"
          style={{
            color: '#6f7e96',
          }}
          onClick={this.handleClickSeeChart}
        />
      );
    }
    return (
      <Icon
        type="hide"
        style={{
          color: '#bbbbbb',
        }}
        onClick={this.handleClickSeeChart}
      />
    );
  }

  render() {
    const { chartData: { title, icon, data = [] } } = this.props;
    const { seeChart } = this.state;
    console.log(data);
    // 此处为y轴刻度值
    // const yAxisLabels = this.getChartData(data, 'name');
    // // 此处为数据
    // const seriesData = this.getChartData(data, 'value');
    // const seriesDataLen = seriesData.length;
    // // 数据中最大的值
    // const xMax = Math.max(...seriesData);
    // // 图表边界值
    // const gridXAxisMax = xMax * 1.1;

    return (
      <div>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <Icon type={iconTypeMap[icon]} className={styles.chartTiltleTextIcon} />
            <span className={styles.chartTitleText}>{title}</span>
          </div>
          <div className={styles.seeIcon}>
            {this.seeChart(seeChart)}
          </div>
        </div>
        <div className={styles.chartWrapper}>
          <Chart
            data={data}
            height={this.state.height}
            plotCfg={this.state.plotCfg}
            forceFit={this.state.forceFit}
          />
        </div>
      </div>
    );
  }
}
