/**
 * @file components/customerPool/list/SixMonthEarnings.js
 *  客户列表项中的近6个月的收益图
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import ChartLineWidget from './ChartLine';
// import { helper } from '../../../utils';

import styles from './sixMonthEarnings.less';

// const formatNumber = value => helper.toUnit(value, '元', 3).value;

// const formatUnit = value => helper.toUnit(value, '元', 3).unit;

const getLastestData = (arr) => {
  if (arr && arr instanceof Array && arr.length !== 0) {
    return arr[arr.length - 1];
  }
  return {};
};

export default class SixMonthEarnings extends PureComponent {

  static propTypes = {
    listItem: PropTypes.object.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    formatAsset: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowCharts: false,
    };
    this.debounced = _.debounce(
      this.getCustIncome,
      800,
      { leading: false },
    );
  }

  @autobind
  getCustIncome() {
    const { getCustIncome, listItem, monthlyProfits, custIncomeReqState } = this.props;
    const thisProfits = monthlyProfits[listItem.custId];
    if (!thisProfits || _.isEmpty(thisProfits)) {
      // test data empId = 01041128、05038222、035000002899、02004642
      getCustIncome({ custNumber: listItem.custId });
    }
    this.setState({
      isShowCharts: !custIncomeReqState,
    });
  }

    @autobind
  handleMouseLeave() {
    this.debounced.cancel();
    this.setState({
      isShowCharts: false,
    });
  }

  render() {
    const {
      listItem,
      monthlyProfits,
      custIncomeReqState,
      formatAsset,
    } = this.props;
    const {
      isShowCharts,
    } = this.state;
    const thisProfits = monthlyProfits[listItem.custId] || [];
    const lastestProfit = Number(getLastestData(thisProfits).assetProfit);
    const lastestProfitRate = Number(getLastestData(thisProfits).assetProfitRate);
    // 格式化本月收益的值和单位、本月收益率
    let lastestPrifitsValue = '--';
    let lastestPrifitsUnit = '';
    let lastestPrifitsRate = '--';
    if (thisProfits.length) {
      if (lastestProfit) {
        const obj = formatAsset(lastestProfit);
        lastestPrifitsValue = obj.value;
        lastestPrifitsUnit = obj.unit;
        lastestPrifitsRate = `${lastestProfitRate.toFixed(2)}%`;
      }
    }
    // 格式化年最大时点资产的值和单位
    let maxTotAsetYValue = '--';
    let maxTotAsetYUnit = '';
    if (listItem.maxTotAsetY) {
      const obj = formatAsset(listItem.maxTotAsetY);
      maxTotAsetYValue = obj.value;
      maxTotAsetYUnit = obj.unit;
    }
    return (
      <span
        className={styles.showChartBtn}
        style={{
          cursor: custIncomeReqState ? 'wait' : 'pointer',
        }}
      >
        <p
          onMouseEnter={this.debounced}
          onMouseLeave={this.handleMouseLeave}
        >
          详情
        </p>
        <div
          className={`${styles.showCharts}`}
          style={{
            display: isShowCharts ? 'block' : 'none',
          }}
        >
          <div className={styles.chartsContent}>
            <ChartLineWidget chartData={thisProfits} />
          </div>
          <div className={styles.chartsText}>
            <div>
              <p className="tit">12个月峰值</p>
              <p className="asset">
                <span className="num">{maxTotAsetYValue}</span>
                <span className="unit">{maxTotAsetYUnit}</span>
              </p>
            </div>
            <div>
              <p className="tit">本月收益：</p>
              <p className="asset">
                <span className="num redNum">{lastestPrifitsValue}</span>
                <span className="unit redUnit">{lastestPrifitsUnit}</span>
              </p>
            </div>
            <div>
              <p className="tit">本月收益率：</p>
              <p className="asset">
                <span className="num redNum">{lastestPrifitsRate}</span>
              </p>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

