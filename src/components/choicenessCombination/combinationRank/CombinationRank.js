/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-10 15:49:04
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';


import InfoTitle from '../../common/InfoTitle';
import CombinationFilter from './CombinationFilter';
import CombinationListItem from './CombinationListItem';
import styles from './combinationRank.less';

const titleStyle = {
  fontSize: '16px',
};

export default class CombinationRank extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 字典
    dict: PropTypes.object.isRequired,
    // type切换
    onTypeChange: PropTypes.func.isRequired,
    // 筛选
    // filterChange: PropTypes.func.isRequired,
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
    riskLevel: PropTypes.string,
    // 打开个股资讯页面
    openStockPage: PropTypes.func.isRequired,
    // 打开持仓查客户页面
    openCustomerListPage: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    // 打开详情页面
    openDetailPage: PropTypes.func.isRequired,
    // 投资顾问
    creatorList: PropTypes.array.isRequired,
    // 清空数据
    clearData: PropTypes.func.isRequired,
    adviser: PropTypes.object.isRequired,
  }

  static defaultProps = {
    yieldRankValue: '',
    riskLevel: '',
  }

  @autobind
  getCombinationList() {
    const {
      combinationRankList,
      chartTabChange,
      combinationLineChartData,
      getCombinationLineChart,
      rankTabActiveKey,
      yieldRankValue,
      dict,
      openStockPage,
      openCustomerListPage,
      showModal,
      openDetailPage,
    } = this.props;
    return combinationRankList.map(item => (
      <CombinationListItem
        showModal={showModal}
        rankTabActiveKey={rankTabActiveKey}
        data={item}
        key={item.combinationCode}
        chartTabChange={chartTabChange}
        getCombinationLineChart={getCombinationLineChart}
        combinationLineChartData={combinationLineChartData}
        yieldRankValue={yieldRankValue}
        dict={dict}
        openStockPage={openStockPage}
        openCustomerListPage={openCustomerListPage}
        openDetailPage={openDetailPage}
      />
    ));
  }

  render() {
    const {
      location,
      dict,
      onTypeChange,
      // filterChange,
      combinationTreeList,
      yieldRankChange,
      yieldRankValue,
      riskLevelFilter,
      riskLevel,
      creatorList,
      clearData,
      rankTabActiveKey,
      adviser,
    } = this.props;
    return (
      <div className={styles.combinationRankBox}>
        <InfoTitle
          head="组合排名"
          titleStyle={titleStyle}
        />
        <div className={styles.containerBox}>
          <CombinationFilter
            location={location}
            yieldRankChange={yieldRankChange}
            yieldRankValue={yieldRankValue}
            riskLevelFilter={riskLevelFilter}
            riskLevel={riskLevel}
            composeType={combinationTreeList}
            dict={dict}
            onTypeChange={onTypeChange}
            creatorList={creatorList}
            clearData={clearData}
            rankTabActiveKey={rankTabActiveKey}
            adviser={adviser}
          />
          <div className={styles.combinationListBox}>
            {this.getCombinationList()}
          </div>
        </div>
      </div>
    );
  }
}
