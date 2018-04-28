/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-列表项
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-27 20:52:09
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import Icon from '../../common/Icon';
import CombinationYieldChart from '../CombinationYieldChart';
import styles from './combinationListItem.less';
import { yieldRankList } from '../../../routes/choicenessCombination/config';

const EMPTY_OBJECT = {};
// const EMPTY_LIST = [];

export default class CombinationListItem extends PureComponent {
  static propTypes = {
    // 字典
    // dict: PropTypes.object.isRequired,
    // 图表tab切换
    chartTabChange: PropTypes.func.isRequired,
    // 组合item数据
    data: PropTypes.object,
    // 折线图数据
    getCombinationLineChart: PropTypes.func.isRequired,
    combinationLineChartData: PropTypes.object.isRequired,
    // 组合排名tab当前选择的key
    rankTabActiveKey: PropTypes.string.isRequired,
    // 组合排名收益率排序
    yieldRankValue: PropTypes.string,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    yieldRankValue: '',
  }

  // constructor(props) {
  //   super(props);
  // }

  @autobind
  getHistoryList() {
    const { data } = this.props;
    if (_.isEmpty(data.securityList)) {
      return (
        <div className={styles.noData}>
          <Icon type="meiyouxiangguanjieguo" />
          <span>此组合暂无调仓记录</span>
        </div>
      );
    }
    return data.securityList.map((item, index) => {
      const key = `key${index}`;
      return (
        <div className={`${styles.historyItem} clearfix`} key={key}>
          <span className={styles.securityName}>
            <a title={item.securityName}>{item.securityName}</a>
          </span>
          <span className={styles.securityCode}>
            <a>{item.securityCode}</a>
          </span>
          <span className={styles.direction}>{item.directionName}</span>
          <span className={styles.time}>{item.time}</span>
          <span className={styles.cost}>{item.price}</span>
          <span className={styles.reason} title={item.reason}>{item.reason}</span>
        </div>
      );
    });
  }

  @autobind
  getYieldName() {
    const {
      yieldRankValue,
    } = this.props;
    const result = _.filter(yieldRankList, item => (item.value === yieldRankValue))[0];
    return `${result.label}: `;
  }

  @autobind
  getYieldNode() {
    const {
      data,
      yieldRankValue,
    } = this.props;
    const result = _.filter(yieldRankList, item => (item.value === yieldRankValue))[0];
    const num = data[result.showNameKey];
    const className = classnames({
      [styles.up]: num >= 0,
      [styles.down]: num < 0,
    });
    return (
      <em className={className}>{`${num >= 0 ? '+' : '-'}${num}%`}</em>
    );
  }

  render() {
    const {
      // dict,
      data,
      chartTabChange,
      getCombinationLineChart,
      combinationLineChartData,
      rankTabActiveKey,
      // yieldRankValue,
    } = this.props;
    // const chartData = combinationLineChartData[data.combinationCode] || EMPTY_OBJECT;
    const yieldName = this.getYieldName();
    return (
      <div className={`${styles.itemBox} clearfix`}>
        <div className={styles.left}>
          <div className={styles.headBox}>
            <span className={styles.combinationName} title={data.combinationName}>
              <a>{data.combinationName}</a>
            </span>
            <span className={styles.earnings}>
              <i>{yieldName}</i>
              {this.getYieldNode()}
            </span>
            <span className={styles.tips}>
              <i>{data.riskLevelName}</i>
              {
                data.isRecommend ?
                  <em>推荐</em>
                :
                  null
              }
            </span>
            <span className={styles.link}>
              <a>历史报告 </a>
              |
              <a> 订购客户</a>
            </span>
          </div>
          <div className={`${styles.titleBox} clearfix`}>
            <span className={styles.securityName}>证券名称</span>
            <span className={styles.securityCode}>证券代码</span>
            <span className={styles.direction}>调仓方向</span>
            <span className={styles.time}>时间</span>
            <span className={styles.cost}>成本价</span>
            <span className={styles.reason}>理由</span>
          </div>
          <div className={styles.bodyBox}>
            {this.getHistoryList()}
          </div>
        </div>
        <div className={styles.right}>
          <CombinationYieldChart
            combinationCode={data.combinationCode}
            chartData={combinationLineChartData}
            getCombinationLineChart={getCombinationLineChart}
            tabChange={chartTabChange}
            rankTabActiveKey={rankTabActiveKey}
            ref={ref => this.chartComponent = ref}
          />
        </div>
      </div>
    );
  }
}
