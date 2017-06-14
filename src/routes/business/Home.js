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
  chartTableInfo: 'business/getChartTableInfo',
  oneChartInfo: 'business/getOneChartInfo',
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
export default class BusinessHome extends PureComponent {

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

  constructor(props) {
    super(props);
    const { location: { query: { cycleType, boardId } } } = this.props;
    const value = cycleType || 'month';
    const obj = getDurationString(value);
    this.state = {
      ...obj,
      boardId: boardId || '2',
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
    // const duration = this.state;
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
    const { begin, cycleType, end, boardId } = this.state;
    const {
      begin: qBegin,
      cycleType: qCycleType,
      end: qEnd,
      orgId,
      custRangeLevel,
      scope,
      orderType,
    } = queryObj;

    const payload = {
      orgId: orgId || '',
      begin: qBegin || begin,
      end: qEnd || end,
      cycleType: qCycleType || cycleType,
      localScope: custRangeLevel,
      boardId,
    };
    const pickProps = ['orgId', 'begin', 'end', 'cycleType', 'localScope', 'boardId'];
    getAllInfo({
      custRange: {
        empId: getEmpId(),
      },
      performance: {
        scope: custRangeLevel,
        ..._.pick(payload, pickProps),
      },
      chartInfo: {
        scope: scope || Number(custRangeLevel) + 1,
        orderType: orderType || '',
        ..._.pick(payload, pickProps),
      },
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

  // 获取单个卡片接口
  @autobind
  selfRequestData(param) {
    const { getOneChartInfo } = this.props;
    const payload = this.getApiParams(param);
    getOneChartInfo(payload);
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
              const { key, name, data } = item;
              const newChartTable = chartTableInfo[key] || {};
              return (
                <div
                  className={styles.reportPart}
                >
                  <PreformanceChartBoard
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

