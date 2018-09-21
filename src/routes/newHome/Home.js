/**
 * @Author: wangjunjun
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-11 15:59:19
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import withRouter from '../../decorators/withRouter';
import KeyAttention from '../../components/newHome/KeyAttention';
import ViewAndIntro from '../../components/newHome/ViewAndIntro';
import ChartsTab from '../../components/newHome/ChartsTab';
import { dva } from '../../helper';
import styles from './home.less';
import { MorningBroadcast } from '../../components/customerPool/home';

const effect = dva.generateEffect;
const effects = {
  getManagerIndicators: 'customerPool/getManagerIndicators',
  getPerformanceIndicators: 'customerPool/getPerformanceIndicators',
  getCustCount: 'customerPool/getCustCount',
  getCustAnalyticsIndicators: 'customerPool/getCustAnalyticsIndicators',
  queryAudioFile: 'morningBoradcast/queryAudioFile',
  queryhomePageNews: 'morningBoradcast/queryhomePageNews', // 晨报列表
};

const mapStateToProps = state => ({
  custRange: state.customerPool.custRange, // 客户池用户范围
  cycle: state.app.dict.kPIDateScopeType,  // 统计周期
  empInfo: state.app.empInfo, // 职位信息
  custAnalyticsIndicators: state.customerPool.custAnalyticsIndicators,
  performanceIndicators: state.customerPool.performanceIndicators, // 绩效指标
  managerIndicators: state.customerPool.managerIndicators, // 经营指标
  custCount: state.customerPool.custCount, // （经营指标）新增客户指标
  initBoradcastList: state.morningBoradcast.initBoradcastList, // 晨报列表
  initBoradcastFile: state.morningBoradcast.initBoradcastFile, // 晨报详情
});

const mapDispatchToProps = {
  getCustCount: effect(effects.getCustCount, { loading: false }),
  getManagerIndicators: effect(effects.getManagerIndicators, { loading: false }),
  getPerformanceIndicators: effect(effects.getPerformanceIndicators, { loading: false }),
  getCustAnalyticsIndicators: effect(effects.getCustAnalyticsIndicators, { loading: false }),
  queryAudioFile: effect(effects.queryAudioFile, { loading: false }),
  queryhomePageNews: effect(effects.queryhomePageNews, { loading: false }),
};

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    performanceIndicators: PropTypes.object,
    managerIndicators: PropTypes.object,
    custAnalyticsIndicators: PropTypes.object,
    getManagerIndicators: PropTypes.func.isRequired,
    getPerformanceIndicators: PropTypes.func.isRequired,
    getCustAnalyticsIndicators: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    empInfo: PropTypes.object,
    custCount: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    getCustCount: PropTypes.func.isRequired,
    queryAudioFile: PropTypes.func.isRequired,
    initBoradcastList: PropTypes.array.isRequired,
    initBoradcastFile: PropTypes.object.isRequired,
    queryhomePageNews: PropTypes.func.isRequired,
  }

  static defaultProps = {
    managerIndicators: EMPTY_OBJECT,
    custRange: EMPTY_LIST,
    cycle: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
    custAnalyticsIndicators: EMPTY_OBJECT,
    performanceIndicators: EMPTY_OBJECT,
    custCount: EMPTY_LIST,
  }

  componentDidMount() {
    this.props.queryhomePageNews({
      createdFrom: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      createdTo: moment().format('YYYY-MM-DD'),
      pageNum: 1,
      pageSize: 10,
    });
  }

  render() {
    const {
      location,
      custRange,
      performanceIndicators,
      managerIndicators,
      custAnalyticsIndicators,
      cycle,
      empInfo,
      custCount,
      getCustCount,
      getManagerIndicators,
      getPerformanceIndicators,
      getCustAnalyticsIndicators,
      queryAudioFile,
      initBoradcastList,
      initBoradcastFile,
    } = this.props;

    const keyAttentionProps = {
      data: [],
    };
    const viewAndIntroProps = {
      data: {},
    };
    const chartsTabProps = {
      location,
      custRange,
      performanceIndicators,
      managerIndicators,
      custAnalyticsIndicators,
      cycle,
      empInfo,
      custCount,
      getCustCount,
      getManagerIndicators,
      getPerformanceIndicators,
      getCustAnalyticsIndicators,
    };

    const broadcastProps = {
      queryAudioFile,
      dataList: initBoradcastList,
      sourceList: initBoradcastFile,
      isNewHome: true,
    };

    return (
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.mostFocusContentLink}>
            <KeyAttention {...keyAttentionProps} />
          </div>
          <div className={styles.interestContentLink}>猜你感兴趣</div>
          <div className={styles.competitionsLink}>投顾能力竞赛</div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.shotCutLink}>快捷导航</div>
          <div className={styles.tabPanesContainer}>
            <ChartsTab {...chartsTabProps} />
          </div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.productDateLink}>产品日历</div>
          <div className={styles.informationContainer}>
            <ViewAndIntro {...viewAndIntroProps} />
          </div>
          <div className={styles.newsInfoContainer}>
            <MorningBroadcast {...broadcastProps} />
          </div>
        </div>
      </div>
    );
  }
}
