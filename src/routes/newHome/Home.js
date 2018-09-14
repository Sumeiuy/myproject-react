/**
 * @Author: wangjunjun
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-14 14:52:26
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
};
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

  componentWillReceiveProps(nextProps) {
  }

  @autobind
  handleMoreClick() {
    console.warn('点击了更多');
  }

  render() {
    const {
      push,
      keyAttention,
      guessYourInterests,
      productCalendar,
      chiefView,
      introCombination,
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
    }
    const viewAndCombinationProps = {
      push,
      data: {
        view: chiefView,
        combination: introCombination,
      },
    }
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
          <div className={styles.tabPanesContainer}>tab信息</div>
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
