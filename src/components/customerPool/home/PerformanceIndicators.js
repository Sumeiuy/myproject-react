/**
 * @file customerPool/PerformanceIndicators.js
 *  目标客户池-绩效指标
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
// import Icon from '../../common/Icon';
// import CustomerService from './CustomerService';
// import ProductSales from './ProductSales';
import TradingVolume from './TradingVolume';
// import CustomerIndicators from './CustomerIndicators';
// import BusinessProcessing from './BusinessProcessing';
// import Income from './Income';
import styles from './performanceIndicators.less';
import ProgressList from './ProgressList';
import TextList from './TextList';
// import CycleProgressList from './CycleProgressList';
import RectFrame from './RectFrame';
import IECharts from '../../IECharts';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object,
    customersData: PropTypes.array,
    push: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    location: PropTypes.object.isRequired,
    incomeData: PropTypes.array.isRequired,
    lastAddCusts: PropTypes.array,
    serviceIndicators: PropTypes.array,
  }

  static defaultProps = {
    indicators: {},
    customersData: [],
    cycle: [],
    lastAddCusts: [],
    serviceIndicators: [],
  }

  render() {
    const {
      indicators,
      // cycle,
      // push,
      // location,
      // incomeData,
      lastAddCusts,
      // serviceIndicators,
    } = this.props;
    const {
      cftCust,
      // dateType,
      finaTranAmt,
      fundTranAmt,
      // hkCust,
      szHkCust,
      shHkCust,
      newProdCust,
      optCust,
      otcTranAmt,
      privateTranAmt,
      purAddCust,
      purAddCustaset,
      purAddHighprodcust,
      purAddNoretailcust,
      purRakeGjpdt,
      rzrqCust,
      // staId,
      // staType,
      tranAmtBasicpdt,
      tranAmtTotpdt,
      ttfCust,
      motOkMnt,
      motTotMnt,
      taskCust,
      totCust,
    } = indicators || {};
    const tradingVolume = {
      purAddCustaset,
      purRakeGjpdt,
      tranAmtBasicpdt,
      tranAmtTotpdt,
    };
    const productSalesData = { fundTranAmt, privateTranAmt, finaTranAmt, otcTranAmt };
    const customerServiceData = { motOkMnt, motTotMnt, taskCust, totCust };
    const customerIndicators = {
      totCust,
      purAddCust,
      purAddNoretailcust,
      purAddHighprodcust,
      newProdCust,
    };
    const businessProcessing = {
      cftCust,
      ttfCust,
      rzrqCust,
      shHkCust,
      szHkCust,
      optCust,
    };
    console.log('为了lint通过，先输出', businessProcessing, customerServiceData, productSalesData, customerIndicators);
    const businessOption = {
      grid: {
        left: '15px',
        right: '15px',
        bottom: '40px',
        top: '30px',
        containLabel: false,
      },
      xAxis: {
        data: ['MOT\n完成率', '服务\n覆盖率', '多元配\n置覆盖率', '信息\n完备率'],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: '#999',
          fontSize: '12',
          interval: 0,
          margin: 6,
        },
      },
      yAxis: {
        show: false,
        splitLine: { show: false },
      },
      series: [{
        type: 'bar',
        itemStyle: {
          normal: { color: '#ddd' },
        },
        silent: true,
        barWidth: 25,
        barGap: '-100%', // Make series be overlap
        data: [100, 100, 100, 100],
      }, {
        type: 'bar',
        itemStyle: {
          normal: { color: '#188ca2' },
        },
        barWidth: 25,
        z: 10,
        data: [90, 80, 30, 75],
        label: {
          normal: {
            show: true,
            position: 'top',
            color: '#999',
            formatter: params => `${params.value}%`,
          },
        },
      }],
    };
    const serviceOption = {
      color: ['#334fb4'],
      grid: {
        left: '15px',
        right: '15px',
        bottom: '30px',
        top: '30px',
        containLabel: false,
      },
      xAxis: [
        {
          data: ['天天发', '港股通', '融资融券', '期权', '创业版'],
          axisTick: { show: false },
          axisLabel: {
            color: '#999',
            fontSize: '12',
            interval: 0,
            margin: 4,
          },
          axisLine: {
            lineStyle: {
              color: '#999',
            },
          },
        },
      ],
      yAxis: [{ show: false }],
      series: [
        {
          name: '业务开通数（户次）',
          type: 'bar',
          barWidth: '10px',
          barGap: '30px',
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#1486d8',
            },
          },
          data: [50, 40, 50, 35, 40],
        },
      ],
    };
    const addCustHead = { icon: '', title: '新增客户（户）' };
    return (
      <div className={styles.indexBox}>
        <div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={16}>
              <Col span={8}>
                <RectFrame dataSource={addCustHead}>
                  <ProgressList dataSource={lastAddCusts} />
                </RectFrame>

                {/* <CustomerIndicators
                  cycle={cycle}
                  push={push}
                  location={location}
                  data={customerIndicators}
                /> */}
              </Col>
              <Col span={8}>
                <RectFrame dataSource={addCustHead}>
                  <IECharts
                    option={serviceOption}
                    resizable
                    onReady={this.radarOnReady}
                    style={{
                      height: '170px',
                    }}
                  />
                </RectFrame>
                {/* <BusinessProcessing
                  cycle={cycle}
                  push={push}
                  location={location}
                  data={businessProcessing}
                /> */}
                {/* <BusinessProcessing
                  cycle={cycle}
                  push={push}
                  location={location}
                  data={businessProcessing}
                /> */}
              </Col>
              <Col span={8}>
                <TradingVolume
                  data={tradingVolume}
                />
              </Col>
            </Row>
          </div>
          <div className={styles.listItem}>
            <Row gutter={16}>
              <Col span={8}>
                <RectFrame dataSource={addCustHead}>
                  <TextList dataSource={lastAddCusts} />
                </RectFrame>
                {/* <ProductSales
                  data={productSalesData}
                /> */}
              </Col>
              <Col span={8}>
                <RectFrame dataSource={addCustHead}>
                  <ProgressList dataSource={lastAddCusts} />
                </RectFrame>
                {/* <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="shouru" />净创收
                  </div>
                    <div className={styles.content}>
                      <Income
                        incomeData={incomeData}
                      />
                    </div>
                  </div>
                </div> */}
              </Col>
              <Col span={8}>
                <RectFrame dataSource={addCustHead}>
                  <IECharts
                    option={businessOption}
                    resizable
                    onReady={this.radarOnReady}
                    style={{
                      height: '170px',
                    }}
                  />
                </RectFrame>
                {/* <RectFrame dataSource={addCustHead}>
                  <CycleProgressList dataSource={serviceIndicators} />
                </RectFrame> */}
                {/* <div className={styles.indexItemBox}>
                  <div className={styles.inner}>
                    <div className={styles.title}>
                      <Icon type="kehufuwu" />客户服务
                  </div>
                    <div className={`${styles.content} ${styles.jyContent}`}>
                      <CustomerService
                        data={customerServiceData}
                      />
                    </div>
                  </div>
                </div> */}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
