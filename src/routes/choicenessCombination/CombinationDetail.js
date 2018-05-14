/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-14 14:12:43
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import fspPatch from '../../decorators/fspPatch';
import CombinationModal from '../../components/choicenessCombination/CombinationModal';
import AdjustHistory from '../../components/choicenessCombination/combinationDetail/AdjustHistory';
import CombinationYieldChart from '../../components/choicenessCombination/CombinationYieldChart';
import HistoryReport from '../../components/choicenessCombination/combinationDetail/HistoryReport';
import OrderingCustomer from '../../components/choicenessCombination/combinationDetail/OrderingCustomer';
import Overview from '../../components/choicenessCombination/combinationDetail/Overview';
import Composition from '../../components/choicenessCombination/combinationDetail/Composition';
import { openRctTab } from '../../utils';
import { permission, dva, url as urlHelper, emp } from '../../helper';
import config from '../../components/choicenessCombination/config';
import styles from './combinationDetail.less';

const dispatch = dva.generateEffect;
const effects = {
  // 组合概览
  getOverview: 'combinationDetail/getOverview',
  // 组合构成-饼图
  getCompositionPie: 'combinationDetail/getCompositionPie',
  // 组合构成-表格
  querySecurityList: 'combinationDetail/querySecurityList',
  // 获取调仓历史
  getAdjustWarehouseHistory: 'combinationDetail/getAdjustWarehouseHistory',
  // 获取组合证券构成数据/获取近一周表现前十的证券
  getCombinationSecurityList: 'combinationDetail/getCombinationSecurityList',
  // 获取组合树
  getCombinationTree: 'combinationDetail/getCombinationTree',
  // 获取趋势折线图
  getCombinationLineChart: 'combinationDetail/getCombinationLineChart',
  // 获取订购客户数据
  getOrderingCustList: 'combinationDetail/getOrderingCustList',
  // 请求历史报告数据
  getReportHistoryList: 'combinationDetail/getReportHistoryList',
  // 历史报告详情
  getReportDetail: 'combinationDetail/getReportDetail',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // 组合概览
  overview: state.combinationDetail.overview,
  // 组合构成-饼图
  compositionPie: state.combinationDetail.compositionPie,
  // 组合构成-表格
  compositionTable: state.combinationDetail.compositionTable,
  // 调仓历史数据
  adjustWarehouseHistoryData: state.combinationDetail.adjustWarehouseHistoryData,
  // 弹窗调仓历史数据
  tableHistoryList: state.combinationDetail.tableHistoryList,
  // 组合调仓数据
  combinationAdjustHistoryData: state.combinationDetail.combinationAdjustHistoryData,
  // 组合树列表数据
  combinationTreeList: state.combinationDetail.combinationTreeList,
  // 折线图数据
  combinationLineChartData: state.combinationDetail.combinationLineChartData,
  // 订购客户数据
  orderCustData: state.combinationDetail.orderCustData,
  // 组合详情-历史报告模块数据
  reportHistoryData: state.combinationDetail.reportHistoryData,
  // 组合详情-历史报告弹窗数据
  modalReportHistoryData: state.combinationDetail.modalReportHistoryData,
  // 历史报告详情
  reportDetail: state.combinationDetail.reportDetail,
});
const mapDispatchToProps = {
  getOverview: dispatch(effects.getOverview, { loading: true }),
  getCompositionPie: dispatch(effects.getCompositionPie, { loading: true }),
  querySecurityList: dispatch(effects.querySecurityList, { loading: true }),
  getAdjustWarehouseHistory: dispatch(effects.getAdjustWarehouseHistory, { loading: true }),
  getCombinationSecurityList: dispatch(effects.getCombinationSecurityList, { loading: true }),
  getCombinationTree: dispatch(effects.getCombinationTree, { loading: true }),
  getCombinationLineChart: dispatch(effects.getCombinationLineChart, { loading: true }),
  getOrderingCustList: dispatch(effects.getOrderingCustList, { loading: true }),
  getReportHistoryList: dispatch(effects.getReportHistoryList, { loading: true }),
  getReportDetail: dispatch(effects.getReportDetail, { loading: true }),
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@fspPatch()
export default class CombinationDetail extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 字典数据
    dict: PropTypes.object.isRequired,
    // 概览
    getOverview: PropTypes.func.isRequired,
    overview: PropTypes.object.isRequired,
    // 组合构成-饼图
    getCompositionPie: PropTypes.func.isRequired,
    compositionPie: PropTypes.array.isRequired,
    // 组合构成-表格
    querySecurityList: PropTypes.func.isRequired,
    compositionTable: PropTypes.array.isRequired,
    // 获取调仓历史数据
    getAdjustWarehouseHistory: PropTypes.func.isRequired,
    adjustWarehouseHistoryData: PropTypes.object.isRequired,
    // 获取组合证券构成数据/获取近一周表现前十的证券
    getCombinationSecurityList: PropTypes.func.isRequired,
    tableHistoryList: PropTypes.object.isRequired,
    // 组合树列表数据
    getCombinationTree: PropTypes.func.isRequired,
    combinationTreeList: PropTypes.array.isRequired,
    // 请求折线图数据
    getCombinationLineChart: PropTypes.func.isRequired,
    combinationLineChartData: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    // 订购客户数据
    getOrderingCustList: PropTypes.func.isRequired,
    orderCustData: PropTypes.object.isRequired,
    // 历史报告数据
    getReportHistoryList: PropTypes.func.isRequired,
    // 组合详情-历史报告模块数据
    reportHistoryData: PropTypes.object.isRequired,
    // 组合详情-历史报告弹窗数据
    modalReportHistoryData: PropTypes.object.isRequired,
    // 历史报告详情
    getReportDetail: PropTypes.func.isRequired,
    reportDetail: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // HTSC 任务管理岗
      hasTkMampPermission: permission.hasTkMampPermission(),
      // 组织 ID
      orgId: emp.getOrgId(),
    };
  }

  componentDidMount() {
    const {
      getOverview,
      getCompositionPie,
      querySecurityList,
      getAdjustWarehouseHistory,
      getCombinationSecurityList,
      getCombinationTree,
      getCombinationLineChart,
      getOrderingCustList,
      getReportHistoryList,
      location: { query: { id } },
    } = this.props;
    // 调仓方向传 3 视为取最新两条数据
    const payload = {
      combinationCode: id,
      pageSize: 5,
      pageNum: 1,
    };
    // 获取概览
    getOverview({
      combinationCode: id,
    });
    // 饼图
    getCompositionPie({
      combinationCode: id,
    });
    // 组合构成-表格
    querySecurityList({
      combinationCode: id,
      securityType: 0,
    });
    // 调仓历史
    getAdjustWarehouseHistory(payload);
    getCombinationSecurityList();
    // 获取组合树
    getCombinationTree();
    // 趋势图
    getCombinationLineChart({
      combinationCode: id,
      key: '3',
    });
    // 查询历史报告模块数据, 非历史报告弹窗
    getReportHistoryList({
      combinationCode: id,
      pageNum: 1,
      pageSize: 6,
    });
    // 订购客户
    getOrderingCustList({
      pstnId: emp.getPstnId(),
      orgId: emp.getOrgId(),
      combinationCode: id,
      pageNum: 1,
      pageSize: 5,
    });
  }

  @autobind
  handleOrderCustPageChange(page) {
    const {
      getOrderingCustList,
      location: { query: { id } },
    } = this.props;
    getOrderingCustList({
      pstnId: emp.getPstnId(),
      orgId: emp.getOrgId(),
      combinationCode: id,
      pageNum: page.current,
      pageSize: page.pageSize,
    });
  }

  // 打开弹窗
  @autobind
  showModal(obj) {
    const { replace } = this.context;
    const { location: { query = { }, pathname }, combinationTreeList } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        visible: true,
        modalType: obj.type || '',
        directionCode: obj.directionCode || '',
        combinationCode: obj.combinationCode || combinationTreeList[0].value || '',
      },
    });
  }

  // 关闭弹窗
  @autobind
  closeModal() {
    const { replace } = this.context;
    const { location: { pathname, query: { id } } } = this.props;
    replace({
      pathname,
      query: { id },
    });
  }

  // 图表tab切换
  @autobind
  handleChartTabChange(payload) {
    const { getCombinationLineChart } = this.props;
    getCombinationLineChart(payload);
  }

  // 查看持仓客户
  @autobind
  openCustomerListPage(obj) {
    const { push } = this.context;
    const { name, code, type, source } = obj;
    const { sourceType } = config;
    const query = {
      source,
    };
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    // sourceType.security： 证券产品 sourceType.combination：组合类产品
    if (source === sourceType.security) {
      const filterType = _.filter(config.securityType, o => o.value === type);
      if (filterType.length) {
        query.labelMapping = `${filterType[0].shortName}${code}`;
      } else {
        return;
      }
    } else if (source === sourceType.combination) {
      query.combinationName = encodeURIComponent(name);
      query.labelMapping = code;
    }
    const url = `/customerPool/list?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: url,
      query,
    });
  }

  @autobind
  openStockPage(obj) {
    const { code } = obj;
    const { push } = this.context;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_STOCK_INFO',
      title: '个股资讯',
    };
    const query = {
      keyword: code,
    };
    const url = `/stock?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: url,
      query,
    });
  }

  // 打开历史报告详情
  @autobind
  openReportDetail(reportId) {
    const { push } = this.context;
    const { location: { query: { id } } } = this.props;
    const query = {
      id: reportId,
      combinationCode: id,
    };
    const url = `/choicenessCombination/reportDetail?${urlHelper.stringify(query)}`;
    push(url);
  }

  render() {
    const {
      overview,
      compositionPie,
      compositionTable,
      getCombinationTree,
      adjustWarehouseHistoryData,
      tableHistoryList,
      combinationTreeList,
      combinationLineChartData,
      getAdjustWarehouseHistory,
      orderCustData,
      getReportHistoryList,
      reportHistoryData,
      modalReportHistoryData,
      location,
      location: { query: { id, visible = false, modalType = '' } },
    } = this.props;
    const {
      directionCode,
      hasTkMampPermission,
    } = this.state;
    const modalProps = {
      history: {
        title: '调仓历史',
        // 调仓方向集合
        direction: directionCode,
        // 获取组合名称树接口
        getTreeData: getCombinationTree,
        // 组合名称树数据
        treeData: combinationTreeList,
        // 获取列表接口
        getListData: getAdjustWarehouseHistory,
        // 列表数据
        listData: tableHistoryList,
        // 查看持仓客户事件
        openCustomerListPage: this.openCustomerListPage,
      },
      report: {
        title: '历史报告',
        // 组合名称树数据
        treeData: combinationTreeList,
        // 获取列表接口
        getListData: getReportHistoryList,
        // 列表数据
        listData: modalReportHistoryData,
      },
    };

    return (
      <div className={styles.combinationDetailBox}>
        <Overview data={overview} />
        <div className={styles.composition}>
          <Composition pieData={compositionPie} tableData={compositionTable} />
        </div>
        <div className={styles.floor}>
          <AdjustHistory
            combinationCode={id}
            data={adjustWarehouseHistoryData}
            showModal={this.showModal}
            openStockPage={this.openStockPage}
          />
          <div className={styles.yieldChartBox}>
            <CombinationYieldChart
              combinationCode={id}
              tabChange={this.handleChartTabChange}
              combinationItemData={{}}
              chartData={combinationLineChartData}
              chartHeight="270px"
              title="组合收益率走势"
            />
          </div>
        </div>
        <div className={styles.floor}>
          <HistoryReport
            combinationCode={id}
            data={reportHistoryData}
            showModal={this.showModal}
            openReportDetail={this.openReportDetail}
          />
          {
            hasTkMampPermission ?
              null
              :
              <OrderingCustomer
                data={orderCustData}
                pageChange={this.handleOrderCustPageChange}
              />
          }
        </div>
        {
          visible
          ?
            <CombinationModal
              location={location}
              // 关闭弹窗
              closeModal={this.closeModal}
              {...modalProps[modalType]}
            />
          :
            null
        }
      </div>
    );
  }
}
