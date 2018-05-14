/*
 * @Author: XuWenKang
 * @Description: 精选组合home
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-14 14:13:33
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import fspPatch from '../../decorators/fspPatch';
import CombinationAdjustHistory from '../../components/choicenessCombination/CombinationAdjustHistory';
import WeeklySecurityTopTen from '../../components/choicenessCombination/WeeklySecurityTopTen';
import CombinationRank from '../../components/choicenessCombination/combinationRank/CombinationRank';
import CombinationModal from '../../components/choicenessCombination/CombinationModal';
import config from '../../components/choicenessCombination/config';
import { permission, dva, url as urlHelper, emp } from '../../helper';
import { openRctTab } from '../../utils';
import styles from './index.less';

const dispatch = dva.generateEffect;
// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const effects = {
  // 获取调仓历史
  getAdjustWarehouseHistory: 'choicenessCombination/getAdjustWarehouseHistory',
  // 获取组合证券构成数据/获取近一周表现前十的证券
  getCombinationSecurityList: 'choicenessCombination/getCombinationSecurityList',
  // 获取组合树
  getCombinationTree: 'choicenessCombination/getCombinationTree',
  // 获取组合排名
  getCombinationRankList: 'choicenessCombination/getCombinationRankList',
  // 获取趋势折线图
  getCombinationLineChart: 'choicenessCombination/getCombinationLineChart',
  // 切换组合排名tab
  combinationRankTabchange: 'choicenessCombination/combinationRankTabchange',
  // 组合排名收益率排序
  yieldRankChange: 'choicenessCombination/yieldRankChange',
  // 组合排名风险筛选
  riskLevelFilter: 'choicenessCombination/riskLevelFilter',
  // 获取历史报告
  getReportHistoryList: 'choicenessCombination/getReportHistoryList',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // 调仓历史数据
  adjustWarehouseHistoryData: state.choicenessCombination.adjustWarehouseHistoryData,
  // 弹窗调仓历史数据
  tableHistoryList: state.choicenessCombination.tableHistoryList,
  // 组合调仓数据
  combinationAdjustHistoryData: state.choicenessCombination.combinationAdjustHistoryData,
  // 近一周表现前十的证券
  weeklySecurityTopTenData: state.choicenessCombination.weeklySecurityTopTenData,
  // 组合树列表数据
  combinationTreeList: state.choicenessCombination.combinationTreeList,
  // 组合排名数据
  combinationRankList: state.choicenessCombination.combinationRankList,
  // 组合排名tab
  rankTabActiveKey: state.choicenessCombination.rankTabActiveKey,
  // 折线图数据
  combinationLineChartData: state.choicenessCombination.combinationLineChartData,
  // 排序value
  yieldRankValue: state.choicenessCombination.yieldRankValue,
  // 风险等级
  riskLevel: state.choicenessCombination.riskLevel,
  // 历史报告
  reportHistoryList: state.choicenessCombination.reportHistoryList,
});
const mapDispatchToProps = {
  getAdjustWarehouseHistory: dispatch(effects.getAdjustWarehouseHistory, { loading: true }),
  getCombinationSecurityList: dispatch(effects.getCombinationSecurityList, { loading: true }),
  getCombinationTree: dispatch(effects.getCombinationTree, { loading: true }),
  getCombinationRankList: dispatch(effects.getCombinationRankList, { loading: true }),
  getCombinationLineChart: dispatch(effects.getCombinationLineChart, { loading: true }),
  combinationRankTabchange: dispatch(effects.combinationRankTabchange, { loading: true }),
  yieldRankChange: dispatch(effects.yieldRankChange, { loading: true }),
  riskLevelFilter: dispatch(effects.riskLevelFilter, { loading: true }),
  getReportHistoryList: dispatch(effects.getReportHistoryList, { loading: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@fspPatch()
export default class ChoicenessCombination extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    // 字典数据
    dict: PropTypes.object.isRequired,
    // 获取调仓历史数据
    getAdjustWarehouseHistory: PropTypes.func.isRequired,
    adjustWarehouseHistoryData: PropTypes.object.isRequired,
    // 获取组合证券构成数据/获取近一周表现前十的证券
    getCombinationSecurityList: PropTypes.func.isRequired,
    tableHistoryList: PropTypes.object.isRequired,
    weeklySecurityTopTenData: PropTypes.array.isRequired,
    // 组合树列表数据
    getCombinationTree: PropTypes.func.isRequired,
    combinationTreeList: PropTypes.array.isRequired,
    // 组合排名数据
    getCombinationRankList: PropTypes.func.isRequired,
    combinationRankList: PropTypes.array.isRequired,
    // 请求折线图数据
    getCombinationLineChart: PropTypes.func.isRequired,
    combinationLineChartData: PropTypes.object.isRequired,
    // 组合排名key
    combinationRankTabchange: PropTypes.func.isRequired,
    rankTabActiveKey: PropTypes.string.isRequired,
    // 组合排名收益率排序
    yieldRankChange: PropTypes.func.isRequired,
    yieldRankValue: PropTypes.string,
    // 组合排名风险筛选
    riskLevelFilter: PropTypes.func.isRequired,
    riskLevel: PropTypes.string,
    // 历史报告
    getReportHistoryList: PropTypes.func.isRequired,
    reportHistoryList: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    yieldRankValue: '',
    riskLevel: '',
  }

  constructor(props) {
    super(props);
    this.state = {
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
      getCombinationRankList,
    } = this.props;
    // 调仓方向传 3 视为取最新两条数据
    const payload = {
      directionCode: '3',
    };
    getAdjustWarehouseHistory(payload);
    getCombinationSecurityList();
    // 先获取组合树，然后用组合树的第一个组合类别id查询组合排名数据
    getCombinationTree().then(() => {
      const { combinationTreeList } = this.props;
      getCombinationRankList({
        combinationType: ((combinationTreeList[0]
          || EMPTY_OBJECT).children[0]
          || EMPTY_OBJECT).value,
      });
    });
  }

  // 打开弹窗
  @autobind
  showModal(obj) {
    console.warn('obj', obj);
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
    const { location: { pathname } } = this.props;
    replace({
      pathname,
      query: {
        visible: false,
      },
    });
  }

  // tab切换
  @autobind
  handleTabChange(key) {
    const { getCombinationRankList, combinationRankTabchange } = this.props;
    combinationRankTabchange({ key });
    // 查询组合排名数据
    getCombinationRankList({
      combinationType: key,
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
    });
  }

  render() {
    const {
      dict,
      location,
      location: { query: { visible = false, modalType = '' } },
      adjustWarehouseHistoryData,
      tableHistoryList,
      weeklySecurityTopTenData,
      combinationTreeList,
      combinationRankList,
      combinationLineChartData,
      getCombinationLineChart,
      rankTabActiveKey,
      yieldRankChange,
      yieldRankValue,
      riskLevelFilter,
      riskLevel,
      getAdjustWarehouseHistory,
      getReportHistoryList,
      reportHistoryList,
    } = this.props;
    const {
      hasTkMampPermission,
      orgId,
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
        listData: reportHistoryList,
      },
    };
    return (
      <div className={styles.choicenessCombinationBox}>
        <div className={`${styles.topContainer} clearfix`}>
          <div className={styles.topContainerChild}>
            {/* 组合调仓组件 */}
            <CombinationAdjustHistory
              showModal={this.showModal}
              data={adjustWarehouseHistoryData}
              openCustomerListPage={this.openCustomerListPage}
              openStockPage={this.openStockPage}
            />
          </div>
          <div className={styles.topContainerChild}>
            <WeeklySecurityTopTen
              data={weeklySecurityTopTenData}
              permission={hasTkMampPermission}
              orgId={orgId}
              openCustomerListPage={this.openCustomerListPage}
              openStockPage={this.openStockPage}
            />
          </div>
        </div>
        <CombinationRank
          showModal={this.showModal}
          combinationTreeList={combinationTreeList}
          combinationRankList={combinationRankList}
          tabChange={this.handleTabChange}
          chartTabChange={this.handleChartTabChange}
          getCombinationLineChart={getCombinationLineChart}
          combinationLineChartData={combinationLineChartData}
          rankTabActiveKey={rankTabActiveKey}
          yieldRankChange={yieldRankChange}
          yieldRankValue={yieldRankValue}
          riskLevelFilter={riskLevelFilter}
          riskLevel={riskLevel}
          dict={dict}
          openStockPage={this.openStockPage}
          openCustomerListPage={this.openCustomerListPage}
        />
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
