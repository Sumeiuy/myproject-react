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

import { queryToString, getQuery } from '../../utils/helper';
import PerformanceItem from '../../components/invest/PerformanceItem';
import PreformanceChartBoard from '../../components/invest/PerformanceChartBoard';
import CustRange from '../../components/invest/CustRange2';
// 选择项字典
import { optionsMap } from '../../config';
import styles from './Home.less';

let empId;
const eid = '002727';
// RadioButton
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// Select
const Option = Select.Option;
// 头部筛选条件
const headBar = optionsMap.headBar;
// 时间筛选条件
const timeOptions = optionsMap.time;
// 渲染3个头部期间Radio
const timeRadios = timeOptions.map((item, index) => {
  const timeIndex = `Timeradio${index}`;
  return React.createElement(RadioButton, { key: timeIndex, value: `${item.key}` }, `${item.name}`);
});

const effects = {
  allInfo: 'invest/getAllInfo',
  performance: 'invest/getPerformance',
  chartInfo: 'invest/getChartInfo',
  custRange: 'invest/getCustRange',
  chartTableInfo: 'invest/getChartTableInfo',
  excelInfo: 'invest/postExcelInfo',
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
  excelInfo: state.invest.excelInfo,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getPerformance: fectchDataFunction(true, effects.performance),
  getChartInfo: fectchDataFunction(true, effects.chartInfo),
  getChartTableInfo: fectchDataFunction(true, effects.chartTableInfo),
  getCustRange: fectchDataFunction(false, effects.custRange),
  postExcelInfo: fectchDataFunction(true, effects.excelInfo),
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
    excelInfo: PropTypes.object,
    postExcelInfo: PropTypes.func.isRequired,
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
    excelInfo: {},
    // chartLoading: false,
    globalLoading: false,
    custRange: [],
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    const value = query.cycleType || 'month';
    const obj = this.getDurationString(value);
    this.state = {
      ...obj,
    };
    this.getInfo({
      ...query,
    });
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
      orgId: query.orgId || (custRange[0] && custRange[0].id),
      // scope: query.scope || Number(custRange[0] && custRange[0].level) + 1,
      scope: query.scope ||
      (query.custRangeLevel
      ? Number(query.custRangeLevel) + 1
      : Number(custRange[0] && custRange[0].level) + 1),
      orderType: query.orderType || '',
      begin: query.begin || duration.begin,
      end: query.end || duration.end,
      cycleType: query.cycleType || duration.cycleType,
      localScope: query.custRangeLevel || (custRange[0] && custRange[0].level),
    };
    // 还是chart部分的数据
    if (!_.isEqual(query, preQuery)) {
      // 如果切换 时间段
      const nowCycleType = _.pick(query, ['cycleType']);
      const preCycleType = _.pick(preQuery, ['cycleType']);
      if (!_.isEqual(nowCycleType, preCycleType)) {
        this.getInfo({
          ...query,
          page: '1',
        });
      }
      // 如果切换 机构树
      const nowOrgId = query.orgId;
      const preOrgId = preQuery.orgId;
      if (nowOrgId !== preOrgId) {
        this.getInfo({
          ...query,
          page: '1',
        });
      }
      const nowShowChart = query.showChart;
      const preShowChart = preQuery.showChart;
      // 如果切换 柱状图或者表格
      if (nowShowChart !== preShowChart) {
        if (nowShowChart === 'zhuzhuangtu' || !nowShowChart) {
          getChartInfo({
            ..._.pick(payload,
              [
                'scope',
                'localScope',
                'orgId',
                'begin',
                'end',
                'cycleType',
                'orderType',
              ]),
          });
        } else {
          getChartTableInfo({
            ..._.pick(payload,
              [
                'scope',
                'localScope',
                'orgId',
                'begin',
                'end',
                'cycleType',
              ]),
            pageNum: '1',
            orderIndicatorId: query.orderIndicatorId || '',
            orderType: query.tableOrderType || '',
          });
        }
      }

      // 如果切换层级维度排序
      const nowScope = query.scope;
      const preScope = preQuery.scope;
      if (nowScope !== preScope && nowOrgId === preOrgId) {
        // 如果当前是柱状图
        if (query.showChart === 'zhuzhuangtu' || !query.showChart) {
          getChartInfo({
            ..._.pick(payload,
              [
                'scope',
                'localScope',
                'orgId',
                'begin',
                'end',
                'cycleType',
                'orderType',
              ]),
          });
        } else {
          // 否则则是表格
          getChartTableInfo({
            ..._.pick(payload,
              [
                'scope',
                'localScope',
                'orgId',
                'begin',
                'end',
                'cycleType',
              ]),
            pageNum: '1',
            orderIndicatorId: query.orderIndicatorId || '',
            orderType: query.tableOrderType || '',
          });
        }
      }

      // 如果切换升降序方式，只要新的与旧的不想等，则请求图表接口
      const nowOrderType = query.orderType;
      const preOrderType = preQuery.orderType;
      if (nowOrderType !== preOrderType) {
        getChartInfo({
          ..._.pick(payload,
            [
              'scope',
              'localScope',
              'orgId',
              'begin',
              'end',
              'cycleType',
              'orderType',
            ]),
        });
      }

      // 如果切换页面、表格字段排序，则请求表格接口
      const nowPageAndOrderType = _.pick(query, ['page', 'tableOrderType', 'orderIndicatorId']);
      const prePageAndOrderType = _.pick(preQuery, ['page', 'tableOrderType', 'orderIndicatorId']);
      if (!_.isEqual(nowPageAndOrderType, prePageAndOrderType) && nowOrgId === preOrgId) {
        getChartTableInfo({
          ..._.pick(payload, ['scope', 'localScope', 'orgId', 'begin', 'end', 'cycleType']),
          pageNum: query.page || '1',
          orderIndicatorId: query.orderIndicatorId || '',
          orderType: query.tableOrderType || '',
        });
      }
    }
  }

  @autobind
  getInfo(queryObj) {
    const { getAllInfo, location: { query } } = this.props;
    const nativeQuery = getQuery(window.location.search);
    empId = window.curUserCode || (nativeQuery.empId || eid);
    const obj = this.state;
    const payload = {
      orgId: queryObj.orgId || '',
      begin: queryObj.begin || obj.begin,
      end: queryObj.end || obj.end,
      cycleType: queryObj.cycleType || obj.cycleType,
      localScope: queryObj.custRangeLevel,
    };
    getAllInfo({
      custRange: {
        empId,
      },
      performance: {
        scope: queryObj.custRangeLevel,
        ..._.pick(payload, ['orgId', 'begin', 'end', 'cycleType', 'localScope']),
      },
      chartInfo: {
        scope: queryObj.scope || Number(queryObj.custRangeLevel) + 1,
        orderType: queryObj.orderType || '',
        ..._.pick(payload, ['orgId', 'begin', 'end', 'cycleType', 'localScope']),
      },
      chartTableInfo: {
        ..._.pick(payload, ['orgId', 'localScope', 'begin', 'end', 'cycleType']),
        scope: queryObj.scope || Number(queryObj.custRangeLevel) + 1,
        orderType: queryObj.orderType || '',
        pageNum: queryObj.page || '1',
      },
      showChart: query.showChart,
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
    // 导出 excel 文件
  @autobind
  exportExcel() {
    const { custRange, location: { query } } = this.props;
    const duration = this.state;
    const data = {
      orgId: query.orgId || (custRange[0] && custRange[0].id),
      localScope: query.custRangeLevel || (custRange[0] && custRange[0].level),
      scope: query.scope ||
      (query.custRangeLevel
      ? Number(query.custRangeLevel) + 1
      : Number(custRange[0] && custRange[0].level) + 1),
      begin: query.begin || duration.begin,
      end: query.end || duration.end,
      cycleType: query.cycleType || duration.cycleType,
    };
    window.location.href = `
      http://192.168.71.26:9084/fspa/mcrm/api/excel/jxzb/exportExcel?${queryToString(data)}
    `;
  }
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
        page: 1,
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
                {timeRadios}
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
              postExcelInfo={this.exportExcel}
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

