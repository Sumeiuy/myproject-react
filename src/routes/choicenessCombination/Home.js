/*
 * @Author: XuWenKang
 * @Description: 精选组合home
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-25 20:12:17
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
// import _ from 'lodash';
import styles from './index.less';
import dva from '../../helper/dva';
import CombinationAdjustHistory from '../../components/choicenessCombination/CombinationAdjustHistory';
import WeeklySecurityTopTen from '../../components/choicenessCombination/WeeklySecurityTopTen';
import CombinationRank from '../../components/choicenessCombination/combinationRank/CombinationRank';

const dispatch = dva.generateEffect;
// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
const effects = {
  // 获取调仓历史
  getAdjustWarehouseHistory: 'choicenessCombination/getAdjustWarehouseHistory',
  // 获取组合证券构成数据/获取近一周表现前十的证券
  getCombinationSecurityList: 'choicenessCombination/getCombinationSecurityList',
};

const mapStateToProps = state => ({
  // 调仓历史数据
  adjustWarehouseHistoryData: state.choicenessCombination.adjustWarehouseHistoryData,
  // 组合调仓数据
  combinationAdjustHistoryData: state.choicenessCombination.combinationAdjustHistoryData,
  // 近一周表现前十的证券
  weeklySecurityTopTenData: state.choicenessCombination.weeklySecurityTopTenData,
});
const mapDispatchToProps = {
  getAdjustWarehouseHistory: dispatch(effects.getAdjustWarehouseHistory, { loading: false }),
  getCombinationSecurityList: dispatch(effects.getCombinationSecurityList, { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ChoicenessCombination extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // 组合排名列表筛选排序
  @autobind
  handleFilterChange(data) {
    console.log('组合排名列表筛选排序', data);
  }

  // tab切换
  @autobind
  handleTabChange(id) {
    console.log('tabId', id);
  }

  // 图表tab切换
  @autobind
  handleChartTabChange(value) {
    console.log('图表tab切换', value);
  }

  render() {
    return (
      <div className={styles.choicenessCombinationBox}>
        <div className={`${styles.topContainer} clearfix`}>
          <CombinationAdjustHistory />
          <WeeklySecurityTopTen />
        </div>
        <CombinationRank
          filterChange={this.handleFilterChange}
          tabChange={this.handleTabChange}
          chartTabChange={this.handleChartTabChange}
        />
      </div>
    );
  }
}
