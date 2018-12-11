/*
 * @Author: yuanhaojie
 * @Date: 2018-12-04 13:54:08
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-12-11 18:09:36
 * @Description: 首页-投顾绩效-图表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Progress,
} from 'antd';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import ChartContiner from './ChartContainer';
import Icon from '../common/Icon';
import IECharts from '../IECharts';
import Tooltip from '../common/Tooltip';
import {
  getOpenedAccountsChartData,
} from './utils';
import {
  EMPTY_VALUE,
  POINT_INDICATORS_CONFIG,
  CUSTOMER_AND_ASSET_CONFIG,
  FINANCIAL_PRODUCT_CONFIG,
  OPEN_ACCOUNTS_CONFIG,
  NET_INCOME_CONFIG,
  SERVICE_INDICATOR_CONFIG,
  getValueByResponse,
} from './chartsConfig';
import styles from './performanceCharts.less';

export default class PerformanceCharts extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object.isRequired,
  };

  // 重点指标
  renderPointIndicator(indicators) {
    const pointIndicators = getValueByResponse(indicators, POINT_INDICATORS_CONFIG);

    const countList = _.filter(pointIndicators, ['isAsset', false]);
    const maxCount = _.every(countList, { formatedValue: EMPTY_VALUE }) // 所有值都为空
      ? 1
      : _.maxBy(countList, 'value').value / 0.9; // 最大值的百分比认为0.9

    const assetList = _.filter(pointIndicators, 'isAsset');
    const maxAsset = _.every(assetList, { formatedValue: EMPTY_VALUE }) // 所有值都为空
      ? 1
      : _.maxBy(assetList, 'value').value / 0.9; // 最大值的百分比认为0.9

    return (
      <ChartContiner dataSource={{ title: '重点指标' }}>
        <div className={styles.indicatorDetailWrap}>
          {
            _.map(pointIndicators, (item) => {
              let percent;
              if (item.formatedValue === EMPTY_VALUE) {
                percent = 0;
              } else {
                percent = item.isAsset
                  ? _.round(item.value * 100 / maxAsset)
                  : _.round(item.value * 100 / maxCount);
              }
              return (
                <div className={styles.mainIndicatorItem} key={item.name}>
                  <div className={styles.indicatorText}>
                    <Tooltip title={item.description} placement="top">
                      {item.name}
                    </Tooltip>
                    <span className={styles.indicatorValue}>
                      {item.formatedValue}
                    </span>
                  </div>
                  <div className={styles.progress}>
                    <Progress
                      percent={percent}
                      showInfo={false}
                      strokeWidth={4}
                      strokeColor="#42d7ff"
                    />
                  </div>
                </div>
              );
            })
          }
        </div>
      </ChartContiner>
    );
  }

  // 客户及资产
  renderCustomerAndAsset(indicators) {
    const customerAndAssets = getValueByResponse(indicators, CUSTOMER_AND_ASSET_CONFIG);
    return (
      <ChartContiner dataSource={{ title: '客户及资产' }}>
        <div className={styles.customerAndAssetWrap}>
          {
            _.map(customerAndAssets, (item, index) => (
              <div className={styles.detail} key={item.name}>
                <div className={styles.value}>
                  {item.formatedValue}
                </div>
                <div className={styles.name}>
                  <Tooltip title={item.description} placement="top">
                    {item.name}
                  </Tooltip>
                </div>
                {
                  index % 2 === 0
                    ? <div className={styles.line} />
                    : null
                }
              </div>
            ))
          }
        </div>
      </ChartContiner>
    );
  }

  // 金融产品
  renderFinancialProduct(indicators) {
    const financialProducts = getValueByResponse(indicators, FINANCIAL_PRODUCT_CONFIG);
    const zdcxPrdt = _.find(financialProducts, { key: 'zdcxPrdt' }); // 重点创新产品
    const allPrdtBuyAmt = _.find(financialProducts, { key: 'allPrdtBuyAmt' }); // 销量总计
    const commonProducts = _.filter(financialProducts,
      product => product.key !== 'zdcxPrdt' && product.key !== 'allPrdtBuyAmt');
    return (
      <ChartContiner dataSource={{ title: '金融产品' }}>
        <div className={styles.financialProductWrap}>
          <div className={styles.main}>
            <div>
              <span className={styles.name}>
                <Tooltip title={allPrdtBuyAmt.description} placement="top">{allPrdtBuyAmt.name}</Tooltip>
              </span>
              <span className={styles.total}>
                {allPrdtBuyAmt.formatedValue}
              </span>
            </div>
            {
              _.map(commonProducts, item => (
                <div className={styles.product} key={item.key}>
                  <span className={styles.name}>
                    <Tooltip title={item.description} placement="top">
                      {item.name}
                    </Tooltip>
                  </span>
                  <span className={styles.value}>
                    {item.formatedValue}
                  </span>
                </div>
              ))
            }
          </div>
          <div className={styles.innovationProduct}>
            <span className={styles.name}>
              <Tooltip title={zdcxPrdt.description} placement="top">{zdcxPrdt.name}</Tooltip>
            </span>
            <span className={styles.value}>
              {zdcxPrdt.formatedValue}
            </span>
          </div>
        </div>
      </ChartContiner>
    );
  }

  // 业务开通（户）
  renderOpenedAccounts(indicators) {
    const openAccounts = getValueByResponse(indicators, OPEN_ACCOUNTS_CONFIG);
    const { option } = getOpenedAccountsChartData(openAccounts);
    return (
      <ChartContiner dataSource={{ title: '业务开通（户）' }}>
        <div className={styles.openAccountsWrap}>
          <IECharts
            option={option}
            style={{
              height: '160px',
              paddingTop: '15px',
            }}
            resizable
          />
          <div className={styles.labels}>
            {
              _.map(openAccounts, item => (
                <Tooltip title={item.description} placement="top" key={item.name}>
                  <span className={styles.label}>
                    {item.name}
                  </span>
                </Tooltip>
              ))
            }
          </div>
        </div>
      </ChartContiner>
    );
  }

  // 净创收
  renderNetIncome(indicators) {
    const incomes = getValueByResponse(indicators, NET_INCOME_CONFIG);
    const max = _.every(incomes, { formatedValue: EMPTY_VALUE }) // 所有值都为空
      ? 1
      : _.maxBy(incomes, 'value').value / 0.9; // 最大值的百分比认为0.9
    return (
      <ChartContiner dataSource={{ title: '净创收' }}>
        <div className={styles.netIncomeWrap}>
          {
            _.map(incomes, (item) => {
              const percent = item.formatedValue === EMPTY_VALUE
                ? 0
                : _.round(item.value * 100 / max);
              return (
                <div className={styles.incomeItem} key={item.name}>
                  <div className={styles.incomeText}>
                    <Tooltip title={item.description} placement="top">{item.name}</Tooltip>
                    <span className={styles.incomeValue}>
                      {item.formatedValue}
                    </span>
                  </div>
                  <div className={styles.progress}>
                    <Icon
                      type="xiangxia"
                      className={styles.downIcon}
                      style={{ left: `${percent}%` }}
                    />
                    <Progress
                      percent={percent}
                      showInfo={false}
                    />
                    <Icon
                      type="xiangshang"
                      className={styles.upIcon}
                      style={{ left: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })
          }
        </div>
      </ChartContiner>
    );
  }

  // 服务指标
  renderServiceIndicator(indicators) {
    const serviceIndicators = getValueByResponse(indicators, SERVICE_INDICATOR_CONFIG);
    return (
      <ChartContiner dataSource={{ title: '服务指标' }}>
        <div className={styles.serviceIndicatorWrap}>
          {
            _.map(serviceIndicators, item => (
              <div className={styles.serviceItem} key={item.name}>
                <div className={styles.serviceText}>
                  <Tooltip title={item.description} placement="top">{item.name}</Tooltip>
                  <div className={styles.number}>
                    {item.formatedValue}
                  </div>
                </div>
                <div className={styles.progress} color={item.color}>
                  <Progress
                    percent={item.formatedValue === EMPTY_VALUE ? 0 : item.value}
                    showInfo={false}
                    type="circle"
                    width={39}
                    strokeWidth={16}
                    strokeLinecap="square"
                  />
                </div>
              </div>
            ))
          }
        </div>
      </ChartContiner>
    );
  }

  render() {
    const gutter = 18;
    const {
      indicators,
    } = this.props;
    return (
      <div className={styles.indexBox}>
        <div className={styles.listItem}>
          <Row gutter={gutter}>
            <Col span={8}>
              {this.renderPointIndicator(indicators)}
            </Col>
            <Col span={8}>
              {this.renderCustomerAndAsset(indicators)}
            </Col>
            <Col span={8}>
              {this.renderFinancialProduct(indicators)}
            </Col>
          </Row>
        </div>
        <div className={styles.listItem}>
          <Row gutter={gutter}>
            <Col span={8}>
              {this.renderOpenedAccounts(indicators)}
            </Col>
            <Col span={8}>
              {this.renderNetIncome(indicators)}
            </Col>
            <Col span={8}>
              {this.renderServiceIndicator(indicators)}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
