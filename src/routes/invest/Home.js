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
// import _ from 'lodash';
import PerformanceItem from '../../components/invest/PerformanceItem';
import PreformanceChartBoard from '../../components/invest/PerformanceChartBoard';
import CustRange from '../../components/invest/CustRange';

import styles from './Home.less';

// RadioButton
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
// Select
const Option = Select.Option;

const mapStateToProps = state => ({
  performance: state.invest.performance,
  chartInfo: state.invest.chartInfo,
  custRange: state.invest.custRange,
});

const mapDispatchToProps = {
  getPerformance: query => ({
    type: 'invest/getPerformance',
    payload: query || {},
  }),
  getChartInfo: query => ({
    type: 'invest/getChartInfo',
    payload: query || {},
  }),
  getCustRange: () => ({
    type: 'invest/getCustRange',
  }),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class InvestHome extends PureComponent {

  static propTypes = {
    getPerformance: PropTypes.func.isRequired,
    performance: PropTypes.array,
    getChartInfo: PropTypes.func.isRequired,
    chartInfo: PropTypes.array,
    getCustRange: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    performance: [],
    chartInfo: [],
    custRange: [],
    location: {},
    getCustRange: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      duration: this.getDurationString('m'),
    };
  }

  componentWillMount() {
    const { getPerformance, getChartInfo, getCustRange } = this.props;
    // if (!performance) {
    getPerformance();
    // }
    // if (!chartInfo) {
    getChartInfo();
    // }
    getCustRange();
  }

  componentDidMount() {
    const { location: { query } } = this.props;
    console.log('query', query);
  }

  // componentWillReceiveProps(nextProps) {
  //   判断props是否变化
  //   const { performance, chartInfo } = nextProps;
  //   if (_.isEmpty(performance)) {
  //     this.props.getPerformance();
  //   }
  //   if (_isEmpty(chartInfo)) {
  //     this.props.getChartInfo();
  //   }
  // }

  @autobind
  getDurationString(flag) {
    let duration = '';
    const now = new Date();
    const month = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`;
    const day = now.getDate();
    let qStartMonth = (Math.floor((now.getMonth() + 3) / 3) * 3) - 2;
    qStartMonth = qStartMonth < 10 ? `0${qStartMonth}` : `${qStartMonth}`;
    // 本月
    if (flag === 'm') {
      duration = `${month}/01-${month}/${day}`;
    } else if (flag === 'q') {
      duration = `${qStartMonth}/01-${month}/${day}`;
    } else if (flag === 'y') {
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
    this.durationChange(value);
  }

  render() {
    const { duration } = this.state;
    const {
      performance,
      chartInfo,
      custRange,
      location,
      replace,
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
                defaultValue="m"
                onChange={this.handleDurationChange}
              >
                <RadioButton value="m">本月</RadioButton>
                <RadioButton value="q">本季</RadioButton>
                <RadioButton value="y">本年</RadioButton>
              </RadioGroup>
              <div className={styles.vSplit} />
              {/* 营业地址选择项 */}
              <CustRange
                custRange={custRange}
                location={location}
                replace={replace}
              />
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
            <PreformanceChartBoard chartData={chartInfo} />
          </div>
        </div>
      </div>
    );
  }
}

