/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-05 15:47:47
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
import CustomerRepeatAnalyze from '../../components/choicenessCombination/combinationDetail/CustomerRepeatAnalyze';
import Overview from '../../components/choicenessCombination/combinationDetail/Overview';
import Composition from '../../components/choicenessCombination/combinationDetail/Composition';
import { openRctTab } from '../../utils';
import {
  permission, dva, url as urlHelper, emp
} from '../../helper';
import { seperator } from '../../config';
import { chartTabList, sourceType, securityType } from '../../components/choicenessCombination/config';
import logable from '../../decorators/logable';
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
  // 获取组合树
  getCombinationTree: 'combinationDetail/getCombinationTree',
  // 获取趋势折线图
  getCombinationLineChart: 'combinationDetail/getCombinationLineChart',
  // 获取订购客户数据
  getOrderingCustList: 'combinationDetail/getOrderingCustList',
  // 请求历史报告数据
  getReportHistoryList: 'combinationDetail/getReportHistoryList',
  // 查询持仓客户重复数据
  queryHoldRepeatProportion: 'combinationDetail/queryHoldRepeatProportion',
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
  // 组合详情-持仓客户重复数据
  custRepeatData: state.combinationDetail.custRepeatData,
});
const mapDispatchToProps = {
  getOverview: dispatch(effects.getOverview,
    {
      loading: true,
      forceFull: true
    }),
  getCompositionPie: dispatch(effects.getCompositionPie,
    {
      loading: true,
      forceFull: true
    }),
  querySecurityList: dispatch(effects.querySecurityList,
    {
      loading: true,
      forceFull: true
    }),
  getAdjustWarehouseHistory: dispatch(effects.getAdjustWarehouseHistory,
    {
      loading: true,
      forceFull: true
    }),
  getCombinationTree: dispatch(effects.getCombinationTree,
    {
      loading: true,
      forceFull: true
    }),
  getCombinationLineChart: dispatch(effects.getCombinationLineChart,
    {
      loading: true,
      forceFull: true
    }),
  getOrderingCustList: dispatch(effects.getOrderingCustList,
    {
      loading: true,
      forceFull: true
    }),
  getReportHistoryList: dispatch(effects.getReportHistoryList,
    {
      loading: true,
      forceFull: true
    }),
  push: routerRedux.push,
  queryHoldRepeatProportion: dispatch(effects.queryHoldRepeatProportion,
    {
      loading: true,
      forceFull: true
    }),
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
    // 组合详情- 查询持仓客户重复数据
    queryHoldRepeatProportion: PropTypes.func.isRequired,
    custRepeatData: PropTypes.object.isRequired,
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
      // hasTkMampPermission: true,
      // 组织 ID
      orgId: emp.getOrgId(),
    };
  }

  componentDidMount() {
    const {
      hasTkMampPermission,
    } = this.state;
    const {
      getOverview,
      getCompositionPie,
      querySecurityList,
      getAdjustWarehouseHistory,
      getCombinationTree,
      getCombinationLineChart,
      getOrderingCustList,
      getReportHistoryList,
      queryHoldRepeatProportion,
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
    }).then(() => {
      const { overview } = this.props;
      // 如果是资产配置类组合默认查询一年的数据
      const key = _.isNull(overview.weekEarnings)
        ? chartTabList[1].key : chartTabList[0].key;
      // 趋势图
      getCombinationLineChart({
        combinationCode: id,
        key,
      });
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
    // 获取组合树
    getCombinationTree();
    // 查询历史报告模块数据, 非历史报告弹窗
    getReportHistoryList({
      combinationCode: id,
      pageNum: 1,
      pageSize: 6,
    });
    // 如果有任务管理岗职责查询持仓客户重合数据，否则查询订购客户
    if (hasTkMampPermission) {
      queryHoldRepeatProportion({
        orgId: emp.getOrgId(),
        combinationCode: id,
      });
    } else {
      // 订购客户
      getOrderingCustList({
        pstnId: emp.getPstnId(),
        orgId: emp.getOrgId(),
        combinationCode: id,
        pageNum: 1,
        pageSize: 5,
      });
    }
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
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '关闭弹窗',
      type: '精选组合',
      subtype: '组合详情',
      value: '$props.location.query.modalType',
    }
  })
  closeModal() {
    const { replace } = this.context;
    const { location: { pathname, query: { id, name } } } = this.props;
    replace({
      pathname,
      query: {
        id,
        name,
        visible: false,
      },
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
  @logable({
    type: 'Click',
    payload: {
      name: '进入客户列表',
      type: '组合详情',
      subType: '订购客户',
      value: '$args[0]'
    },
  })
  openCustomerListPage(obj) {
    const { push } = this.context;
    const {
      name, code, type, source, combinationCode
    } = obj;
    const query = {
      source,
    };
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'RCT_FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    // sourceType.security： 证券产品 sourceType.combination：组合类产品
    // 在location上filter的name与value之间使用该变量分割
    // filter value对应多个
    const { filterInsideSeperator, filterValueSeperator } = seperator;
    if (source === sourceType.security) {
      const filterType = _.filter(securityType, o => o.value === type);
      const productId = `${filterType[0].shortName}${code}`;
      if (filterType.length) {
        query.labelMapping = encodeURIComponent(productId);
        query.type = 'PRODUCT';
        query.labelName = encodeURIComponent(`${name}(${code})`);
        query.productName = encodeURIComponent(name);
        query.filters = `primaryKeyPrdts${filterInsideSeperator}${productId}${filterValueSeperator}${name}`;
      } else {
        return;
      }
    } else if (source === sourceType.combination) {
      query.combinationName = encodeURIComponent(name);
      query.labelMapping = code;
      query.combinationCode = combinationCode;
      query.filters = `primaryKeyJxgrps${filterInsideSeperator}${code}${filterValueSeperator}${name}`;
    }
    const url = `/customerPool/list?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: '/customerPool/list',
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
    const url = `/strategyCenter/stock?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: '/strategyCenter/stock',
      query,
    });
  }

  // 打开历史报告详情页
  @autobind
  openReportDetailPage(obj) {
    const { push } = this.context;
    const { id } = obj;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_JX_GROUP_REPORT_DETAIL',
      title: '历史报告详情',
    };
    const query = {
      id,
    };
    const url = `/strategyCenter/choicenessCombination/reportDetail?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: '/strategyCenter/choicenessCombination/reportDetail',
      query,
    });
  }

  render() {
    const {
      overview,
      compositionPie,
      compositionTable,
      adjustWarehouseHistoryData,
      tableHistoryList,
      combinationTreeList,
      combinationLineChartData,
      getAdjustWarehouseHistory,
      orderCustData,
      getReportHistoryList,
      reportHistoryData,
      modalReportHistoryData,
      custRepeatData,
      location,
      location: {
        query: {
          id, visible = false, modalType = '', name
        }
      },
    } = this.props;
    const {
      hasTkMampPermission,
    } = this.state;
    const modalProps = {
      history: {
        title: '调仓历史',
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
        // 打开历史报告详情页面
        openReportDetailPage: this.openReportDetailPage,
      },
    };

    return (
      <div className={styles.combinationDetailBox}>
        <Overview data={overview} titleName={name} />
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
              combinationItemData={overview}
              chartData={combinationLineChartData}
              chartHeight="270px"
              title="组合收益率走势"
              isDetail
            />
          </div>
        </div>
        <div className={styles.floor}>
          <HistoryReport
            combinationCode={id}
            data={reportHistoryData}
            showModal={this.showModal}
            openReportDetailPage={this.openReportDetailPage}
          />
          {
            hasTkMampPermission
              ? (
                <CustomerRepeatAnalyze
                  combinationCode={id}
                  data={custRepeatData}
                  combinationData={overview}
                  openCustomerListPage={this.openCustomerListPage}
                />
              )
              : (
                <OrderingCustomer
                  combinationCode={id}
                  data={orderCustData}
                  pageChange={this.handleOrderCustPageChange}
                  combinationData={overview}
                  openCustomerListPage={this.openCustomerListPage}
                />
              )
          }
        </div>
        {
          visible
            ? (
              <CombinationModal
                location={location}
              // 关闭弹窗
                closeModal={this.closeModal}
                {...modalProps[modalType]}
              />
            )
            : null
        }
      </div>
    );
  }
}
