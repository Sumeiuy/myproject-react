/*
 * @Author: XuWenKang
 * @Description: 精选组合home
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-27 09:57:36
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
// import _ from 'lodash';
import styles from './index.less';
import dva from '../../helper/dva';
import CombinationAdjustHistory from '../../components/choicenessCombination/CombinationAdjustHistory';
import WeeklySecurityTopTen from '../../components/choicenessCombination/WeeklySecurityTopTen';
import CombinationRank from '../../components/choicenessCombination/combinationRank/CombinationRank';

const dispatch = dva.generateEffect;
const EMPTY_LIST = [];
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
};

const mapStateToProps = state => ({
  // 调仓历史数据
  adjustWarehouseHistoryData: state.choicenessCombination.adjustWarehouseHistoryData,
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
});
const mapDispatchToProps = {
  getAdjustWarehouseHistory: dispatch(effects.getAdjustWarehouseHistory, { loading: false }),
  getCombinationSecurityList: dispatch(effects.getCombinationSecurityList, { loading: false }),
  getCombinationTree: dispatch(effects.getCombinationTree, { loading: false }),
  getCombinationRankList: dispatch(effects.getCombinationRankList, { loading: true }),
  getCombinationLineChart: dispatch(effects.getCombinationLineChart, { loading: true }),
  combinationRankTabchange: dispatch(effects.combinationRankTabchange, { loading: false }),
  yieldRankChange: dispatch(effects.yieldRankChange, { loading: false }),
  riskLevelFilter: dispatch(effects.riskLevelFilter, { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ChoicenessCombination extends PureComponent {
  static propTypes = {
    // 获取调仓历史数据
    getAdjustWarehouseHistory: PropTypes.func.isRequired,
    // 获取组合证券构成数据/获取近一周表现前十的证券
    getCombinationSecurityList: PropTypes.func.isRequired,
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
    riskLevel: PropTypes.array,
  }

  static defaultProps = {
    yieldRankValue: '',
    riskLevel: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const {
      getCombinationTree,
      getCombinationRankList,
    } = this.props;
    // 先获取组合树，然后用组合树的第一个组合类别id查询组合排名数据
    getCombinationTree().then(() => {
      const { combinationTreeList } = this.props;
      getCombinationRankList({
        combinationType: (combinationTreeList[0] || EMPTY_OBJECT).value,
      });
    });
  }

  // 组合排名列表筛选排序
  @autobind
  handleFilterChange(data) {
    console.log('组合排名列表筛选排序', data);
  }

  // tab切换
  @autobind
  handleTabChange(key) {
    const { getCombinationRankList, combinationRankTabchange } = this.props;
    // 将tab选中的key和redux中的rankTabActiveKey 同步
    combinationRankTabchange({ key });
    // 查询组合排名数据
    getCombinationRankList({
      combinationType: key,
    });
    console.log('tabId', key);
  }

  // 图表tab切换
  @autobind
  handleChartTabChange(payload) {
    console.log('图表tab切换', payload);
    const { getCombinationLineChart } = this.props;
    getCombinationLineChart(payload);
  }

  render() {
    const {
      combinationTreeList,
      combinationRankList,
      combinationLineChartData,
      getCombinationLineChart,
      rankTabActiveKey,
      yieldRankChange,
      yieldRankValue,
      riskLevelFilter,
      riskLevel,
    } = this.props;
    return (
      <div className={styles.choicenessCombinationBox}>
        <div className={`${styles.topContainer} clearfix`}>
          <CombinationAdjustHistory />
          <WeeklySecurityTopTen />
        </div>
        <CombinationRank
          combinationTreeList={combinationTreeList}
          combinationRankList={combinationRankList}
          filterChange={this.handleFilterChange}
          tabChange={this.handleTabChange}
          chartTabChange={this.handleChartTabChange}
          getCombinationLineChart={getCombinationLineChart}
          combinationLineChartData={combinationLineChartData}
          rankTabActiveKey={rankTabActiveKey}
          yieldRankChange={yieldRankChange}
          yieldRankValue={yieldRankValue}
          riskLevelFilter={riskLevelFilter}
          riskLevel={riskLevel}
        />
      </div>
    );
  }
}
