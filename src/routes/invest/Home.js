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
import CustRange from '../../components/invest/CustRange';
// 选择项字典
import { optionsMap } from '../../config';
import styles from './Home.less';

// RadioButton
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
// Select
const Option = Select.Option;
// 头部筛选条件
const headBar = optionsMap.headBar;
// 时间筛选条件
const timeOptions = optionsMap.time;

const effects = {
  performance: 'invest/getPerformance',
  chartInfo: 'invest/getChartInfo',
  custRange: 'invest/getCustRange',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  performance: state.invest.performance,
  chartInfo: state.invest.chartInfo,
  chartLoading: state.loading.effects[effects.chartInfo],
  custRange: state.invest.custRange,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  getPerformance: fectchDataFunction(true, effects.performance),
  refreshPerformance: fectchDataFunction(false, effects.performance),
  getChartInfo: fectchDataFunction(true, effects.chartInfo),
  refreshChartInfo: fectchDataFunction(false, effects.chartInfo),
  getCustRange: fectchDataFunction(false, effects.custRange),
  push: routerRedux.push,
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
    chartLoading: PropTypes.bool,
    globalLoading: PropTypes.bool,
    getCustRange: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    performance: [],
    chartInfo: [],
    chartLoading: false,
    globalLoading: false,
    custRange: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      duration: this.getDurationString('month'),
    };
  }

  componentWillMount() {
    const { getPerformance, getChartInfo, getCustRange } = this.props;
    const { location: { query } } = this.props;
    getPerformance(query);
    getChartInfo(query);
    getCustRange(query);
  }

  componentWillReceiveProps(nextProps) {
    // 判断props是否变化
    const { location: { query } } = nextProps;
    const {
      location: { query: preQuery },
      refreshChartInfo,
      getChartInfo,
      getPerformance,
    } = this.props;
    // 此处需要判断需要修改哪个值
    // 是投顾头部总量指标
    // 还是chart部分的数据
    if (!_.isEqual(query, preQuery)) {
      // 判断是排序方式的值不同
      const sortNow = _.pick(query, ['sortColumn', 'sortOrder', 'showChart']);
      const sortPre = _.pick(preQuery, ['sortColumn', 'sortOrder', 'showChart']);
      if (!_.isEqual(sortNow, sortPre)) {
        // 只刷新指标分布区域
        refreshChartInfo({
          ...query,
        });
      } else {
        // 重新获取页面所有数据
        getPerformance({
          ...query,
        });
        getChartInfo({
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
    const { duration, timeDuration } = this.state;
    const {
      performance,
      chartInfo,
      location,
      chartLoading,
      globalLoading,
      replace,
      custRange,
    } = this.props;
    return (
      <div className="page-invest content-inner">
        <div className="reportHeader">
          <Row type="flex" justify="start" align="middle">
            <div className={styles.reportName}>
              <Select
                defaultValue={headBar.key}
                style={{
                  width: '150px',
                }}
              >
                <Option value={headBar.key}>{headBar.name}</Option>
              </Select>
            </div>
            <div className={styles.reportHeaderRight}>
              <div className={styles.dateFilter}>{duration}</div>
              <RadioGroup
                defaultValue={timeDuration || 'month'}
                onChange={this.handleDurationChange}
              >
                {
                  timeOptions.map((item, index) => {
                    const timeIndex = index;
                    return <RadioButton key={timeIndex} value={item.key}>{item.name}</RadioButton>;
                  })
                }
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
            <PreformanceChartBoard
              chartData={chartInfo}
              location={location}
              replace={replace}
              loading={chartLoading && !globalLoading}
            />
          </div>
        </div>
      </div>
    );
  }
}

