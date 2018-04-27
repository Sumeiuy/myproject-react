/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-27 09:58:52
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoTitle from '../../common/InfoTitle';
// import Icon from '../common/Icon';
import CombinationTab from './CombinationTab';
import CombinationFilter from './CombinationFilter';
import CombinationListItem from './CombinationListItem';
import styles from './combinationRank.less';

const titleStyle = {
  fontSize: '16px',
};

const EMPTY_LIST = [];

export default class CombinationRank extends PureComponent {
  static propTypes = {
    // tab切换
    tabChange: PropTypes.func.isRequired,
    // 筛选
    filterChange: PropTypes.func.isRequired,
    // 图表tab切换
    chartTabChange: PropTypes.func.isRequired,
    // 组合排名列表数据
    combinationRankList: PropTypes.array.isRequired,
    // 组合树列表数据
    combinationTreeList: PropTypes.array.isRequired,
    // 折线图数据
    getCombinationLineChart: PropTypes.func.isRequired,
    combinationLineChartData: PropTypes.object.isRequired,
    // 组合排名tab当前选择的key
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

  // constructor(props) {
  //   super(props);
  // }

  // @autobind
  // handleTabChange(key) {
  //   const { tabChange } = this.props;
  //   tabChange(key);
  // }

  @autobind
  getCombinationList() {
    const {
      combinationRankList,
      chartTabChange,
      combinationLineChartData,
      getCombinationLineChart,
      rankTabActiveKey,
    } = this.props;
    return combinationRankList.map(item => (
      <CombinationListItem
        rankTabActiveKey={rankTabActiveKey}
        data={item}
        key={item.combinationCode}
        chartTabChange={chartTabChange}
        getCombinationLineChart={getCombinationLineChart}
        combinationLineChartData={combinationLineChartData}
      />
    ));
  }

  render() {
    const {
      tabChange,
      filterChange,
      combinationTreeList,
      yieldRankChange,
      yieldRankValue,
      riskLevelFilter,
      riskLevel,
      rankTabActiveKey,
    } = this.props;
    return (
      <div className={styles.combinationRankBox}>
        <InfoTitle
          head="组合排名"
          titleStyle={titleStyle}
        />
        <div className={styles.containerBox}>
          <CombinationTab
            tabList={combinationTreeList}
            tabChange={tabChange}
            activeKey={rankTabActiveKey}
          />
          <CombinationFilter
            filterChange={filterChange}
            yieldRankChange={yieldRankChange}
            yieldRankValue={yieldRankValue}
            riskLevelFilter={riskLevelFilter}
            riskLevel={riskLevel}
          />
          <div className={styles.combinationListBox}>
            {this.getCombinationList()}
          </div>
        </div>
      </div>
    );
  }
}
