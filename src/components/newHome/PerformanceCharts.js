/*
 * @Author: yuanhaojie
 * @Date: 2018-12-04 13:54:08
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-12-05 20:16:50
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
import {
  formatToUnit,
  thousandFormat,
} from '../../helper/number';
import IECharts from '../IECharts';
import {
  getOpenedAccountsChartData,
} from './utils';
import styles from './performanceCharts.less';

export default class PerformanceCharts extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object.isRequired,
  };

  // 重点指标
  renderMainIndicator(indicators) {
    const {
      newEffCust,
      netAddedEffCust,
      newActiveCustNum,
      newCustBuyFinaNum,
      clCustNewAvgAset,
      newAddCustAset,
    } = indicators;
    const mainIndicators = [
      {
        name: '新开客户新增有效户',
        value: (newEffCust && newEffCust.value) || 560,
        isAsset: false,
      },
      {
        name: '净新增有效户',
        value: (netAddedEffCust && netAddedEffCust.value) || 1125,
        isAsset: false,
      },
      {
        name: '新增激活客户数',
        value: (newActiveCustNum && newActiveCustNum.value) || 3879,
        isAsset: false,
      },
      {
        name: '新增金融产品客户数',
        value: (newCustBuyFinaNum && newCustBuyFinaNum.value) || 645,
        isAsset: false,
      },
      {
        name: '存量客户新增日均资产',
        value: (clCustNewAvgAset && clCustNewAvgAset.value) || 187900000000,
        isAsset: true,
      },
      {
        name: '新开客户净新增资产',
        value: (newAddCustAset && newAddCustAset.value) || 387900000000,
        isAsset: true,
      },
    ];
    const maxCount = _.maxBy(_.filter(mainIndicators, ['isAsset', false]), 'value').value / 0.9; // 最大值的百分比认为0.9
    const maxAsset = _.maxBy(_.filter(mainIndicators, 'isAsset'), 'value').value / 0.9;
    return (
      <ChartContiner dataSource={{ title: '重点指标' }}>
        <div className={styles.indicatorDetailWrap}>
          {
            _.map(mainIndicators, (item) => {
              const percent = item.isAsset
                ? _.round(item.value * 100 / maxAsset)
                : _.round(item.value * 100 / maxCount);
              const formatedValue = item.isAsset
                ? formatToUnit({ num: item.value, floatLength: 2 })
                : `${thousandFormat(item.value)}户`;
              return (
                <div className={styles.mainIndicatorItem} key={item.name}>
                  <div className={styles.indicatorText}>
                    {item.name}
                    <span className={styles.indicatorValue}>
                      {formatedValue}
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
    const {
      custNum,
      totAset,
      currSignCustNum,
      currSignCustAset,
      clCustNewAvgAset,
      avgPrdtMktValCreate,
    } = indicators;
    const customerAndAssets = [
      {
        name: '服务客户数',
        value: (custNum && custNum.value) || 21345,
        isAccount: true,
      },
      {
        name: '服务客户资产',
        value: (totAset && totAset.value) || 216700000000,
      },
      {
        name: '签约客户数',
        value: (currSignCustNum && currSignCustNum.value) || 3891,
        isAccount: true,
      },
      {
        name: '签约客户资产',
        value: (currSignCustAset && currSignCustAset.value) || 13242000000,
      },
      {
        name: '存量客户新增日均资产',
        value: (clCustNewAvgAset && clCustNewAvgAset.value) || 3432000000,
      },
      {
        name: '产品日均保有市值',
        value: (avgPrdtMktValCreate && avgPrdtMktValCreate.value) || 34789000000,
      },
    ];
    return (
      <ChartContiner dataSource={{ title: '客户及资产' }}>
        <div className={styles.customerAndAssetWrap}>
          {
            _.map(customerAndAssets, (item, index) => {
              const value = item.isAccount
                ? `${thousandFormat(item.value)}户`
                : `${formatToUnit({ num: item.value, floatLength: 2 })}`;
              return (
                <div className={styles.detail}>
                  <div className={styles.value}>
                    {value}
                  </div>
                  <div title={item.name} className={styles.name}>
                    {item.name}
                  </div>
                  {
                    index % 2 === 0
                      ? <div className={styles.line} />
                      : null
                  }
                </div>
              );
            })
          }
        </div>
      </ChartContiner>
    );
  }

  // 金融产品
  renderFinancialProduct(indicators) {
    const {
      kfTranAmt,
      taTranAmt,
      otcTranAmt,
      smTranAmt,
      zdcxPrdt,
    } = indicators;
    const financialProducts = [
      {
        name: '公募基金',
        value: (kfTranAmt && kfTranAmt.value) || 25890000000,
      },
      {
        name: '紫金产品',
        value: (taTranAmt && taTranAmt.value) || 4350000000,
      },
      {
        name: 'OTC',
        value: (otcTranAmt && otcTranAmt.value) || 139009000000,
      },
      {
        name: '私募基金',
        value: (smTranAmt && smTranAmt.value) || 89098000000,
      },
    ];
    const formatedZdcxPrdt = {
      name: '重点创新产品',
      value: (zdcxPrdt && zdcxPrdt.value) || 1567000000
    };
    const totalValue = _.sumBy(financialProducts, 'value');
    return (
      <ChartContiner dataSource={{ title: '金融产品' }}>
        <div className={styles.financialProductWrap}>
          <div className={styles.main}>
            <div>
              <span className={styles.name}>销量总计</span>
              <span className={styles.total}>
                {formatToUnit({ num: totalValue, floatLength: 2 })}
              </span>
            </div>
            {
              _.map(financialProducts, item => (
                <div className={styles.product}>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.value}>
                    {formatToUnit({ num: item.value, floatLength: 2 })}
                  </span>
                </div>
              ))
            }
          </div>
          <div className={styles.innovationProduct}>
            <span className={styles.name}>{formatedZdcxPrdt.name}</span>
            <span className={styles.value}>
              {formatToUnit({ num: formatedZdcxPrdt.value, floatLength: 2 })}
            </span>
          </div>
        </div>
      </ChartContiner>
    );
  }

  // 业务开通（户）
  @autobind
  renderOpenedAccounts() {
    const { option } = getOpenedAccountsChartData(this.props.indicators);
    return (
      <ChartContiner dataSource={{ title: '业务开通（户）' }}>
        <IECharts
          option={option}
          style={{
            height: '200px',
            paddingTop: '15px',
          }}
          resizable
        />
      </ChartContiner>
    );
  }

  // 净创收
  renderNetIncome(indicators) {
    const {
      dlmmZqIncome, // 代理买卖证券净创收
      prdtPurFee, // 产品净手续费收入
      purInteIncome, // 净利息收入
    } = indicators;
    const incomes = [
      {
        name: '代理买卖证券净创收',
        value: (dlmmZqIncome && dlmmZqIncome.value) || 599030000,
      },
      {
        name: '产品净手续费收入',
        value: (prdtPurFee && prdtPurFee.value) || 51980000,
      },
      {
        name: '净利息收入',
        value: (purInteIncome && purInteIncome.value) || 2980920000,
      },
    ];
    const max = _.maxBy(incomes, 'value').value / 0.9; // 最大值的百分比认为0.9
    return (
      <ChartContiner dataSource={{ title: '净创收' }}>
        <div className={styles.netIncomeWrap}>
          {
            _.map(incomes, (item) => {
              const percent = _.round(item.value * 100 / max);
              return (
                <div className={styles.incomeItem} key={item.name}>
                  <div className={styles.incomeText}>
                    {item.name}
                    <span className={styles.incomeValue}>
                      {formatToUnit({ num: item.value, floatLength: 2 })}
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
    const {
      motCompletePercent,
      serviceCompPercent,
      shzNpRate,
    } = indicators;
    const serviceIndicators = [
      {
        name: '必做MOT完成率',
        value: (motCompletePercent && motCompletePercent.value) || 68,
        color: 'orange',
      },
      {
        name: '服务覆盖率',
        value: (serviceCompPercent && serviceCompPercent.value) || 43,
        color: 'yellow',
      },
      {
        name: '归集率',
        value: (shzNpRate && shzNpRate.value) || 89,
        color: 'red',
      },
    ];
    return (
      <ChartContiner dataSource={{ title: '服务指标' }}>
        <div className={styles.serviceIndicatorWrap}>
          {
            _.map(serviceIndicators, item => (
              <div className={styles.serviceItem}>
                <div className={styles.serviceText}>
                  {item.name}
                  <div className={styles.number}>
                    {item.value}
                    %
                  </div>
                </div>
                <div className={styles.progress} color={item.color}>
                  <Progress
                    percent={item.value}
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
              {this.renderMainIndicator(indicators)}
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
              {this.renderOpenedAccounts()}
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
