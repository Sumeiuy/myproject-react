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
import CustRange from '../../components/invest/CustRange2';
// 选择项字典
import { optionsMap } from '../../config';
import styles from './Home.less';

const empId = window.curUserCode || '002727';
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
  allInfo: 'invest/getAllInfo',
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
  // chartLoading: state.loading.effects[effects.chartInfo],
  custRange: state.invest.custRange,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getPerformance: fectchDataFunction(true, effects.performance),
  getChartInfo: fectchDataFunction(true, effects.chartInfo),
  getChartTableInfo: fectchDataFunction(true, effects.chartTableInfo),
  getCustRange: fectchDataFunction(false, effects.custRange),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class InvestHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    getAllInfo: PropTypes.func.isRequired,
    getPerformance: PropTypes.func.isRequired,
    performance: PropTypes.array,
    getChartInfo: PropTypes.func.isRequired,
    chartInfo: PropTypes.array,
    getChartTableInfo: PropTypes.func.isRequired,
    chartTableInfo: PropTypes.object,
    // chartLoading: PropTypes.bool,
    globalLoading: PropTypes.bool,
    getCustRange: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    performance: [],
    chartInfo: [],
    chartTableInfo: {},
    // chartLoading: false,
    globalLoading: false,
    custRange: [],
  }

  componentWillMount() {
    const {
      location: { query },
    } = this.props;
    const value = query.cycleType || 'month';
    const obj = this.getDurationString(value);
    this.state = {
      ...obj,
    };
    this.getInfo(query);
  }

  componentWillReceiveProps(nextProps) {
    // 判断props是否变化
    const { custRange, location: { query } } = nextProps;
    const duration = this.state;
    const {
      location: { query: preQuery },
      getChartInfo,
      getChartTableInfo,
    } = this.props;

    const payload = {
      ...query,
      empId,
      orgId: query.orgId || (custRange[0] && custRange[0].id),
      scope: query.scope || Number(custRange[0] && custRange[0].level) + 1,
      orderType: query.orderType || '',
      begin: query.begin || duration.begin,
      end: query.end || duration.end,
      cycleType: query.cycleType || duration.cycleType,
      localScope: query.custRangeLevel || (custRange[0] && custRange[0].level),
    };
    // 还是chart部分的数据
    if (!_.isEqual(query, preQuery)) {
      // 如果切换 机构树以及时间段，对下面的所有接口发起新的请求
      const nowCustAndCycle = _.pick(query, ['custRangeLevel', 'cycleType']);
      const preCustAndCycle = _.pick(preQuery, ['custRangeLevel', 'cycleType']);
      if (!_.isEqual(nowCustAndCycle, preCustAndCycle)) {
        this.getInfo(query);
        // // 更改 scope 的值
        // replace({
        //   pathname: '/invest',
        //   query: {
        //     ...query,
        //     scope: Number(query.custRangeLevel) + 1 || '',
        //   },
        // });
      }
      // 判断更改按分公司、营业部、投顾排序维度
      // 判断排序方式变更
      // 判断切换图表与表格
      if (!_.isEqual(query.scope, preQuery.scope) ||
        !_.isEqual(query.orderType, preQuery.orderType) ||
        !_.isEqual(query.showChart, preQuery.showChart)) {
        // todo，请求参数
        // 如果现在是 zhuzhuangtu，则请求柱状图接口，否则请求表格接口

        if (query.showChart === 'zhuzhuangtu' || !query.showChart) {
          getChartInfo({
            ...payload,
          });
        } else {
          getChartTableInfo({
            ...payload,
            pageNum: query.page || '1',
            orderIndicatorId: query.orderIndicatorId || '',
          });
        }
      }
      // 判断 页数 变更，请求表格数据接口
      if (!_.isEqual(query.page, preQuery.page)) {
        getChartTableInfo({
          ...payload,
          pageNum: query.page || '1',
          orderIndicatorId: query.orderIndicatorId || '',
        });
      }
    }
  }

  @autobind
  getInfo(query) {
    const { getAllInfo } = this.props;
    const obj = this.state;
    const payload = {
      empId,
      orgId: query.orgId || '',
      begin: query.begin || obj.begin,
      end: query.end || obj.end,
      cycleType: query.cycleType || obj.cycleType,
      localScope: query.custRangeLevel,
    };
    console.log('query', query);
    getAllInfo({
      custRange: {
        empId,
      },
      performance: {
        ...payload,
        scope: query.custRangeLevel,
      },
      chartInfo: {
        ...payload,
        scope: query.scope || Number(query.custRangeLevel) + 1,
        localScope: query.custRangeLevel || '',
        orderType: query.orderType || '',
      },
      chartTableInfo: {
        ...payload,
        scope: query.scope || Number(query.custRangeLevel) + 1,
        orderType: query.orderType || '',
        pageNum: query.page || '1',
      },
    });
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
      durationObj.durationStr = `${month}/01-${month}/${day}`;
      durationObj.cycleType = 'month';
      durationObj.begin = `${year}${month}01`;
      durationObj.end = `${year}${month}${day}`;
    } else if (flag === 'quarter') {
      durationObj.durationStr = `${qStartMonth}/01-${month}/${day}`;
      durationObj.cycleType = 'quarter';
      durationObj.begin = `${year}${qStartMonth}01`;
      durationObj.end = `${year}${month}${day}`;
    } else if (flag === 'year') {
      durationObj.durationStr = `01/01-${month}/${day}`;
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
    this.setState({
      ...obj,
    });
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
    // chartLoading,
    // globalLoading,
    const duration = this.state;
    const {
      performance,
      chartInfo,
      chartTableInfo,
      location,
      replace,
      custRange,
    } = this.props;
    const selScope = location.query.custRangeLevel || (custRange[0] && custRange[0].level);
    if (!custRange || !custRange.length) {
      return null;
    }
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
              <div className={styles.dateFilter}>{duration.durationStr}</div>
              <RadioGroup
                defaultValue={duration.cycleType || 'month'}
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
              level={selScope}
              location={location}
              replace={replace}
              loading={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

