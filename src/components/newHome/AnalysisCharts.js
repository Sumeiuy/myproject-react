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
import Tooltip from '../common/Tooltip';
import ChartContiner from './ChartContainer';
import IECharts from '../IECharts';
import styles from './analysisCharts.less';
import { seperator } from '../../config';
import { toFixedNum, transformItemUnit } from '../chartRealTime/FixNumber';
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
    title: '盈亏比 ',
    unit: '（X:百分比 Y:户）'
  },
  {
    title: '盈亏幅度 ',
    unit: '（X:万元 Y:户）'
  },
  {
    title: '持仓分布'
  }
];

// 资产分布的数据源
let totAsetData = [
  {
    name: '资产在1000~+∞(不含)万元',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '10000000',
      maxVal: null,
    },
  },
  {
    name: '资产在500~1000(不含)万元',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '5000000',
      maxVal: '10000000',
    },
  },
  {
    name: '资产在100~500(不含)万元',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '1000000',
      maxVal: '5000000',
    },
  },
  {
    name: '资产在30~100(不含)万元',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '300000',
      maxVal: '1000000',
    },
  },
  {
    name: '资产在0~30(不含)万元',
    filterName: '总资产',
    filterId: 'totAset',
    value: 0,
    filterValue: {
      minVal: '0',
      maxVal: '300000',
    },
  },
];

// 持仓分布的数据源
const positionDistribution = [
  {
    type: '公募',
    asset: 0,
  },
  {
    type: '私募',
    asset: 0,
  },
  {
    type: '债券',
    asset: 0,
  },
  {
    type: 'OTC',
    asset: 0,
  },
  {
    type: '紫金',
    asset: 0,
  },
  {
    type: '股票',
    asset: 0,
  },
];

// 机构树选择为-我的客户
const MY_CUSTOMER = 'msm';
const DEFAULT_SHOW_TEXT = '所在部门';
const MY_CUSTOMER_TEXT = '名下';

export default class PerformanceIndicators extends PureComponent {
  static contextTypes = {
    push: PropTypes.func.isRequired,
  }

  static propTypes = {
    indicators: PropTypes.object.isRequired,
    cycle: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location: { query: nextQuery }, location } = nextProps;
    const { location: { query: prevQuery } } = prevState;
    const { orgId: nextOrgId } = nextQuery;
    // url是否发生变化
    const isQueryChange = _.isEqual(nextQuery, prevQuery);
    if (!isQueryChange) {
      if (nextOrgId === MY_CUSTOMER) {
        return {
          location,
          showText: MY_CUSTOMER_TEXT,
        };
      }
      return {
        location,
        showText: DEFAULT_SHOW_TEXT,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const {
      location,
      location: {
        query: {
          orgId = '',
        },
      },
    } = props;
    this.state = {
      location,
      showText: orgId === MY_CUSTOMER ? MY_CUSTOMER_TEXT : DEFAULT_SHOW_TEXT,
    };
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
    if (item) {
      const { query: { orgId } } = this.props.location;
      const filterInsideSeperator = seperator.filterInsideSeperator;
      let filterValue = item.filterValue;
      if (_.isArray(item.filterValue)) {
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
      if (item) {
        this.navToCustomerList(item.data);
      }
    });
  }

  // 总资产下钻
  @autobind
  handleTotAsetChartClick(instance) {
    instance.on('click', (item) => {
      if (item) {
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
    const { showText } = this.state;
    const { dataSource, option } = getCustClassChartData({
      ...this.props.indicators,
      showText,
    });
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
                <Tooltip
                  placement="top"
                  title={showText}
                  content={this.renderToolTip(item)}
                >
                  <span className={styles.legendLabel}>{item.name}</span>
                </Tooltip>
              </div>
            ))
          }
        </div>
      </ChartContiner>
    );
  }

  // 客户性质图表
  renderCustomTypeChart() {
    const { showText } = this.state;
    const { dataSource, option } = getCustomTypeChartData({
      ...this.props.indicators,
      showText,
    });
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
                <Tooltip
                  placement="top"
                  title={showText}
                  content={this.renderToolTip(item)}
                >
                  <span className={styles.legendLabel}>{item.name}</span>
                </Tooltip>
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
    const option = {
      grid: {
        top: '0px',
        bottom: '0px',
        left: '5px',
        right: '34px',
        containLabel: false,
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
          return `${params.data.name}客户：${data.value}${data.unit}`;
        },
      },
      xAxis: {
        type: 'value',
        show: false,
      },
      yAxis: {
        type: 'category',
        data: _.map(totAsetData, item => item.name),
        axisLine: {
          lineStyle: {
            color: '#ddd',
          }
        },
        axisTick: {
          interval: index => (index !== 0),
        }
      },
      series: [
        {
          type: 'bar',
          barWidth: 21,
          label: {
            normal: {
              position: 'right',
              show: true,
              color: '#666',
              formatter: (params) => {
                const item = toFixedNum(params.data.value);
                const data = {
                  value: item.newItem,
                  unit: item.newUnit,
                };
                return `${data.value}${data.unit}`;
              }
            }
          },
          data: totAsetData,
          itemStyle: {
            normal: {
              color: '#1ac4f8',
            },
          },
        },
      ]
    };
    return (
      <div className={styles.chartContainer}>
        <ChartContiner dataSource={chartTitles[2]} margin>
          <IECharts
            option={option}
            onReady={this.handleTotAsetChartClick}
            style={{
              height: '160px',
            }}
            resizable
          />
        </ChartContiner>
        <div className={styles.unitContent}>（万元）</div>
        <div className={styles.axisLabel}>
          <span>0</span>
          <span>30</span>
          <span>100</span>
          <span>500</span>
          <span>1000</span>
        </div>
      </div>
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
        <div className={styles.axisLine} />
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
  @autobind
  renderHoldingChart() {
    const { indicators: { holdingDistribution = [] } } = this.props;
    let newHoldingDistribution = [...holdingDistribution];
    if (_.isEmpty(newHoldingDistribution)) {
      newHoldingDistribution = positionDistribution;
    }
    const option = getHoldingChart(newHoldingDistribution);
    return (
      <ChartContiner dataSource={chartTitles[5]}>
        <IECharts
          className={styles.positionContain}
          option={option}
          style={{
            height: '144px',
          }}
          resizable
        />
      </ChartContiner>
    );
  }

  // 获取客户性质，客户类型的tooltip内容
  @autobind
  renderToolTip(item) {
    const {
      showAssetRate = '',
      showCustNumRate = '',
    } = item;
    const assetData = transformItemUnit(item.asset);
    const showCustNumLabel = showCustNumRate ? `，占比${showCustNumRate}` : '';
    const showAssetLabel = showAssetRate ? `，占比${showAssetRate}` : '';
    return (
      <div>
        <div>
          {item.name}
          客户：
          {number.thousandFormat(item.custNum)}
          人
          {showCustNumLabel}
        </div>
        <div>
          {item.name}
          客户托管总资产：
          {assetData.newItem}
          {assetData.newUnit}
          {showAssetLabel}
        </div>
      </div>
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
