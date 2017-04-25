/**
 * @file invest/Home.js
 *  投顾业绩汇总首页
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { Row, Radio, Select } from 'antd';
import _ from 'lodash';
import PerformanceItem from '../../components/invest/PerformanceItem';
import PreformanceChartBoard from '../../components/invest/PerformanceChartBoard';

import styles from './Home.less';

// RadioButton
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
// Select
const Option = Select.Option;

const effects = {
  performance: 'invest/getPerformance',
  chartInfo: 'invest/getChartInfo',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payLoad: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  performance: state.invest.performance,
  chartInfo: state.invest.chartInfo,
  chartLoading: state.loading.effects[effects.chartInfo],
});

const mapDispatchToProps = {
  getPerformance: fectchDataFunction(true, effects.performance),
  refreshPerformance: fectchDataFunction(false, effects.performance),
  getChartInfo: fectchDataFunction(true, effects.chartInfo),
  refreshChartInfo: fectchDataFunction(false, effects.chartInfo),
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class InvestHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    getPerformance: PropTypes.func.isRequired,
    refreshPerformance: PropTypes.func.isRequired,
    performance: PropTypes.array,
    getChartInfo: PropTypes.func.isRequired,
    refreshChartInfo: PropTypes.func.isRequired,
    chartInfo: PropTypes.array,
    replace: PropTypes.func.isRequired,
    chartLoading: PropTypes.bool,
  }

  static defaultProps = {
    chartLoading: false,
    performance: [],
    chartInfo: [],
    repalce: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      duration: this.getDurationString('month'),
    };
  }

  componentWillMount() {
    const { getPerformance, getChartInfo } = this.props;
    getPerformance();
    getChartInfo();
  }

  componentWillReceiveProps(nextProps) {
    // 判断props是否变化
    const { location: { query } } = nextProps;
    const { location: { query: preQuery }, refreshChartInfo } = this.props;
    // 此处需要判断需要修改哪个值
    // 是投顾头部总量指标
    // 还是chart部分的数据
    if (!_.isEqual(query, preQuery)) {
      // 判断是排序方式的值不同
      const sortNow = _.pick(query, ['sortColumn', 'sortOrder']);
      const sortPre = _.pick(preQuery, ['sortColumn', 'sortOrder']);
      if (!_.isEqual(sortNow, sortPre)) {
        refreshChartInfo({
          ...query,
        });
      }
    }
  }

  @autobind
  getDurationString(flag) {
    let duration = '';
    const now = new Date();
    const month = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`;
    const day = now.getDate();
    let qStartMonth = (Math.floor((now.getMonth() + 3) / 3) * 3) - 2;
    qStartMonth = qStartMonth < 10 ? `0${qStartMonth}` : `${qStartMonth}`;
    // 本月
    if (flag === 'month') {
      duration = `${month}/01-${month}/${day}`;
    } else if (flag === 'season') {
      duration = `${qStartMonth}/01-${month}/${day}`;
    } else if (flag === 'year') {
      duration = `01/01-${month}/${day}`;
    }
    return duration;
  }

  @autobind
  durationChange(value) {
    const duration = this.getDurationString(value);
    this.setState({
      duration,
    });
  }
  // 期间变化
  @autobind
  handleDurationChange(e) {
    const value = e.target.value;
    const { replace, location: { query } } = this.props;
    this.durationChange(value);
    // 需要改变query中的查询变量
    replace({
      pathname: '/invest',
      query: {
        ...query,
        duration: value,
      },
    });
  }

  render() {
    const { duration } = this.state;
    const {
      performance,
      chartInfo,
      location,
      replace,
      chartLoading,
    } = this.props;

    return (
      <div className="page-invest content-inner">
        <div className="reportHeader">
          <Row type="flex" justify="start" align="middle">
            <div className={styles.reportName}>
              <Select
                defaultValue="1"
                style={{
                  width: '150px',
                }}
              >
                <Option value="1">投顾业绩汇总</Option>
              </Select>
            </div>
            <div className={styles.reportHeaderRight}>
              <div className={styles.dateFilter}>{duration}</div>
              <RadioGroup
                defaultValue="month"
                onChange={this.handleDurationChange}
              >
                <RadioButton value="month">本月</RadioButton>
                <RadioButton value="season">本季</RadioButton>
                <RadioButton value="year">本年</RadioButton>
              </RadioGroup>
              <div className={styles.vSplit} />
              {/* 营业地址选择项 */}
            </div>
          </Row>
        </div>
        <div className={styles.reportBody}>
          <div className={styles.reportPart}>
            <PerformanceItem
              data={performance}
            />
          </div>
          <div className={styles.reportPart}>
            <PreformanceChartBoard
              chartData={chartInfo}
              location={location}
              replace={replace}
              loading={chartLoading}
            />
          </div>
        </div>
      </div>
    );
  }
}

