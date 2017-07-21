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
import styles from './Home.less';

const effects = {
  allInfo: 'report/getAllInfo',
  chartTableInfo: 'report/getChartTableInfo',
  oneChartInfo: 'report/getOneChartInfo',
  exportExcel: 'report/exportExcel',
  collectData: 'report/collectData',
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
  collectData: fectchDataFunction(false, effects.collectData),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ReportHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getAllInfo: PropTypes.func.isRequired,
    getOneChartInfo: PropTypes.func.isRequired,
    getChartTableInfo: PropTypes.func.isRequired,
    performance: PropTypes.array,
    exportExcel: PropTypes.func.isRequired,
    collectData: PropTypes.func.isRequired,
    chartInfo: PropTypes.array,
    chartTableInfo: PropTypes.object,
    custRange: PropTypes.array,
    visibleBoards: PropTypes.array,
    globalLoading: PropTypes.bool,
    preView: PropTypes.bool,
    reportName: PropTypes.string,
    boardId: PropTypes.number,
    boardType: PropTypes.string,
  }

  static defaultProps = {
    performance: [],
    chartInfo: [],
    chartTableInfo: {},
    globalLoading: false,
    custRange: [],
    visibleBoards: [],
    preView: false,
    reportName: '',
    boardId: 1,
    boardType: 'TYPE_TGJX',
    collectData: () => {},
  }

  constructor(props) {
    super(props);
    // 页面初始化的时候，后续将不再Url中获取到Duration & org
    // 只会传递一个boardId和boardType过来
    // 1.首先判断是否预览页面
    const { preView } = this.props;
    // 时间段默认值为 'month'
    const duration = getDurationString('month');
    const initialState = {};
    if (!preView) {
      // 正常普通页面，从页面中获取boardId
      const { location: { query: { boardId, boardType } } } = this.props;
      initialState.boardId = boardId || 1; // 默认取第一个看板，目前是 1
      initialState.boardType = boardType || 'TYPE_TGJX'; // 如果用户手动输入boardId，而没有boardType咋办
    } else {
      // 预览页面，值会传递过来
      const { boardId, boardType } = this.props;
      initialState.boardId = boardId;
      initialState.boardType = boardType;
    }
    // 刚进入页面的时候用户的组织机构树还没获取到
    this.state = {
      ...duration,
      ...initialState,
      showCharts: {},
      classifyScope: {},
      classifyOrder: {},
    };
  }

  componentWillMount() {
    // 初始化的时候state里面还无参数
    this.getInfo();
  }

  componentWillReceiveProps(nextProps) {
    // 判断props是否变化
    // 因为新的参数存放在state里面，所以props只有咋boarId变化时候，才会查询数据
    // 此处不需要担心预览也蛮
    const { location: { query: { boardId } } } = nextProps;
    const {
      location: { query: { boardId: preBoardId } },
    } = this.props;

    // 还是chart部分的数据
    if (!_.isEqual(preBoardId, boardId)) {
      const { custRange } = this.props;
      const { begin, end, cycleType } = getDurationString('month');
      // 修改state
      this.setState({
        showCharts: {},
        classifyScope: {},
        classifyOrder: {},
        boardId,
        begin,
        end,
        cycleType,
        orgId: custRange[0].id,
        scope: (Number(custRange[0].level) + 1),
        custRangeLevel: custRange[0].level,
      },
      () => {
        this.getInfo();
      });
    }
  }

  @autobind
  getApiParams(param) {
    // 所有查询参数全部放入到state里面来维护
    // 调用该方法的时候，数据全部已经取到了
    const { custRange } = this.props;
    const { begin, cycleType, end, boardId } = this.state;
    const { orgId, custRangeLevel, scope } = this.state;
    // 整理参数数据，如果么有数据，全部使用默认的值
    const payload = {
      orgId: orgId || (custRange[0] && custRange[0].id),
      scope: scope ||
      (custRangeLevel ? (Number(custRangeLevel) + 1) : (Number(custRange[0].level) + 1)),
      orderType: 'desc',
      begin,
      end,
      cycleType,
      localScope: custRangeLevel || (custRange[0] && custRange[0].level),
      boardId,
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
  getInfo() {
    const { getAllInfo } = this.props;
    const { boardId, begin, end, cycleType, orgId, custRangeLevel, scope } = this.state;
    const empId = getEmpId(); // 用户ID
    // 整理数据
    const payload = {
      orgId,
      begin,
      end,
      cycleType,
      localScope: custRangeLevel,
      boardId,
      scope,
    };

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

  // 获取分类明细指标数据的方法
  @autobind
  selfRequestData(param) {
    const { getOneChartInfo } = this.props;
    const payload = this.getApiParams(param);
    getOneChartInfo(payload);
  }

  // 以下3个方法是用来控制：
  // 表格/柱状图切换
  // 排序的切换
  // 维度的切换
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

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(state) {
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    this.setState({
      ...state,
      showCharts: {},
      classifyScope: {},
      classifyOrder: {},
    },
    () => {
      this.getInfo();
    });
  }

  // 导出 excel 文件
  @autobind
  handleExportExcel(param) {
    const { exportExcel } = this.props;
    const payload = this.getApiParams(param);
    exportExcel({ query: queryToString(payload) });
  }

  @autobind
  findBoardBy(id) {
    const { visibleBoards } = this.props;
    const newId = Number.parseInt(id, 10);
    const board = _.find(visibleBoards, { id: newId });
    return board || visibleBoards[0];
  }

  render() {
    // 本页面必须在渠道custRange和visibleBoards后才能展示
    const { custRange, visibleBoards } = this.props;
    if (!custRange || !custRange.length || !visibleBoards || !visibleBoards.length) {
      return null;
    }
    const { performance, chartInfo, chartTableInfo } = this.props;
    const { location, replace, push, reportName, preView, collectData } = this.props;
    // 因为新的数据查询参数全部存放在了state里面
    const { showCharts, classifyScope, classifyOrder } = this.state;
    const { boardId, custRangeLevel, scope, boardType } = this.state;
    const level = custRangeLevel || (custRange[0] && custRange[0].level);
    const newscope = Number(scope) || (custRange[0] && Number(custRange[0].level) + 1);
    // 用来判断是否投顾绩效,
    let showScopeOrder = this.findBoardBy(boardId).boardType === 'TYPE_TGJX';
    if (preView) {
      showScopeOrder = boardType === 'TYPE_TGJX';
    }

    return (
      <div className="page-invest content-inner">
        <PageHeader
          location={location}
          replace={replace}
          push={push}
          custRange={custRange}
          visibleBoards={visibleBoards}
          preView={preView}
          reportName={reportName}
          updateQueryState={this.updateQueryState}
          collectData={collectData}
        />
        <div className={styles.reportBody}>
          <PerformanceItem
            data={performance}
          />
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
                    collectData={collectData}
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

