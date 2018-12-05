/*
 * @Author: zhangjun
 * @Date: 2018-11-27 14:00:51
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-05 09:59:03
 * @description 收益归因分析
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import CountPeriod from '../CountPeriod';
import InfoTitle from '../InfoTitle';
import AttributionTable from './AttributionTable';
import AttributionChart from './AttributionChart';
import IncomeDetailsTable from './IncomeDetailTable';
import { data } from '../../../helper';
import styles from './profitAttributionAnalysis.less';

const DEFAULT_PAGENUM = 1;
const DEFAULT_PAGESIZE = 10;
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
      }
    } = this.props;
    this.props.getEachStockIncomeDetails({
      custId,
      pageNum: DEFAULT_PAGENUM,
      pageSize: DEFAULT_PAGESIZE,
    });
  }

  // 获取brinson归因描述
  @autobind
  getttributionSummary() {
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
      incomeDetailData,
    } = this.props;
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
        <IncomeDetailsTable
          incomeDetailData={incomeDetailData}
        />
      </div>
    );
  }
}
