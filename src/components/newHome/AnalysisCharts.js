/**
 * @file newHome/AnalysisCharts.js
 *  目标客户池-投顾绩效
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import 'echarts-liquidfill';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import logable from '../../decorators/logable';
import ChartContiner from './ChartContainer';
import IECharts from '../IECharts';
import styles from './analysisCharts.less';
import { seperator } from '../../config';
import { number } from '../../helper';
import {
  getCustClassChartData,
  getCustomTypeChartData,
  getMaxCostRateChartData,
  getPftAmtChartData,
  getHoldingChart,
} from './utils';

const chartTitles = [
  {
    title: '客户类型'
  },
  {
    title: '客户性质'
  },
  {
    title: '资产分布（户）'
  },
  {
    title: '盈亏比（百分比）'
  },
  {
    title: '盈亏幅度（万元）'
  },
  {
    title: '持仓分布'
  }
];

// 资产分布的数据源
let totAsetData = [
  {
    name: '1000万元以上',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '10000000',
      maxVal: null,
    },
  },
  {
    name: '500-1000万元',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '5000000',
      maxVal: '10000000',
    },
  },
  {
    name: '100-500万元',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '1000000',
      maxVal: '5000000',
    },
  },
  {
    name: '30-100万元',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '300000',
      maxVal: '1000000',
    },
  },
  {
    name: '0-30万元',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '0',
      maxVal: '300000',
    },
  },
];

export default class PerformanceIndicators extends PureComponent {
  static contextTypes = {
    push: PropTypes.func.isRequired,
  }
  static propTypes = {
    indicators: PropTypes.object.isRequired,
    cycle: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
  }
  state = {
    mouseoverLabelIndex: '',
  }

  @autobind
  @logable({
    type: 'DrillDown',
    payload: {
      name: '$args[0].filterName',
      subtype: '$args[0].name',
    },
  })
  navToCustomerList(item) {
    if(item) {
      const { query: { orgId } } = this.props.location;
      const filterInsideSeperator = seperator.filterInsideSeperator;
      let filterValue = item.filterValue;
      if(_.isArray(item.filterValue)) {
        filterValue = _.join(item.filterValue, seperator.filterValueSeperator);
      }
      const filterItem = `${item.filterId}${filterInsideSeperator}${filterValue}`;
      this.context.push({
        pathname: '/customerPool/list',
        query: {
          filters: filterItem,
          orgId,
          source: 'custIndicator',
        },
      });
    }
  }

  // 客户类型下钻
  @autobind
  handleCustClassChartClick(instance) {
    instance.on('click', (item) => {
      if (item) {
        this.navToCustomerList(item.data);
      }
    });
  }
  //  客户性质下钻
  @autobind
  handleCustomTypeChartClick(instance) {
    instance.on('click', (item) => {
      if(item) {
        this.navToCustomerList(item.data);
      }
    });
  }
  // 总资产下钻
  @autobind
  handleTotAsetChartClick(instance) {
    instance.on('click', (item) => {
      if(item) {
        let data = item.data;
        if (item.componentType === 'yAxis') {
          data = _.find(totAsetData, obj => obj.name === item.value);
        }
        const filterValue = [data.filterValue.minVal, data.filterValue.maxVal];
        this.navToCustomerList({
          ...data,
          filterValue,
        });
      }
    });
    instance.on('mouseover', this.handleMouseover);
    instance.on('mouseout', this.handleMouseout);
  }

  // 总资产y轴名称hover时改变文本颜色
  @autobind
  handleMouseover(arg) {
    if (arg.componentType !== 'yAxis') {
      return;
    }
    this.setState({
      mouseoverLabelIndex: _.findIndex(totAsetData, item => item.name === arg.value),
    });
  }

  // 总资产y轴名称hover时改变文本颜色
  @autobind
  handleMouseout(arg) {
    if (arg.componentType !== 'yAxis') {
      return;
    }
    this.setState({
      mouseoverLabelIndex: '',
    });
  }

  // 盈亏比下钻
  @autobind
  handleMaxCostRateChartClick(instance) {
    instance.on('click', (item) => {
      if (item) {
        const { cycle, location: { query: { cycleSelect } } } = this.props;
        const data = item.data;
        const dateType = cycleSelect || (!_.isEmpty(cycle) ? cycle[0].key : '');
        const filterValue = [dateType, data.filterValue.minVal, data.filterValue.maxVal];
        this.navToCustomerList({
          ...data,
          filterValue,
        });
      }
    });
  }
  // 盈亏幅度下钻
  @autobind
  handlePftAmtChartClick(instance) {
    instance.on('click', (item) => {
      if (item) {
      const { cycle, location: { query: { cycleSelect } } } = this.props;
       const data = item.data;
        const dateType = cycleSelect || (!_.isEmpty(cycle) ? cycle[0].key : '');
        const filterValue = [dateType, data.filterValue.minVal, data.filterValue.maxVal];
        this.navToCustomerList({
          ...data,
          filterValue,
        });
      }
    });
  }

  // 客户类型图表
  renderCustClassChart() {
    const { dataSource, option } = getCustClassChartData(this.props.indicators);
    return (
      <ChartContiner dataSource={chartTitles[0]}>
        <IECharts
          onReady={this.handleCustClassChartClick}
          option={option}
          style={{
            height: '158px',
          }}
          resizable
        />
        <div className={styles.chartLegend}>
          {
            _.map(dataSource, item => (
              <div
                className={styles.legendItem}
                key={item.name}
                onClick={() => this.navToCustomerList(item)}
                >
                <span
                  className={styles.legendColor}
                  style={item.style}
                />
                <span className={styles.legendLabel}>{item.name}</span>
              </div>
            ))
          }
        </div>
      </ChartContiner>
    );
  }
  // 客户性质图表
  renderCustomTypeChart() {
    const { dataSource, option } = getCustomTypeChartData(this.props.indicators);
    return (
      <ChartContiner dataSource={chartTitles[1]}>
        <IECharts
          onReady={this.handleCustomTypeChartClick}
          option={option}
          style={{
            height: '158px',
          }}
          resizable
        />
        <div className={styles.chartLegend}>
          {
            _.map(dataSource, item => (
              <div
                className={styles.legendItem}
                key={item.name}
                onClick={() => this.navToCustomerList(item)}
              >
                <span
                  className={styles.legendColor}
                  style={item.style}
                />
                <span className={styles.legendLabel}>{item.name}</span>
              </div>
            ))
          }
        </div>
      </ChartContiner>
    );
  }
  // 资产分布图表
  renderTotAsetChart() {
    const { indicators } = this.props;
    if (indicators.assetDistribution) {
      let assetData = indicators.assetDistribution.map(item => item.custNum);
      assetData = _.reverse(assetData);
      totAsetData = _.map(totAsetData, (item, index) => ({
        ...item,
        value: assetData[index] || 0,
      }));
    }
    const { mouseoverLabelIndex } = this.state;
    const option = {
      grid: {
        top: '0px',
        bottom: '0px',
        left: '30px',
        right: '30px',
        containLabel: true,
      },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(2, 22, 55, 0.8)',
        padding: 10,
        textStyle: {
          fontSize: 12,
        },
        formatter: (params) => {
          const data = {
            value: number.thousandFormat(params.data.value),
            unit: '人',
          };
          return `${params.data.name} 客户数：${data.value}${data.unit}`;
        }
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        show: false,
      },
      yAxis: {
        type: 'category',
        data: _.map(totAsetData, item => item.name),
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        triggerEvent: true,
        axisLabel: {
          color(v, index) {
            return index === mouseoverLabelIndex ? '#108ee9' : '#8995a5';
          },
        },
      },
      series: [
        {
          type: 'bar',
          label: {
            normal: {
              position: 'right',
              show: true,
              color: '#666',
            }
          },
          data: totAsetData,
          itemStyle: {
            normal: {
              color: '#4ed0f1',
            },
          },
          barWidth: 15,
        },
      ]
    };
    return (
      <ChartContiner dataSource={chartTitles[2]}>
        <IECharts
          option={option}
          onReady={this.handleTotAsetChartClick}
          style={{
            height: '205px',
          }}
          resizable
        />
      </ChartContiner>
    );
  }
  // 盈亏比图表
  renderMaxCostRateChart() {
    const { xAxisLabel, option } = getMaxCostRateChartData(this.props.indicators);
    return (
      <ChartContiner dataSource={chartTitles[3]}>
        <IECharts
          onReady={this.handleMaxCostRateChartClick}
          option={option}
          style={{
            height: '170px',
          }}
          resizable
        />
        <div className={styles.axisLine}/>
        <div className={styles.axisLabel}>
          {
            _.map(xAxisLabel, label => (
              <div className={styles.label}>
                {label}
                <span className={styles.axisStick} />
              </div>
            ))
          }
        </div>
      </ChartContiner>
    );
  }
  // 盈亏幅度图表
  renderPftAmtChart() {
    const { xAxisLabel, option } = getPftAmtChartData(this.props.indicators);
    return (
      <ChartContiner dataSource={chartTitles[4]}>
        <IECharts
          onReady={this.handlePftAmtChartClick}
          option={option}
          style={{
            height: '170px',
          }}
          resizable
        />
        <div className={styles.axisLine} />
        <div className={styles.pftAmtAxisLabel}>
          {
            _.map(xAxisLabel, label => (
              <div className={styles.pftAmtLabel}>
                <span className={styles.pftAmtContent}>{label}</span>
              </div>
            ))
          }
        </div>
      </ChartContiner>
    );
  }
  // 持仓分布图表
  renderHoldingChart() {
    const { dataSource, option } = getHoldingChart(this.props.indicators);
    return (
      <ChartContiner dataSource={chartTitles[5]}>
        <IECharts
          option={option}
          style={{
            height: '144px',
          }}
          resizable
        />
        <div className={styles.holdingchartLegend}>
          {
            _.map(_.slice(dataSource, 0, 4), item => (
              <div className={styles.legendItem} key={item.name}>
                <span
                  className={styles.legendColor}
                  style={item.style}
                />
                <span className={styles.legendLabel}>{item.name}</span>
              </div>
            ))
          }
        </div>
        <div className={styles.holdingchartLegend}>
          {
            _.map(_.slice(dataSource, 4, dataSource.length), item => (
              <div className={styles.legendItem} key={item.name}>
                <span
                  className={styles.legendColor}
                  style={item.style}
                />
                <span className={styles.legendLabel}>{item.name}</span>
              </div>
            ))
          }
        </div>
      </ChartContiner>
    );
  }
  render() {
    const gutter = 18;

    return (
      <div className={styles.indexBox}>
        <div className={styles.listItem}>
          <Row gutter={gutter}>
            <Col span={8}>
              {this.renderCustClassChart()}
            </Col>
            <Col span={8}>
              {this.renderCustomTypeChart()}
            </Col>
            <Col span={8}>
              {this.renderTotAsetChart()}
            </Col>
          </Row>
        </div>
        <div className={styles.listItem}>
          <Row gutter={gutter}>
            <Col span={8}>
              {this.renderMaxCostRateChart()}
            </Col>
            <Col span={8}>
              {this.renderPftAmtChart()}
            </Col>
            <Col span={8}>
              {this.renderHoldingChart()}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
