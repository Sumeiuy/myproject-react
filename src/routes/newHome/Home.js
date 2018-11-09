/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-09 00:56:09
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import store from 'store';

import { logPV } from '../../decorators/logable';
import withRouter from '../../decorators/withRouter';
import Nav from '../../components/newHome/Nav';
import ViewAndCombination from '../../components/newHome/ViewAndCombination';
import CommonCell from '../../components/newHome/CommonCell';
import ChartsTab from '../../components/newHome/ChartsTab';
import { LabelModal } from '../../components/customerPool/home';
import ActivityColumnCarousel from '../../components/platformParameterSetting/routers/contentOperate/ActivityColumnCarousel';
import { dva, url as urlHelper, emp, permission } from '../../helper';
import { isSightingScope, getFilter, getSortParam } from '../../components/customerPool/helper.js';
import { openRctTab } from '../../utils';
import { padSightLabelDesc } from '../../config';
import styles from './home.less';
import { MorningBroadcast } from '../../components/customerPool/home';
import { DATE_FORMAT_STRING, MONTH_DATE_FORMAT, navArray } from './config';

const effect = dva.generateEffect;

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
  getCustAnalyticsIndicators: 'customerPool/getCustAnalyticsIndicators',
  queryAudioFile: 'morningBoradcast/queryAudioFile',
  queryhomePageNews: 'morningBoradcast/queryhomePageNews', // 晨报列表
  queryCustLabelList: 'customerPool/queryCustLabelList',  // 获取首页可用客户标签列表数据
  custLabelListPaging: 'customerPool/custLabelListPaging', // 首页可用客户标签列表弹窗数据分页处理
  queryNumbers: 'newHome/queryNumbers',  // 首页任务概览
  // 获取活动栏目
  queryContent: 'morningBoradcast/queryContent',
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
  custAnalyticsIndicators: state.customerPool.custAnalyticsIndicators,
  performanceIndicators: state.customerPool.performanceIndicators, // 绩效指标
  managerIndicators: state.customerPool.managerIndicators, // 经营指标
  custCount: state.customerPool.custCount, // （经营指标）新增客户指标
  initBoradcastList: state.morningBoradcast.initBoradcastList, // 晨报列表
  initBoradcastFile: state.morningBoradcast.initBoradcastFile, // 晨报详情
  pagingCustLabelData: state.customerPool.pagingCustLabelData, // 前端处理过的带分页的所有可用客户标签数据
  taskNumbers: state.newHome.taskNumbers,
  // 活动栏目
  activityColumnList: state.morningBoradcast.activityColumnList,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  // 重点关注
  queryKeyAttention: effect(effects.queryKeyAttention, { loading: false }),
  // 猜你感兴趣
  queryGuessYourInterests: effect(effects.queryGuessYourInterests, { loading: false }),
  // 产品日历
  queryProductCalendar: effect(effects.queryProductCalendar, { loading: false }),
  // 首席观点
  queryChiefView: effect(effects.queryChiefView, { loading: false }),
  // 组合推荐
  queryIntroCombination: effect(effects.queryIntroCombination, { loading: false }),
  getCustCount: effect(effects.getCustCount, { loading: false }),
  getManagerIndicators: effect(effects.getManagerIndicators, { loading: false }),
  getPerformanceIndicators: effect(effects.getPerformanceIndicators, { loading: false }),
  getCustAnalyticsIndicators: effect(effects.getCustAnalyticsIndicators, { loading: false }),
  queryAudioFile: effect(effects.queryAudioFile, { loading: false }),
  queryhomePageNews: effect(effects.queryhomePageNews, { loading: false }),
  queryCustLabelList: effect(effects.queryCustLabelList, { loading: false }),
  custLabelListPaging: effect(effects.custLabelListPaging, { loading: false }),
  queryNumbers: effect(effects.queryNumbers, { loading: false }),
  // 获取活动栏目
  queryContent: effect(effects.queryContent, { loading: true }),
};

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// 事件提示的 code
const TODAY_EVENT_CODE = '4';

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
    // 首页可用客户标签
    queryCustLabelList: PropTypes.func.isRequired,
    custLabelListPaging: PropTypes.func.isRequired,
    pagingCustLabelData: PropTypes.object.isRequired,
    queryNumbers: PropTypes.func.isRequired,
    taskNumbers: PropTypes.object.isRequired,
    // 活动栏目
    queryContent: PropTypes.func.isRequired,
    activityColumnList: PropTypes.array.isRequired,
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

  constructor(props) {
    super(props);
    this.state = {
      // 是否显示查看更多标签弹窗
      showMoreLabelModal: false,
    };
    // 登陆人的组织 ID
    this.loginOrgId = emp.getOrgId();
  }

  componentDidMount() {
    const {
      custRange,
      queryKeyAttention,
      queryGuessYourInterests,
      queryProductCalendar,
      queryChiefView,
      queryIntroCombination,
      queryNumbers,
      queryhomePageNews,
    } = this.props;
    const date = moment().format(DATE_FORMAT_STRING);
    // 重点关注
    queryKeyAttention({ orgId: this.loginOrgId });
    // 猜你感兴趣
    queryGuessYourInterests({ orgId: this.loginOrgId });
    // 产品日历
    queryProductCalendar({date});
    // 首席观点
    queryChiefView({
      curPageNum: 1,
      pageSize: 18,
    });

    // 每日晨报
    queryhomePageNews({
      createdFrom: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      createdTo: moment().format('YYYY-MM-DD'),
      pageNum: 1,
      pageSize: 10,
    });

     // 这两个接口请求有点慢，延时发送请求
    new Promise(resolve => resolve()).then(() => {
      // 组合推荐
      queryIntroCombination();

      // 判断当前登录用户是否在营业部
      const isNotSaleDepartment = emp.isManagementHeadquarters(this.loginOrgId)
        || emp.isFiliale(custRange, this.loginOrgId);
      // 非营业部登录用户有权限时，传登陆者的orgId
      queryNumbers({ orgId: isNotSaleDepartment && permission.hasTkMampPermission() ? this.loginOrgId : '' });
    });
  }

  // 猜你感兴趣-更多点击事件
  @autobind
  @logPV({ pathname: '/modal/showMoreLabelModal', title: '猜你感兴趣标签' })
  handleMoreClick() {
    this.setState({
      showMoreLabelModal: true,
    });
  }

  // 跳转到投顾业务能力竞赛页面
  @autobind
  @logPV({ pathname: '/investmentConsultantRace', title: '投顾业务能力竞赛页面' })
  toInvestmentConsultantCompetenceRacePage() {
    const { push } = this.props;
    const url = '/investmentConsultantRace';
    const param = {
      id: 'FSP_INVESTMENT_CONSULTANT_RACE',
      title: '投顾竞赛',
    };
    openRctTab({
      url,
      param,
      routerAction: push,
    });
  };

  // 产品日历的数值点击事件
  @autobind
  @logPV({ pathname: '/fsp/productCenter/homePage', title: '产品中心页面' })
  handleProductCalendarValueClick(item) {
    const { push } = this.props;
    const { code } = item;
    // http://168.61.9.158:15902/htsc-product-base/financial_product_query.do?router=homePage&clientType=crm
    push({
        pathname: '/fsp/productCenter/homePage',
        state: {
          url: `/htsc-product-base/financial_product_query.do?router=homePage&type=${code}&clientType=crm`,
        }
    });
  }

  // 转化产品日历数据
  @autobind
  transferProductData() {
    const { productCalendar } = this.props;
    const productData = _.isEmpty(productCalendar)
    ? []
    : productCalendar.map(item => {
      const newItem = {...item};
      if (newItem.code === TODAY_EVENT_CODE) {
        newItem.title = `今日关注事件${item.value}件`;
      } else {
        newItem.title = `今日${item.name}${item.value}只`;
      }
      return newItem;
    });
    return productData;
  }

  // 打开/关闭 更多标签弹窗
  @autobind
  handleToggleMoreLabelModal(status) {
    this.setState({
      showMoreLabelModal: status,
    });
  }

  // 打开新的 tab 页
  @autobind
  handleOpenTab(data) {
    const { labelDesc, missionDesc, ...options } = data;
    const { push, location: { query } } = this.props;
    const firstUrl = '/customerPool/list';
    // 有标签描述需要将描述存到storage
    if (labelDesc) {
      store.set(`${options.labelMapping}-labelDesc`, {
        ...data,
        labelName: decodeURIComponent(options.labelName),
      });
    }
    const filters = getFilter(data);
    const sortParams = getSortParam(filters);
    const newQuery = {
      ...options,
      ...sortParams,
      filters,
      forceRefresh: 'Y',
    };
    const condition = urlHelper.stringify({ ...newQuery });
    const url = `${firstUrl}?${condition}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'RCT_FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: firstUrl,
      query: newQuery,
      // 方便返回页面时，记住首页的query，在本地环境里
      state: {
        ...query,
      },
    });
  }

  // 组合推荐，打开详情页
  @autobind
  @logPV({ pathname: '/choicenessCombination/combinationDetail', title: '精选组合详情' })
  handleCombinationClick(obj) {
    const { push } = this.props;
    const param = {
      closable: true,
      forceRefresh: false,
      isSpecialTab: true,
      id: 'FSP_JX_GROUP_DETAIL',
      title: '组合详情',
    };
    // 传入两个参数，id 、 name
    const query = {
      id: obj.code,
      name: obj.name,
    };
    const url = `/choicenessCombination/combinationDetail?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: '/choicenessCombination/combinationDetail',
      query,
    });
  }

  // 重点关注、猜你感兴趣 跳转客户列表的点击事件
  @autobind
  @logPV({ pathname: '/customerPool/list', title: '客户列表' })
  handleLinkToCustomerList(item) {
    this.handleOpenTab({
      source: isSightingScope(item.source) ? 'sightingTelescope' : 'tag',
      labelMapping: item.id || '',
      labelName: encodeURIComponent(item.name),
      // 任务提示
      missionDesc: padSightLabelDesc({
        sightingScopeBool: isSightingScope(item.source),
        labelId: item.id,
        labelName: item.name,
      }),
      labelDesc: item.description,
      q: encodeURIComponent(item.name),
      type: 'LABEL',
    });
  }

  render() {
    const {
      push,
      keyAttention,
      guessYourInterests,
      chiefView,
      introCombination,
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
      queryCustLabelList,
      custLabelListPaging,
      pagingCustLabelData,
      taskNumbers,
      activityColumnList,
    } = this.props;

    const {
      showMoreLabelModal,
    } = this.state;

    // 快捷导航
    const navProps = {
      location,
      push,
      data: taskNumbers,
      list: navArray,
    };
    // 重点关注
    const keyAttentionProps = {
      title: '重点关注',
      data: keyAttention,
      onClick: this.handleLinkToCustomerList,
    };
    // 猜你感兴趣
    const guessYourInterestsProps = {
      title: '猜你感兴趣',
      data: guessYourInterests,
      isNeedExtra: true,
      onClick: this.handleLinkToCustomerList,
      onExtraClick: this.handleMoreClick,
      hiddenEmptyValue: false,
    };
    // 产品日历
    const today = moment().format(MONTH_DATE_FORMAT);
    const productCalendarProps = {
      icon: 'calendar',
      title: `${today}产品日历`,
      data: this.transferProductData(),
      onClick: this.handleProductCalendarValueClick,
    };
    // 组合推荐
    const viewAndCombinationProps = {
      location,
      push,
      data: {
        view: chiefView,
        combination: introCombination,
        onClick: this.handleCombinationClick,
      },
    };
    // 更多感兴趣标签
    const labelModalProps = {
      location,
      queryCustLabelList,
      pageChange: custLabelListPaging,
      data: pagingCustLabelData,
      show: showMoreLabelModal,
      toggleModal: this.handleToggleMoreLabelModal,
    };

    // 图表
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

    // 晨报
    const broadcastProps = {
      queryAudioFile,
      dataList: initBoradcastList,
      sourceList: initBoradcastFile,
      isNewHome: true,
    };

    return (
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.competitionsLink}>
            <ActivityColumnCarousel activityColumnList={activityColumnList}/>
          </div>
          <div className={styles.mostFocusContentLink}>
            <CommonCell {...keyAttentionProps} />
          </div>
          <div className={styles.interestContentLink}>
            <CommonCell {...guessYourInterestsProps} />
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.shotCutLink}>
            <Nav {...navProps} />
          </div>
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
          <div className={styles.newsInfoContainer}>
            <MorningBroadcast {...broadcastProps} />
          </div>
        </div>
        <LabelModal {...labelModalProps} />
      </div>
    );
  }
}
