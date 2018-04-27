/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-列表项
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-26 21:19:05
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../../common/Icon';
import CombinationYieldChart from '../CombinationYieldChart';
import styles from './combinationListItem.less';

const EMPTY_OBJECT = {};

export default class CombinationListItem extends PureComponent {
  static propTypes = {
    // 图表tab切换
    chartTabChange: PropTypes.func.isRequired,
    // 组合item数据
    data: PropTypes.object,
    // 折线图数据
    getCombinationLineChart: PropTypes.func.isRequired,
    combinationLineChartData: PropTypes.object.isRequired,
    // 组合排名tab当前选择的key
    rankTabActiveKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
  }

  // constructor(props) {
  //   super(props);
  // }

  @autobind
  getHistoryList() {
    const { data } = this.props;
    if (_.isEmpty(data.latestAdjust)) {
      return (
        <div className={styles.noData}>
          <Icon type="meiyouxiangguanjieguo" />
          <span>此组合暂无调仓记录</span>
        </div>
      );
    }
    return data.latestAdjust.map((item, index) => {
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

  render() {
    const {
      data,
      chartTabChange,
      getCombinationLineChart,
      combinationLineChartData,
      rankTabActiveKey,
    } = this.props;
    return (
      <div className={`${styles.itemBox} clearfix`}>
        <div className={styles.left}>
          <div className={styles.headBox}>
            <span className={styles.combinationName} title={data.combinationName}>
              <a>{data.combinationName}</a>
            </span>
            <span className={styles.earnings}>
              <i>近7天收益率:</i>
              <em className={styles.up}>+5.12%</em>
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
