/**
 * @file business/Home.js
 *  投顾业绩汇总首页
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getEmpId, queryToString, getDurationString } from '../../utils/helper';
import PerformanceItem from '../../components/pageCommon/PerformanceItem';
import PreformanceChartBoard from '../../components/pageCommon/PerformanceChartBoard';
import PageHeader from '../../components/pageCommon/PageHeader';
import styles from './Home.less';

const effects = {
  allInfo: 'business/getAllInfo',
  performance: 'business/getPerformance',
  chartInfo: 'business/getChartInfo',
  custRange: 'business/getCustRange',
  chartTableInfo: 'business/getChartTableInfo',
  getClassifyIndex: 'business/getClassifyIndex',
  exportExcel: 'business/exportExcel',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  performance: state.business.performance,
  chartInfo: state.business.chartInfo,
  chartTableInfo: state.business.chartTableInfo,
  custRange: state.business.custRange,
  excelInfo: state.business.excelInfo,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getPerformance: fectchDataFunction(true, effects.performance),
  getChartInfo: fectchDataFunction(true, effects.chartInfo),
  getClassifyIndex: fectchDataFunction(true, effects.getClassifyIndex),
  getChartTableInfo: fectchDataFunction(true, effects.chartTableInfo),
  getCustRange: fectchDataFunction(false, effects.custRange),
  exportExcel: fectchDataFunction(true, effects.exportExcel),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class BusinessHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    getAllInfo: PropTypes.func.isRequired,
    getPerformance: PropTypes.func.isRequired,
    performance: PropTypes.array,
    getChartInfo: PropTypes.func.isRequired,
    chartInfo: PropTypes.array,
    getChartTableInfo: PropTypes.func.isRequired,
    chartTableInfo: PropTypes.object,
    exportExcel: PropTypes.func.isRequired,
    globalLoading: PropTypes.bool,
    getCustRange: PropTypes.func.isRequired,
    getClassifyIndex: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    performance: [],
    chartInfo: [],
    chartTableInfo: {},
    globalLoading: false,
    custRange: [],
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    const value = query.cycleType || 'month';
    const obj = getDurationString(value);
    this.state = {
      ...obj,
    };
    this.getInfo({
      ...query,
      scope: query.scope || Number(query.custRangeLevel) + 1,
    });
  }

  componentWillReceiveProps(nextProps) {
    // 判断props是否变化
    const { location: { query } } = nextProps;
    // const duration = this.state;
    const {
      location: { query: preQuery },
      // getChartInfo,
      // getChartTableInfo,
    } = this.props;

    // const payload = {
    //   ...query,
    //   orgId: query.orgId || (custRange[0] && custRange[0].id),
    //   scope: query.scope ||
    //   (query.custRangeLevel
    //   ? Number(query.custRangeLevel) + 1
    //   : Number(custRange[0] && custRange[0].level) + 1),
    //   orderType: query.orderType || '',
    //   begin: query.begin || duration.begin,
    //   end: query.end || duration.end,
    //   cycleType: query.cycleType || duration.cycleType,
    //   localScope: query.custRangeLevel || (custRange[0] && custRange[0].level),
    // };
    // 还是chart部分的数据
    if (!_.isEqual(query, preQuery)) {
      // 如果切换 时间段
      const nowCycleType = query.cycleType;
      const preCycleType = preQuery.cycleType;

      if (nowCycleType !== preCycleType) {
        this.getInfo({
          ...query,
        });
      }
      // 如果切换 机构树
      const nowOrgId = query.orgId;
      const preOrgId = preQuery.orgId;
      if (nowOrgId !== preOrgId) {
        this.getInfo({
          ...query,
        });
      }
      // const nowShowChart = query.showChart;
      // const preShowChart = preQuery.showChart;
      // 如果切换 柱状图或者表格
      // if (nowShowChart !== preShowChart) {
      //   if (nowShowChart === 'zhuzhuangtu' || !nowShowChart) {
      //     getChartInfo({
      //       ..._.pick(payload,
      //         [
      //           'scope',
      //           'localScope',
      //           'orgId',
      //           'begin',
      //           'end',
      //           'cycleType',
      //           'orderType',
      //         ]),
      //     });
      //   } else {
      //     getChartTableInfo({
      //       ..._.pick(payload,
      //         [
      //           'scope',
      //           'localScope',
      //           'orgId',
      //           'begin',
      //           'end',
      //           'cycleType',
      //         ]),
      //       pageNum: '1',
      //       pageSize: 10,
      //       orderIndicatorId: query.orderIndicatorId || '',
      //       orderType: query.tableOrderType || '',
      //     });
      //   }
      // }

      // 如果切换层级维度排序
      // const nowScope = query.scope;
      // const preScope = preQuery.scope;
      // if (nowScope !== preScope && nowOrgId === preOrgId) {
      //   // 如果当前是柱状图
      //   if (query.showChart === 'zhuzhuangtu' || !query.showChart) {
      //     getChartInfo({
      //       ..._.pick(payload,
      //         [
      //           'scope',
      //           'localScope',
      //           'orgId',
      //           'begin',
      //           'end',
      //           'cycleType',
      //           'orderType',
      //         ]),
      //     });
      //   } else {
      //     // 否则则是表格
      //     getChartTableInfo({
      //       ..._.pick(payload,
      //         [
      //           'scope',
      //           'localScope',
      //           'orgId',
      //           'begin',
      //           'end',
      //           'cycleType',
      //         ]),
      //       pageNum: '1',
      //       pageSize: 10,
      //       orderIndicatorId: query.orderIndicatorId || '',
      //       orderType: query.tableOrderType || '',
      //     });
      //   }
      // }

      // 如果切换升降序方式，只要新的与旧的不想等，则请求图表接口
      // const nowOrderType = query.orderType;
      // const preOrderType = preQuery.orderType;
      // if (nowOrderType !== preOrderType) {
      //   getChartInfo({
      //     ..._.pick(payload,
      //       [
      //         'scope',
      //         'localScope',
      //         'orgId',
      //         'begin',
      //         'end',
      //         'cycleType',
      //         'orderType',
      //       ]),
      //   });
      // }

      // 如果切换页面、表格字段排序，则请求表格接口
      // const nowPageAndOrderType = _.pick(query, ['page', 'tableOrderType', 'orderIndicatorId']);
      // const prePageAndOrderType =
      // _.pick(preQuery, ['page', 'tableOrderType', 'orderIndicatorId']);
      // if (!_.isEqual(nowPageAndOrderType, prePageAndOrderType) &&
      //  nowOrgId === preOrgId && query.showChart === 'tables') {
      //   getChartTableInfo({
      //     ..._.pick(payload, ['scope', 'localScope', 'orgId', 'begin', 'end', 'cycleType']),
      //     pageNum: query.page || '1',
      //     orderIndicatorId: query.orderIndicatorId || '',
      //     orderType: query.tableOrderType || '',
      //     pageSize: 10,
      //   });
      // }
    }
  }

  @autobind
  getInfo(queryObj) {
    const { getAllInfo } = this.props;
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
        empId: getEmpId(),
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
      // chartTableInfo: {
      //   ..._.pick(payload, ['orgId', 'localScope', 'begin', 'end', 'cycleType']),
      //   scope: queryObj.scope || Number(queryObj.custRangeLevel) + 1,
      //   orderType: queryObj.orderType || '',
      //   pageSize: 10,
      //   pageNum: queryObj.page || '1',
      // },
      // showChart: query.showChart,
    });
  }

  // 导出 excel 文件
  @autobind
  handleExportExcel() {
    const { custRange, location: { query }, exportExcel } = this.props;
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
    exportExcel({ query: queryToString(data) });
  }

  @autobind
  selfRequestData(param) {
    const { custRange, location: { query }, getClassifyIndex } = this.props;
    const duration = this.state;
    const payload = {
      ...query,
      orgId: query.orgId || (custRange[0] && custRange[0].id),
      scope: query.scope ||
      (query.custRangeLevel
      ? Number(query.custRangeLevel) + 1
      : Number(custRange[0] && custRange[0].level) + 1),
      orderType: query.orderType || '',
      begin: query.begin || duration.begin,
      end: query.end || duration.end,
      cycleType: query.cycleType || duration.cycleType,
      localScope: query.custRangeLevel || (custRange[0] && custRange[0].level),
      ...param,
    };
    getClassifyIndex(payload);
  }

  render() {
    const {
      performance,
      chartInfo,
      chartTableInfo,
      location,
      location: { query },
      replace,
      custRange,
    } = this.props;
    const level = location.query.custRangeLevel || (custRange[0] && custRange[0].level);
    const scope = Number(query.scope) || (custRange[0] && Number(custRange[0].level) + 1);
    if (!custRange || !custRange.length) {
      return null;
    }

    return (
      <div className="page-invest content-inner">
        <PageHeader
          location={location}
          replace={replace}
          custRange={custRange}
        />
        <div className={styles.reportBody}>
          <div className={styles.reportPart}>
            <PerformanceItem
              data={performance}
            />
          </div>
          {
            chartInfo.map((item) => {
              const { title, id, data } = item;
              return (
                <div
                  className={styles.reportPart}
                >
                  <PreformanceChartBoard
                    chartData={data}
                    indexID={id}
                    chartTableInfo={chartTableInfo}
                    postExcelInfo={this.handleExportExcel}
                    level={level}
                    scope={scope}
                    location={location}
                    replace={replace}
                    boardTitle={title}
                    showScopeOrder={false}
                    selfRequestData={this.selfRequestData}
                  />
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

