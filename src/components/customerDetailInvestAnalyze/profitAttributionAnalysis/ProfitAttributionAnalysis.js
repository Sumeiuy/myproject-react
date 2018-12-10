/*
 * @Author: zhangjun
 * @Date: 2018-11-27 14:00:51
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-10 09:54:35
 * @description 收益归因分析
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import ToggleOrder from './ToggleOrder';
import CountPeriod from '../CountPeriod';
import InfoTitle from '../InfoTitle';
import AttributionTable from './AttributionTable';
import AttributionChart from './AttributionChart';
import IncomeDetailTable from './IncomeDetailTable';
import IncomeDetailChart from './IncomeDetailChart';
import { data } from '../../../helper';
import styles from './profitAttributionAnalysis.less';

export default class ProfitAttributionAnalysis extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 获取brinson归因分析
    getAttributionAnalysis: PropTypes.func.isRequired,
    // brinson归因数据
    attributionData: PropTypes.object.isRequired,
    // 获取个体收益明细
    getEachStockIncomeDetails: PropTypes.func.isRequired,
    // 个体收益明细
    incomeDetailData: PropTypes.object.isRequired,
  }

  componentDidMount() {
    // 获取brinson归因分析
    this.getAttributionAnalysis();
    // 获取个体收益明细
    this.getEachStockIncomeDetails();
  }

  // 切换排序
  @autobind
  onOrderChange(value) {
    const {
      location: {
        query: {
          custId,
        }
      },
      getEachStockIncomeDetails,
    } = this.props;
    getEachStockIncomeDetails({
      custId,
      order: value,
    });
  }

  // 获取brinson归因分析
  @autobind
  getAttributionAnalysis() {
    const {
      location: {
        query: {
          custId,
        }
      }
    } = this.props;
    this.props.getAttributionAnalysis({ custId });
  }

  // 获取个体收益明细
  @autobind
  getEachStockIncomeDetails() {
    const {
      location: {
        query: {
          custId,
        }
      },
      getEachStockIncomeDetails,
    } = this.props;
    getEachStockIncomeDetails({
      custId,
    });
  }

  // 获取brinson归因描述
  @autobind
  getAttributionSummary() {
    const {
      attributionData: {
        attributionSummary = [],
      }
    } = this.props;
    const attributionSummaryData = _.map(attributionSummary, item => (
      <p key={data.uuid()}>
        <span>{item}</span>
      </p>
    ));
    return attributionSummaryData;
  }

  render() {
    const {
      attributionData: {
        attributionResult = [],
        attributionTrend = [],
      },
      incomeDetailData: {
        stockInfo,
        page,
      },
    } = this.props;
    const incomeDetailChartData = _.map(stockInfo, 'accumulatedProfit');
    const incomeDetailTableData = _.map(stockInfo, item => ({
      stockName: item.stockName,
      stockPeriodUpDown: item.stockPeriodUpDown,
      shareHoldingYield: item.shareHoldingYield,
    }));
    const attributionSummaryData = this.getttributionSummary();
    return (
      <div className={styles.profitAttributionAnalysis}>
        <CountPeriod />
        <InfoTitle title="Brinson归因分析" />
        <div className={styles.attributionAnalysis}>
          <AttributionTable
            attributionResult={attributionResult}
          />
          <AttributionChart
            attributionTrend={attributionTrend}
          />
        </div>
        <div className={styles.attributionTip}>
          <p>该结果由客户三类资产与华泰业绩基准进行Brinson归因计算得出</p>
        </div>
        <div className={styles.attributionSummary}>
          {attributionSummaryData}
        </div>
        <InfoTitle title="个股收益明细" />
        <div className={styles.incomeDetailsTable}>
          <ToggleOrder
            onOrderChange={this.onOrderChange}
          />
          <IncomeDetailTable
            IncomeTableData={incomeDetailTableData}
            page={page}
          />
          <IncomeDetailChart
            incomeChartData={incomeDetailChartData}
          />
          <div className={styles.annotation}>
            <div>
              注：
            </div>
            <div>
              <p>1. 股票期间涨跌报指统计期内基于股票面值的收益率，不含分红收益。</p>
              <p>2. 持股收益率指报告期内客户在该股票上的累计收益率，不含分红收益。</p>
              <p>3. 外币股票均转化为人民币计算。</p>
              <p>4.个股收益明细图可切换排序方式，最多显示10条数据。</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
