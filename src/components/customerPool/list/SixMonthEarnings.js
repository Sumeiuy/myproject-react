/**
 * @file components/customerPool/list/SixMonthEarnings.js
 *  客户列表项中的近6个月的收益图
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import ChartLineWidget from './ChartLine';
import { helper } from '../../../utils';

import styles from './sixMonthEarnings.less';

const formatNumber = value => helper.toUnit(value, '元').value;

const formatUnit = value => helper.toUnit(value, '元').unit;

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
    isGetCustIncome: PropTypes.bool.isRequired,
    getCustIncome: PropTypes.func.isRequired,
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
    const { getCustIncome, listItem, monthlyProfits } = this.props;
    const thisMonthlyProfits = monthlyProfits[listItem.custId];
    if (!thisMonthlyProfits || _.isEmpty(thisMonthlyProfits)) {
      // test data empId = 01041128、05038222、035000002899、02004642
      getCustIncome({ custNumber: listItem.custId });
    }
    this.setState({
      isShowCharts: true,
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
      isGetCustIncome,
    } = this.props;
    const {
      isShowCharts,
    } = this.state;
    const thisMonthlyProfits = monthlyProfits[listItem.custId] || [];
    const lastestProfit = Number(getLastestData(thisMonthlyProfits).assetProfit);
    const lastestProfitRate = Number(getLastestData(thisMonthlyProfits).assetProfitRate);
    return (
      <span
        className={styles.showChartBtn}
        style={{
          cursor: isGetCustIncome ? 'wait' : 'pointer',
        }}
      >
        <p
          onMouseEnter={this.debounced}
          onMouseLeave={this.handleMouseLeave}
        >
          查看详情
        </p>
        <div
          className={`${styles.showCharts}`}
          style={{
            display: isShowCharts ? 'block' : 'none',
          }}
        >
          <div className={styles.chartsContent}>
            <ChartLineWidget chartData={thisMonthlyProfits} />
          </div>
          <div className={styles.chartsText}>
            <div className={styles.lh28}>
              <span>年最大时点资产：</span>
              <span className={styles.numA}>
                {listItem.maxTotAsetY ? formatNumber(listItem.maxTotAsetY) : '--'}
              </span>
              {listItem.maxTotAsetY ? formatUnit(listItem.maxTotAsetY) : ''}
            </div>
            <div className={styles.lh28}>
              <span>本月收益率：</span>
              <span className={styles.numB}>
                {
                  thisMonthlyProfits.length ?
                    `${lastestProfitRate.toFixed(2)}%`
                    :
                    '--'
                }
              </span>
            </div>
            <div className={styles.lh28}>
              <span>本月收益：</span>
              <span className={styles.numB}>
                {
                  thisMonthlyProfits.length ?
                    formatNumber(lastestProfit)
                    :
                    '--'
                }
                &nbsp;
              </span>
              <span>
                {thisMonthlyProfits.length ? formatUnit(lastestProfit) : null}
              </span>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

