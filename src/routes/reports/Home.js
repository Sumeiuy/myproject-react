/**
 * @file reports/Home.js
 *  自定义看板报表页面
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
import { BoardBasic } from '../../config';
import styles from './Home.less';

const effects = {
  allInfo: 'report/getAllInfo',
  chartTableInfo: 'report/getChartTableInfo',
  oneChartInfo: 'report/getOneChartInfo',
  exportExcel: 'report/exportExcel',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  performance: state.report.performance,
  chartInfo: state.report.chartInfo,
  chartTableInfo: state.report.chartTableInfo,
  custRange: state.report.custRange,
  visibleBoards: state.report.visibleBoards,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getOneChartInfo: fectchDataFunction(true, effects.oneChartInfo),
  getChartTableInfo: fectchDataFunction(true, effects.chartTableInfo),
  exportExcel: fectchDataFunction(true, effects.exportExcel),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ReportHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    getAllInfo: PropTypes.func.isRequired,
    performance: PropTypes.array,
    chartInfo: PropTypes.array,
    getChartTableInfo: PropTypes.func.isRequired,
    chartTableInfo: PropTypes.object,
    exportExcel: PropTypes.func.isRequired,
    globalLoading: PropTypes.bool,
    getOneChartInfo: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    visibleBoards: PropTypes.array,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    performance: [],
    chartInfo: [],
    chartTableInfo: {},
    globalLoading: false,
    custRange: [],
    visibleBoards: [],
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
      classifyScope: {},
      classifyOrder: {},
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    this.getInfo({
      ...query,
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
      const boardId = query.boardId;
      const preBoardId = preQuery.boardId;
      let newState = {
        showCharts: {},
        classifyScope: {},
        classifyOrder: {},
      };
      if (boardId !== preBoardId) {
        newState = {
          ...newState,
          boardId,
        };
      }
      // 修改state
      this.setState({
        ...newState,
      },
      () => {
        this.getInfo({
          ...query,
        });
      });
    }
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
    const { getAllInfo } = this.props;
    const { begin, cycleType, end } = this.state;
    const {
      begin: qBegin,
      cycleType: qCycleType,
      end: qEnd,
      orgId,
      custRangeLevel,
      scope,
      boardId,
    } = queryObj;

    const payload = {
      orgId: orgId || '',
      begin: qBegin || begin,
      end: qEnd || end,
      cycleType: qCycleType || cycleType,
      localScope: custRangeLevel,
      boardId: boardId || '1',
      scope,
    };
    const empId = getEmpId();
    getAllInfo({
      custRange: {
        empId,
      },
      performance: {
        ...payload,
        scope: custRangeLevel,
      },
      chartInfo: {
        ...payload,
      },
    });
  }

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
  @autobind
  updateCategoryScope(categoryId, v) {
    const { classifyScope } = this.state;
    this.setState({
      classifyScope: {
        ...classifyScope,
        [categoryId]: v,
      },
    });
  }
  @autobind
  updateCategoryOrder(categoryId, v) {
    const { classifyOrder } = this.state;
    this.setState({
      classifyOrder: {
        ...classifyOrder,
        [categoryId]: v,
      },
    });
  }
  // 导出 excel 文件
  @autobind
  handleExportExcel(param) {
    const { exportExcel } = this.props;
    const payload = this.getApiParams(param);
    exportExcel({ query: queryToString(payload) });
  }

  // 获取单个卡片接口
  @autobind
  selfRequestData(param) {
    const { getOneChartInfo } = this.props;
    const payload = this.getApiParams(param);
    getOneChartInfo(payload);
  }

  @autobind
  findBoardBy(id) {
    const { visibleBoards } = this.props;
    const newId = Number.parseInt(id, 10);
    const board = _.find(visibleBoards, { id: newId });
    return board || visibleBoards[0];
  }

  render() {
    const {
      performance,
      chartInfo,
      chartTableInfo,
      location,
      location: { query },
      replace,
      push,
      custRange,
      visibleBoards,
    } = this.props;
    const { showCharts, classifyScope, classifyOrder, boardId } = this.state;
    const level = query.custRangeLevel || (custRange[0] && custRange[0].level);
    const newscope = Number(query.scope) || (custRange[0] && Number(custRange[0].level) + 1);
    if (!custRange || !custRange.length || !visibleBoards || !visibleBoards.length) {
      return null;
    }
    const showScopeOrder = this.findBoardBy(boardId || '1').boardType === BoardBasic.types[0].key;

    return (
      <div className="page-invest content-inner">
        <PageHeader
          location={location}
          replace={replace}
          push={push}
          custRange={custRange}
          visibleBoards={visibleBoards}
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
              const categoryScope = Number(classifyScope[key]) || newscope;
              const categoryOrder = classifyOrder[key] || 'desc';
              return (
                <div
                  key={key}
                  className={styles.reportPart}
                >
                  <PreformanceChartBoard
                    showChart={showChart}
                    updateShowCharts={this.updateShowCharts}
                    categoryScope={categoryScope}
                    categoryOrder={categoryOrder}
                    updateCategoryScope={this.updateCategoryScope}
                    updateCategoryOrder={this.updateCategoryOrder}
                    chartData={data}
                    indexID={key}
                    chartTableInfo={newChartTable}
                    getTableInfo={this.getTableInfo}
                    postExcelInfo={this.handleExportExcel}
                    level={level}
                    scope={newscope}
                    location={location}
                    replace={replace}
                    boardTitle={name}
                    showScopeOrder={showScopeOrder}
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

