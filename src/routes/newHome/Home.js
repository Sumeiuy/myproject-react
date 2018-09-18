/**
 * @Author: wangjunjun
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-17 17:37:54
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import moment from 'moment';

import withRouter from '../../decorators/withRouter';
import ViewAndCombination from '../../components/newHome/ViewAndCombination';
import CommonCell from '../../components/newHome/CommonCell';
import ChartsTab from '../../components/newHome/ChartsTab';

import { dva } from '../../helper';
import styles from './home.less';
import { DATE_FORMAT_STRING } from './config';

const dispatch = dva.generateEffect;

const effects = {
  // 重点关注
  queryKeyAttention: 'newHome/queryKeyAttention',
  // 猜你感兴趣
  queryGuessYourInterests: 'newHome/queryGuessYourInterests',
  // 产品日历
  queryProductCalendar: 'newHome/queryProductCalendar',
  // 首席观点
  queryChiefView: 'newHome/queryChiefView',
  // 组合推荐
  queryIntroCombination: 'newHome/queryIntroCombination',
  getManagerIndicators: 'customerPool/getManagerIndicators',
  getPerformanceIndicators: 'customerPool/getPerformanceIndicators',
  getCustCount: 'customerPool/getCustCount',
};

const mapStateToProps = state => ({
  // 重点关注
  keyAttention: state.newHome.keyAttention,
  // 猜你感兴趣
  guessYourInterests: state.newHome.guessYourInterests,
  // 产品日历
  productCalendar: state.newHome.productCalendar,
  // 首席观点
  chiefView: state.newHome.chiefView,
  // 组合推荐
  introCombination: state.newHome.introCombination,
  custRange: state.customerPool.custRange, // 客户池用户范围
  cycle: state.app.dict.kPIDateScopeType,  // 统计周期
  empInfo: state.app.empInfo, // 职位信息
  performanceIndicators: state.customerPool.performanceIndicators, // 绩效指标
  managerIndicators: state.customerPool.managerIndicators, // 经营指标
  custCount: state.customerPool.custCount, // （经营指标）新增客户指标
});

const mapDispatchToProps = {
  push: routerRedux.push,
  // 重点关注
  queryKeyAttention: dispatch(effects.queryKeyAttention, { forceFull: true }),
  // 猜你感兴趣
  queryGuessYourInterests: dispatch(effects.queryGuessYourInterests, { forceFull: true }),
  // 产品日历
  queryProductCalendar: dispatch(effects.queryProductCalendar, { forceFull: true }),
  // 首席观点
  queryChiefView: dispatch(effects.queryChiefView, { forceFull: true }),
  // 组合推荐
  queryIntroCombination: dispatch(effects.queryIntroCombination, { forceFull: true }),
  getCustCount: dispatch(effects.getCustCount, { loading: false }),
  getManagerIndicators: dispatch(effects.getManagerIndicators, { loading: false }),
  getPerformanceIndicators: dispatch(effects.getPerformanceIndicators, { loading: false }),
};

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends PureComponent {

  static propTypes = {
    push: PropTypes.func.isRequired,
    keyAttention: PropTypes.array.isRequired,
    guessYourInterests: PropTypes.array.isRequired,
    productCalendar: PropTypes.array.isRequired,
    chiefView: PropTypes.object.isRequired,
    introCombination: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    performanceIndicators: PropTypes.object,
    managerIndicators: PropTypes.object,
    getManagerIndicators: PropTypes.func.isRequired,
    getPerformanceIndicators: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    empInfo: PropTypes.object,
    custCount: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    getCustCount: PropTypes.func.isRequired,
  }

  static defaultProps = {
    managerIndicators: EMPTY_OBJECT,
    custRange: EMPTY_LIST,
    cycle: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
    performanceIndicators: EMPTY_OBJECT,
    custCount: EMPTY_LIST,
  }

  componentDidMount() {
    const {
      queryKeyAttention,
      queryGuessYourInterests,
      queryProductCalendar,
      queryChiefView,
      queryIntroCombination,
    } = this.props;
    const date = moment().format(DATE_FORMAT_STRING);
    // 重点关注
    queryKeyAttention();
    // 猜你感兴趣
    queryGuessYourInterests();
    // 产品日历
    queryProductCalendar({date});
    // 首席观点
    queryChiefView({
      curPageNum: 1,
      pageSize: 18,
    });
    // 组合推荐
    queryIntroCombination();
  }

  @autobind
  handleMoreClick() {
    console.warn('点击了更多');
  }

  // 产品日历的数值点击事件
  @autobind
  handleProductCalendarValueClick(item) {
    console.warn('dianjile', item);
    // http://168.61.9.158:15902/htsc-product-base/financial_product_query.do?router=homePage
  }

  render() {
    const {
      push,
      keyAttention,
      guessYourInterests,
      productCalendar,
      chiefView,
      introCombination,
      location,
      custRange,
      performanceIndicators,
      managerIndicators,
      cycle,
      empInfo,
      custCount,
      getCustCount,
      getManagerIndicators,
      getPerformanceIndicators
    } = this.props;

    const keyAttentionProps = {
      title: '重点关注',
      data: keyAttention,
    };
    const guessYourInterestsProps = {
      title: '猜你感兴趣',
      data: guessYourInterests,
      isNeedExtra: true,
      onExtraClick: this.handleMoreClick,
    }
    const productCalendarProps = {
      icon: 'calendar',
      title: '产品日历',
      data: productCalendar,
      onValueClick: this.handleProductCalendarValueClick,
    }
    const viewAndCombinationProps = {
      push,
      data: {
        view: chiefView,
        combination: introCombination,
      },
    }
    const chartsTabProps = {
      location,
      custRange,
      performanceIndicators,
      managerIndicators,
      cycle,
      empInfo,
      custCount,
      getCustCount,
      getManagerIndicators,
      getPerformanceIndicators
    };
    return (
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.mostFocusContentLink}>
            <CommonCell {...keyAttentionProps} />
          </div>
          <div className={styles.interestContentLink}>
            <CommonCell {...guessYourInterestsProps} />
          </div>
          <div className={styles.competitionsLink}>投顾能力竞赛</div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.shotCutLink}>快捷导航</div>
          <div className={styles.tabPanesContainer}>
            <ChartsTab {...chartsTabProps} />
          </div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.productDateLink}>
            <CommonCell {...productCalendarProps} />
          </div>
          <div className={styles.informationContainer}>
            <ViewAndCombination {...viewAndCombinationProps} />
          </div>
          <div className={styles.newsInfoContainer}>每日晨报</div>
        </div>
      </div>
    );
  }
}
