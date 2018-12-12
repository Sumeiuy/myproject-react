/*
 * @Author: yuanhaojie
 * @Date: 2018-12-04 13:54:08
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-12-12 21:18:05
 * @Description: 首页-投顾绩效-图表
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Progress,
} from 'antd';
import { autobind } from 'core-decorators';
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
import oldStyles from './performanceCharts_oldHome.less';

export default class PerformanceCharts extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object.isRequired,
    isNewHome: PropTypes.bool,
  };

  static defaultProps = {
    isNewHome: true,
  };

  // 重点指标
  @autobind
  renderPointIndicator() {
    const { indicators, isNewHome } = this.props;
    const trueStyles = isNewHome ? styles : oldStyles;
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
      <ChartContiner dataSource={{ title: '重点指标' }} isNewHome={isNewHome}>
        <div className={trueStyles.indicatorDetailWrap}>
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
                <div className={trueStyles.mainIndicatorItem} key={item.name}>
                  <div className={trueStyles.indicatorText}>
                    <Tooltip title={item.description} placement="top">
                      {item.name}
                    </Tooltip>
                    <span className={trueStyles.indicatorValue}>
                      {item.formatedValue}
                    </span>
                  </div>
                  <div className={trueStyles.progress}>
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
  @autobind
  renderCustomerAndAsset() {
    const { indicators, isNewHome } = this.props;
    const trueStyles = isNewHome ? styles : oldStyles;
    const customerAndAssets = getValueByResponse(indicators, CUSTOMER_AND_ASSET_CONFIG);
    return (
      <ChartContiner dataSource={{ title: '客户及资产' }} isNewHome={isNewHome}>
        <div className={trueStyles.customerAndAssetWrap}>
          {
            _.map(customerAndAssets, (item, index) => (
              <div className={trueStyles.detail} key={item.name}>
                <div className={trueStyles.value}>
                  {item.formatedValue}
                </div>
                <div className={trueStyles.name}>
                  <Tooltip title={item.description} placement="top">
                    {item.name}
                  </Tooltip>
                </div>
                {
                  index % 2 === 0
                    ? <div className={trueStyles.line} />
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
  @autobind
  renderFinancialProduct() {
    const { indicators, isNewHome } = this.props;
    const trueStyles = isNewHome ? styles : oldStyles;    
    const financialProducts = getValueByResponse(indicators, FINANCIAL_PRODUCT_CONFIG);
    const zdcxPrdt = _.find(financialProducts, { key: 'zdcxPrdt' }); // 重点创新产品
    const allPrdtBuyAmt = _.find(financialProducts, { key: 'allPrdtBuyAmt' }); // 销量总计
    const commonProducts = _.filter(financialProducts,
      product => product.key !== 'zdcxPrdt' && product.key !== 'allPrdtBuyAmt');
    return (
      <ChartContiner dataSource={{ title: '金融产品' }} isNewHome={isNewHome}>
        <div className={trueStyles.financialProductWrap}>
          <div className={trueStyles.main}>
            <div>
              <span className={trueStyles.name}>
                <Tooltip title={allPrdtBuyAmt.description} placement="top">{allPrdtBuyAmt.name}</Tooltip>
              </span>
              <span className={trueStyles.total}>
                {allPrdtBuyAmt.formatedValue}
              </span>
            </div>
            {
              _.map(commonProducts, item => (
                <div className={trueStyles.product} key={item.key}>
                  <span className={trueStyles.name}>
                    <Tooltip title={item.description} placement="top">
                      {item.name}
                    </Tooltip>
                  </span>
                  <span className={trueStyles.value}>
                    {item.formatedValue}
                  </span>
                </div>
              ))
            }
          </div>
          <div className={trueStyles.innovationProduct}>
            <span className={trueStyles.name}>
              <Tooltip title={zdcxPrdt.description} placement="top">{zdcxPrdt.name}</Tooltip>
            </span>
            <span className={trueStyles.value}>
              {zdcxPrdt.formatedValue}
            </span>
          </div>
        </div>
      </ChartContiner>
    );
  }

  // 业务开通（户）
  @autobind
  renderOpenedAccounts() {
    const { indicators, isNewHome } = this.props;
    const trueStyles = isNewHome ? styles : oldStyles;
    const chartStyle = isNewHome ? {
      height: '160px',
      paddingTop: '15px',
    } : {
      height: '135px',
      paddingTop: '10px',
    };
    const openAccounts = getValueByResponse(indicators, OPEN_ACCOUNTS_CONFIG);
    const { option } = getOpenedAccountsChartData(openAccounts);
    return (
      <ChartContiner dataSource={{ title: '业务开通（户）' }} isNewHome={isNewHome}>
        <div className={trueStyles.openAccountsWrap}>
          <IECharts
            option={option}
            style={chartStyle}
            resizable
          />
          <div className={trueStyles.labels}>
            {
              _.map(openAccounts, item => (
                <Tooltip title={item.description} placement="top" key={item.name}>
                  <span className={trueStyles.label}>
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
  @autobind
  renderNetIncome() {
    const { indicators, isNewHome } = this.props;
    const trueStyles = isNewHome ? styles : oldStyles;
    const incomes = getValueByResponse(indicators, NET_INCOME_CONFIG);
    const max = _.every(incomes, { formatedValue: EMPTY_VALUE }) // 所有值都为空
      ? 1
      : _.maxBy(incomes, 'value').value / 0.9; // 最大值的百分比认为0.9
    return (
      <ChartContiner dataSource={{ title: '净创收' }} isNewHome={isNewHome}>
        <div className={trueStyles.netIncomeWrap}>
          {
            _.map(incomes, (item) => {
              const percent = item.formatedValue === EMPTY_VALUE
                ? 0
                : _.round(item.value * 100 / max);
              return (
                <div className={trueStyles.incomeItem} key={item.name}>
                  <div className={trueStyles.incomeText}>
                    <Tooltip title={item.description} placement="top">{item.name}</Tooltip>
                    <span className={trueStyles.incomeValue}>
                      {item.formatedValue}
                    </span>
                  </div>
                  <div className={trueStyles.progress}>
                    <Icon
                      type="xiangxia"
                      className={trueStyles.downIcon}
                      style={{ left: `${percent}%` }}
                    />
                    <Progress
                      percent={percent}
                      showInfo={false}
                    />
                    <Icon
                      type="xiangshang"
                      className={trueStyles.upIcon}
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
  @autobind
  renderServiceIndicator() {
    const { indicators, isNewHome } = this.props;
    const trueStyles = isNewHome ? styles : oldStyles;
    const serviceIndicators = getValueByResponse(indicators, SERVICE_INDICATOR_CONFIG);
    return (
      <ChartContiner dataSource={{ title: '服务指标' }} isNewHome={isNewHome}>
        <div className={trueStyles.serviceIndicatorWrap}>
          {
            _.map(serviceIndicators, item => (
              <div className={trueStyles.serviceItem} key={item.name}>
                <div className={trueStyles.serviceText}>
                  <Tooltip title={item.description} placement="top">{item.name}</Tooltip>
                  <div className={trueStyles.number}>
                    {item.formatedValue}
                  </div>
                </div>
                <div className={trueStyles.progress} color={item.color}>
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
    const gutter = this.props.isNewHome ? 18 : 28;
    const trueStyles = this.props.isNewHome ? styles : oldStyles;
    return (
      <div className={trueStyles.indexBox}>
        <div className={trueStyles.listItem}>
          <Row gutter={gutter}>
            <Col span={8}>
              {this.renderPointIndicator()}
            </Col>
            <Col span={8}>
              {this.renderCustomerAndAsset()}
            </Col>
            <Col span={8}>
              {this.renderFinancialProduct()}
            </Col>
          </Row>
        </div>
        <div className={trueStyles.listItem}>
          <Row gutter={gutter}>
            <Col span={8}>
              {this.renderOpenedAccounts()}
            </Col>
            <Col span={8}>
              {this.renderNetIncome()}
            </Col>
            <Col span={8}>
              {this.renderServiceIndicator()}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
