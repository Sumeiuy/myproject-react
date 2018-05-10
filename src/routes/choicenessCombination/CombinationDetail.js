/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合详情
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-10 14:35:48
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';

import styles from './combinationDetail.less';
import { permission, dva, url as urlHelper, emp } from '../../helper';
import config from '../../components/choicenessCombination/config';
import { openRctTab } from '../../utils';
import withRouter from '../../decorators/withRouter';
import CombinationModal from '../../components/choicenessCombination/CombinationModal';
import AdjustHistory from '../../components/choicenessCombination/combinationDetail/AdjustHistory';
import CombinationYieldChart from '../../components/choicenessCombination/CombinationYieldChart';
import HistoryReport from '../../components/choicenessCombination/combinationDetail/HistoryReport';
import OrderingCustomer from '../../components/choicenessCombination/combinationDetail/OrderingCustomer';

const dispatch = dva.generateEffect;
// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
const effects = {
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
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
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
});
const mapDispatchToProps = {
  getAdjustWarehouseHistory: dispatch(effects.getAdjustWarehouseHistory, { loading: false }),
  getCombinationSecurityList: dispatch(effects.getCombinationSecurityList, { loading: false }),
  getCombinationTree: dispatch(effects.getCombinationTree, { loading: false }),
  getCombinationLineChart: dispatch(effects.getCombinationLineChart, { loading: true }),
  getOrderingCustList: dispatch(effects.getOrderingCustList, { loading: false }),
  getReportHistoryList: dispatch(effects.getReportHistoryList, { loading: false }),
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CombinationDetail extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 字典数据
    dict: PropTypes.object.isRequired,
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
      combinationId: id,
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
      combinationId: id,
      pageNum: page.current,
      pageSize: page.pageSize,
    });
  }

  // 打开弹窗
  @autobind
  showModal(obj) {
    this.setState({
      visible: true,
      directionCode: obj.code || '',
      modalType: obj.type || '',
    });
  }

  // 关闭弹窗
  @autobind
  closeModal() {
    this.setState({
      visible: false,
    });
  }

  // 图表tab切换
  @autobind
  handleChartTabChange(payload) {
    console.log('图表tab切换', payload);
    const { getCombinationLineChart } = this.props;
    getCombinationLineChart(payload);
  }

  // 查看持仓客户
  @autobind
  openCustomerListPage(obj) {
    const { name, code, type } = obj;
    const { push } = this.props;
    const { hasTkMampPermission, orgId } = this.state;
    // 组合 productId
    let productId = '';
    if (type) {
      const filterType = _.filter(config.securityType, o => o.value === type);
      if (filterType.length) {
        productId = `${filterType[0].shortName}${code}`;
      }
    } else {
      productId = code;
    }

    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    // GP\JJ\ZQ
    const labelName = `${name}(${code})`;
    const query = {
      labelMapping: encodeURIComponent(productId),
      labelName: encodeURIComponent(labelName),
      orgId: hasTkMampPermission ? orgId : 'msm',
      q: encodeURIComponent(code),
      source: 'association',
      type: 'PRODUCT',
      productName: encodeURIComponent(name),
    };
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
    const { push } = this.props;
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
    console.log('打开个股资讯');
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
  openReportDetail(id) {
    console.log('id', id);
  }

  render() {
    const {
      dict,
      push,
      getCombinationTree,
      adjustWarehouseHistoryData,
      tableHistoryList,
      combinationTreeList,
      combinationLineChartData,
      getCombinationLineChart,
      getAdjustWarehouseHistory,
      orderCustData,
      reportHistoryData,
      location: { query: { id } },
    } = this.props;
    const {
      visible,
      directionCode,
      hasTkMampPermission,
      orgId,
      modalType,
    } = this.state;
    console.log('test',
      dict,
      push,
      adjustWarehouseHistoryData,
      combinationLineChartData,
      getCombinationLineChart,
      hasTkMampPermission,
      orgId,
    );
    const modalProps = {
      history: {
        type: config.typeList[0],
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
        type: config.typeList[1],
        title: '历史报告',
        // 获取组合名称树接口
        getTreeData: getCombinationTree,
        // 组合名称树数据
        treeData: combinationTreeList,
        // 获取列表接口
        getListData: getAdjustWarehouseHistory,
        // 列表数据
        listData: tableHistoryList,
      },
    };

    return (
      <div className={styles.combinationDetailBox}>
        组合详情
        <div className={styles.floor}>
          <AdjustHistory
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
