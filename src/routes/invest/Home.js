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
  chartTableInfo: 'invest/getChartTableInfo',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  performance: state.invest.performance,
  chartInfo: state.invest.chartInfo,
  chartTableInfo: state.invest.chartTableInfo,
  chartLoading: state.loading.effects[effects.chartInfo],
  custRange: state.invest.custRange,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  getPerformance: fectchDataFunction(true, effects.performance),
  refreshPerformance: fectchDataFunction(false, effects.performance),
  getChartInfo: fectchDataFunction(true, effects.chartInfo),
  getChartTableInfo: fectchDataFunction(true, effects.chartTableInfo),
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
    getChartTableInfo: PropTypes.func.isRequired,
    refreshChartInfo: PropTypes.func.isRequired,
    chartInfo: PropTypes.array,
    chartTableInfo: PropTypes.object,
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
    chartTableInfo: [],
    chartLoading: false,
    globalLoading: false,
    custRange: [],
  }

  componentWillMount() {
    const {
      getPerformance,
      getChartInfo,
      getCustRange,
      getChartTableInfo,
      location: { query },
    } = this.props;
    console.log('query', query);
    // let custArr = [];
    // if (query.custRange) {
    //   custArr = query.custRange.split('-');
    // }
    const obj = this.getDurationString('month');
    this.state = {
      ...obj,
    };
    getPerformance(
      {
        scope: '3',
        empId: '002332',
        indicatorIdList: ['tgNum', 'gjPurRake', 'platformCustNumM'],
        begin: query.begin || obj.begin,
        end: query.end || obj.end,
        cycleType: query.cycleType || obj.cycleType,
      },
    );
    getChartInfo(
      {
        scope: '3',
        localScope: '1',
        empId: '002332',
        indicatorIdList: ['tgNum', 'gjPurRake', 'platformCustNumM'],
        begin: query.begin || obj.begin,
        end: query.end || obj.end,
        cycleType: query.cycleType || obj.cycleType,
        orderIndicatorId: '',
        orderType: '',
        pageSize: '',
        pageNum: '',
      },
    );
    // 001750  经总
    // 001410  分公司
    // 002332  营业部
    getCustRange({ empId: '001750' });
    getChartTableInfo(
      {
        empId: '002332',
        localScope: '1',
        scope: '3',
        indicatorIdList: ['tgNum', 'gjPurRake', 'platformCustNumM'],
        begin: '20170410',
        end: '20170412',
        cycleType: 'month',
        orderType: '',
        pageNum: '1',
        pageSize: '30',
      },
    );
  }

  componentWillReceiveProps(nextProps) {
    // 判断props是否变化
    const { location: { query } } = nextProps;
    const {
      location: { query: preQuery },
      refreshChartInfo,
      getChartInfo,
      getChartTableInfo,
      getPerformance,
    } = this.props;
    // const custArr = [];
    // if (query.custRange) {
    //   custArr = query.custRange.split('-');
    // }
    // 此处需要判断需要修改哪个值
    // 是投顾头部总量指标
    // 还是chart部分的数据
    if (!_.isEqual(query, preQuery)) {
      // 判断是排序方式的值不同
      const sortNow = _.pick(query, ['scope', 'orderType']);
      const sortPre = _.pick(preQuery, ['scope', 'orderType']);
      if (!_.isEqual(sortNow, sortPre)) {
        // 只刷新指标分布区域
        refreshChartInfo({
          ...query,
          scope: '3',
          // localScope: custArr[0] || '1',
          localScope: '1',
          empId: '002332',
          indicatorIdList: ['tgNum', 'gjPurRake', 'platformCustNumM'],
          orderIndicatorId: '',
          orderType: '',
          pageSize: '',
          pageNum: '',
        });
      } else {
        // 重新获取页面所有数据
        getPerformance({
          ...query,
          scope: '3',
          empId: '002332',
          indicatorIdList: ['tgNum', 'gjPurRake', 'platformCustNumM'],
          orderIndicatorId: '',
          orderType: '',
          pageSize: '',
          pageNum: '',
        });
        getChartInfo({
          ...query,
          scope: '3',
          // localScope: custArr[0] || '1',
          localScope: '1',
          empId: '002332',
          indicatorIdList: ['tgNum', 'gjPurRake', 'platformCustNumM'],
          orderIndicatorId: '',
          orderType: '',
          pageSize: '',
          pageNum: '',
        });
        getChartTableInfo(
          {
            ...query,
            empId: '002332',
            localScope: '1',
            scope: '3',
            indicatorIdList: ['tgNum', 'gjPurRake', 'platformCustNumM'],
            orderType: '',
            pageNum: '1',
            pageSize: '30',
          },
        );
      }
    }
  }

  @autobind
  getDurationString(flag) {
    const durationObj = {};
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`;
    const day = now.getDate();
    let qStartMonth = (Math.floor((now.getMonth() + 3) / 3) * 3) - 2;
    qStartMonth = qStartMonth < 10 ? `0${qStartMonth}` : `${qStartMonth}`;
    // 本月
    if (flag === 'month') {
      durationObj.duration = `${month}/01-${month}/${day}`;
      durationObj.cycleType = 'month';
      durationObj.begin = `${year}${month}01`;
      durationObj.end = `${year}${month}${day}`;
    } else if (flag === 'quarter') {
      durationObj.duration = `${qStartMonth}/01-${month}/${day}`;
      durationObj.cycleType = 'quarter';
      durationObj.begin = `${year}${qStartMonth}01`;
      durationObj.end = `${year}${month}${day}`;
    } else if (flag === 'year') {
      durationObj.duration = `01/01-${month}/${day}`;
      durationObj.cycleType = 'year';
      durationObj.begin = `${year}0101`;
      durationObj.end = `${year}${month}${day}`;
    }
    return durationObj;
  }

  // @autobind
  // durationChange(value) {
  //   const obj = this.getDurationString(value);
  //   this.setState({
  //     duration: obj,
  //   });
  // }
  // 期间变化
  @autobind
  handleDurationChange(e) {
    const value = e.target.value;
    const obj = this.getDurationString(value);
    const { replace, location: { query } } = this.props;
    // this.setState({
    //   duration: obj,
    // });
    // 需要改变query中的查询变量
    replace({
      pathname: '/invest',
      query: {
        ...query,
        begin: obj.begin,
        end: obj.end,
        cycleType: value,
      },
    });
  }

  render() {
    const { duration, cycleType } = this.state;
    const {
      performance,
      chartInfo,
      chartTableInfo,
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
                defaultValue={cycleType || 'month'}
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
              chartTableInfo={chartTableInfo}
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

