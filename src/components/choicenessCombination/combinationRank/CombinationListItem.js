/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-列表项
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-22 11:04:45
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import Icon from '../../common/Icon';
import { time } from '../../../helper';
import CombinationYieldChart from '../CombinationYieldChart';
import styles from './combinationListItem.less';
import {
  yieldRankList,
  securityType as securityTypeList,
  formatStr,
  sourceType,
} from '../../../components/choicenessCombination/config';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
// 最大字符长度
const MAX_SIZE_LENGTH = 35;
const DEFAULT_REASON = '调仓理由：暂无';

// 历史报告
const REPORT_TYPE = 'report';

export default class CombinationListItem extends PureComponent {
  static propTypes = {
    // 字典
    dict: PropTypes.object.isRequired,
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
    // 打开个股资讯页面
    openStockPage: PropTypes.func.isRequired,
    // 打开持仓查客户页面
    openCustomerListPage: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    openDetailPage: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    data: EMPTY_OBJECT,
    yieldRankValue: '',
  }

  @autobind
  getHistoryList() {
    const { data, openStockPage } = this.props;
    if (_.isEmpty(data.securityList)) {
      return null;
    }
    return data.securityList.map((item, index) => {
      const key = `key${index}`;
      const reason = (item.reason || '').length > MAX_SIZE_LENGTH ?
        `${item.reason.slice(0, MAX_SIZE_LENGTH)}...`
        : item.reason;
      return (
        <div className={`${styles.historyItem} clearfix`} key={key}>
          <span className={styles.securityName}>
            {
              this.isStock(item.securityType) ?
                <a
                  title={item.securityName}
                  onClick={() => openStockPage({ code: item.securityName })}
                >
                  {item.securityName}
                </a>
                :
                <span title={item.securityName}>{item.securityName}</span>
            }
          </span>
          <span className={styles.securityCode}>
            {
              this.isStock(item.securityType) ?
                <a
                  onClick={() => openStockPage({ code: item.securityCode })}
                >
                  {item.securityCode}
                </a>
                :
                <span>{item.securityCode}</span>
            }
          </span>
          <span className={styles.direction}>{item.directionName}</span>
          <span className={styles.time}>{time.format(item.time, formatStr)}</span>
          <span className={styles.cost}>{item.price}</span>
          <span className={styles.reason} title={item.reason}>{reason || DEFAULT_REASON}</span>
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
    return `${result.showName}: `;
  }

  @autobind
  getYieldNode() {
    const {
      data,
      yieldRankValue,
    } = this.props;
    const result = _.filter(yieldRankList, item => (item.value === yieldRankValue))[0];
    const num = data[result.showNameKey] || 0;
    // 后端返回如 -0.0003这样数据时 四舍五入完会是-0.00 需要特殊处理成 0.00
    const judgeNum = Number(num.toFixed(2));
    const fiexdNum = judgeNum === 0 ? '0.00' : num.toFixed(2);
    const className = classnames({
      [styles.up]: judgeNum >= 0,
      [styles.down]: judgeNum < 0,
    });
    return (
      <em className={className}>{`${judgeNum > 0 ? '+' : ''}${fiexdNum}%`}</em>
    );
  }

  @autobind
  getRiskLevelName() {
    const { data, dict } = this.props;
    const riskLevelData = dict.prodRiskLevelList;
    const { riskLevel = '' } = data;
    const riskLevelName = ((_.filter(riskLevelData, item => item.key === riskLevel)
    || EMPTY_LIST)[0]
    || EMPTY_OBJECT).value;
    return riskLevelName ? (<i>{riskLevelName}</i>) : null;
  }

  @autobind
  isStock(securityType) {
    return securityType === securityTypeList[0].value;
  }

  @autobind
  viewHistoryReport(name) {
    const { showModal } = this.props;
    const payload = {
      combinationCode: name,
      type: REPORT_TYPE,
    };
    showModal(payload);
  }

  // 组合名称点击事件
  @autobind
  handleNameClick(obj) {
    const { openDetailPage } = this.props;
    openDetailPage(obj);
  }

  render() {
    const {
      // dict,
      data,
      chartTabChange,
      getCombinationLineChart,
      combinationLineChartData,
      rankTabActiveKey,
      openCustomerListPage,
    } = this.props;
    const chartData = combinationLineChartData[data.combinationCode] || EMPTY_OBJECT;
    const yieldName = this.getYieldName();
    const classNames = classnames({
      [styles.itemBox]: true,
      clearfix: true,
      [styles.show]: data.show,
    });
    const openPayload = {
      name: data.combinationName,
      code: data.productCode,
      source: sourceType.combination,
    };
    const openDetailPayload = {
      id: data.combinationCode,
      name: data.combinationName,
    };
    return (
      <div className={classNames}>
        <div className={styles.left}>
          <div className={`${styles.headBox} clearfix`}>
            <span className={styles.combinationName} title={data.combinationName}>
              <a onClick={() => this.handleNameClick(openDetailPayload)}>
                {data.combinationName}
              </a>
            </span>
            <span className={styles.earnings}>
              <i>{yieldName}</i>
              {this.getYieldNode()}
            </span>
            <span className={styles.tips}>
              {this.getRiskLevelName()}
              {
                data.isRecommend ?
                  <em>推荐</em>
                :
                  null
              }
            </span>
            <span className={styles.link}>
              <a onClick={() => this.handleNameClick(openDetailPayload)}>报告详情 </a>
              |
              <a onClick={() => this.viewHistoryReport(data.combinationCode)}> 历史报告 </a>
              |
              <a onClick={() => openCustomerListPage(openPayload)}> 订购客户</a>
            </span>
          </div>
          <div className={styles.tableBox}>
            <div className={`${styles.titleBox} clearfix`}>
              <span className={styles.securityName}>证券名称</span>
              <span className={styles.securityCode}>证券代码</span>
              <span className={styles.direction}>调仓方向</span>
              <span className={styles.time}>时间</span>
              <span className={styles.cost}>成本价(元)</span>
              <span className={styles.reason}>理由</span>
            </div>
            <div className={styles.bodyBox}>
              {this.getHistoryList()}
            </div>
          </div>
          {
            _.isEmpty(data.securityList) ?
              <div className={styles.noData}>
                <Icon type="meiyouxiangguanjieguo" />
                <span>此组合暂无调仓记录</span>
              </div>
            :
              null
          }
        </div>
        <div className={styles.right}>
          <CombinationYieldChart
            combinationItemData={data}
            combinationCode={data.combinationCode}
            chartData={chartData}
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
