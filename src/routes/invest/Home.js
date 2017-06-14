/**
 * @file invest/Home.js
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
  allInfo: 'invest/getAllInfo',
  performance: 'invest/getPerformance',
  chartInfo: 'invest/getChartInfo',
  custRange: 'invest/getCustRange',
  chartTableInfo: 'invest/getChartTableInfo',
  exportExcel: 'invest/exportExcel',
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
  exportExcel: fectchDataFunction(true, effects.exportExcel),
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
    exportExcel: PropTypes.func.isRequired,
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

  constructor(props) {
    super(props);
    const { location: { query: { cycleType, boardId } } } = this.props;
    const value = cycleType || 'month';
    const obj = getDurationString(value);
    this.state = {
      ...obj,
      boardId: boardId || '1',
      showCharts: {},
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    this.getInfo({
      ...query,
      scope: query.scope || Number(query.custRangeLevel) + 1,
    });
  }

  componentWillReceiveProps(nextProps) {
    // 判断props是否变化
    const { location: { query } } = nextProps;
    const {
      location: { query: preQuery },
    } = this.props;

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
      // 修改state
      this.setState({
        showCharts: {},
      });
    }
  }

  @autobind
  setGlobalState(obj) {
    this.setState({
      ...obj,
    });
  }
  @autobind
  getApiParams(param) {
    const { custRange, location: { query } } = this.props;
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
    return payload;
  }
  // 投递到子组件的方法，只接收参数，实际请求在此发出
  @autobind
  getTableInfo(obj) {
    const { getChartTableInfo } = this.props;
    const params = {
      pageSize: 10,
      orderIndicatorId: obj.orderIndicatorId || '',
      orderType: obj.orderType || '',
      pageNum: obj.pageNum || 1,
      ...obj,
    };
    const payload = this.getApiParams(params);
    getChartTableInfo(payload);
  }

  @autobind
  getInfo(queryObj) {
    const { getAllInfo, location: { query } } = this.props;
    const obj = this.state;
    const payload = {
      orgId: queryObj.orgId || '',
      begin: queryObj.begin || obj.begin,
      end: queryObj.end || obj.end,
      cycleType: queryObj.cycleType || obj.cycleType,
      localScope: queryObj.custRangeLevel,
      boardId: queryObj.boardId || query.boardId || '1',
    };
    getAllInfo({
      custRange: {
        empId: getEmpId(),
      },
      performance: {
        scope: queryObj.custRangeLevel,
        ..._.pick(payload, ['orgId', 'begin', 'end', 'cycleType', 'localScope', 'boardId']),
      },
      chartInfo: {
        scope: queryObj.scope || Number(queryObj.custRangeLevel) + 1,
        orderType: queryObj.orderType || '',
        ..._.pick(payload, ['orgId', 'begin', 'end', 'cycleType', 'localScope', 'boardId']),
      },
      chartTableInfo: {
        ..._.pick(payload, ['orgId', 'localScope', 'begin', 'end', 'cycleType', 'boardId']),
        scope: queryObj.scope || Number(queryObj.custRangeLevel) + 1,
        orderType: queryObj.orderType || '',
        pageSize: 10,
        pageNum: queryObj.page || '1',
      },
      showChart: query.showChart,
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
  // 更新 showChart
  @autobind
  updateShowCharts(categoryId, type) {
    const { showCharts } = this.state;
    this.setState({
      showCharts: {
        ...showCharts,
        [categoryId]: type,
      },
    });
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
    const { showCharts } = this.state;
    const level = query.custRangeLevel || (custRange[0] && custRange[0].level);
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
          selectDefault="invest"
        />
        <div className={styles.reportBody}>
          <div className={styles.reportPart}>
            <PerformanceItem
              data={performance}
            />
          </div>
          {
            chartInfo.map((item) => {
              const { key, name, data } = item;
              const newChartTable = chartTableInfo[key] || {};
              const showChart = showCharts[key] || 'zhuzhuangtu';
              return (
                <div
                  className={styles.reportPart}
                >
                  <PreformanceChartBoard
                    showChart={showChart}
                    updateShowCharts={this.updateShowCharts}
                    chartData={data}
                    indexID={key}
                    chartTableInfo={newChartTable}
                    getTableInfo={this.getTableInfo}
                    postExcelInfo={this.handleExportExcel}
                    level={level}
                    scope={scope}
                    location={location}
                    replace={replace}
                    boardTitle={name}
                    showScopeOrder
                    selfRequestData={this.selfRequestData}
                  />
                </div>
              );
            })
          }
          {
            /**
             * <div className={styles.reportPart}>
            <PreformanceChartBoard
              chartData={chartInfo}
              chartTableInfo={chartTableInfo}
              postExcelInfo={this.handleExportExcel}
              level={level}
              scope={scope}
              location={location}
              replace={replace}
              indexID={'a'}
              loading={false}
              boardTitle={'指标分布'}
              showScopeOrder
            />
          </div>
             */
          }
        </div>
      </div>
    );
  }
}

