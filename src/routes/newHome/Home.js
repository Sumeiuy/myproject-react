/**
 * @Author: wangjunjun
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-09-21 14:46:57
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import moment from 'moment';
import _ from 'lodash';
import store from 'store';

import { logPV } from '../../decorators/logable';
import withRouter from '../../decorators/withRouter';
import Nav from '../../components/newHome/Nav';
import ViewAndCombination from '../../components/newHome/ViewAndCombination';
import CommonCell from '../../components/newHome/CommonCell';
import ChartsTab from '../../components/newHome/ChartsTab';
import { LabelModal } from '../../components/customerPool/home';
import { dva, url as urlHelper, emp } from '../../helper';
import { isSightingScope, getFilter, getSortParam } from '../../components/customerPool/helper.js';
import { openRctTab } from '../../utils';
import { padSightLabelDesc } from '../../config';
import styles from './home.less';
import { DATE_FORMAT_STRING, navArray } from './config';
import rankPng from './rank.png';

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
  queryCustLabelList: 'customerPool/queryCustLabelList',  // 获取首页可用客户标签列表数据
  custLabelListPaging: 'customerPool/custLabelListPaging', // 首页可用客户标签列表弹窗数据分页处理
  queryNumbers: 'newHome/queryNumbers',  // 首页任务概览
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
  pagingCustLabelData: state.customerPool.pagingCustLabelData, // 前端处理过的带分页的所有可用客户标签数据
  taskNumbers: state.newHome.taskNumbers,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  // 重点关注
  queryKeyAttention: effect(effects.queryKeyAttention, { forceFull: true }),
  // 猜你感兴趣
  queryGuessYourInterests: effect(effects.queryGuessYourInterests, { forceFull: true }),
  // 产品日历
  queryProductCalendar: effect(effects.queryProductCalendar, { forceFull: true }),
  // 首席观点
  queryChiefView: effect(effects.queryChiefView, { forceFull: true }),
  // 组合推荐
  queryIntroCombination: effect(effects.queryIntroCombination, { forceFull: true }),
  getCustCount: effect(effects.getCustCount, { loading: false }),
  getManagerIndicators: effect(effects.getManagerIndicators, { loading: false }),
  getPerformanceIndicators: effect(effects.getPerformanceIndicators, { loading: false }),
  queryCustLabelList: effect(effects.queryCustLabelList, { loading: false }),
  custLabelListPaging: effect(effects.custLabelListPaging, { loading: false }),
  queryNumbers: effect(effects.queryNumbers, { forceFull: true }),
};

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// 登陆人的组织 ID
const orgId = emp.getOrgId();
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
    // 首页可用客户标签
    queryCustLabelList: PropTypes.func.isRequired,
    custLabelListPaging: PropTypes.func.isRequired,
    pagingCustLabelData: PropTypes.object.isRequired,
    queryNumbers: PropTypes.func.isRequired,
    taskNumbers: PropTypes.object.isRequired,
  }

  static defaultProps = {
    managerIndicators: EMPTY_OBJECT,
    custRange: EMPTY_LIST,
    cycle: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
    performanceIndicators: EMPTY_OBJECT,
    custCount: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 是否显示查看更多标签弹窗
      showMoreLabelModal: false,
    };
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
    } = this.props;
    const date = moment().format(DATE_FORMAT_STRING);
    // 重点关注
    queryKeyAttention({ orgId });
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

    // 待办事项, 有任务管理岗时，将岗位id传给后端
    // 判断当前登录用户是否在非营业部
    const isNotSaleDepartment = emp.isManagementHeadquarters(orgId)
      || emp.isFiliale(custRange, orgId);
    // 非营业部登录用户有权限时，传登陆者的orgId
    queryNumbers({ orgId: isNotSaleDepartment && this.hasTkMampPermission ? orgId : '' });
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
    // http://168.61.9.158:15902/htsc-product-base/financial_product_query.do?router=homePage
    push({
        pathname: '/fsp/productCenter/homePage',
        state: {
          url: `/htsc-product-base/financial_product_query.do?router=homePage&type=${code}`,
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
  handleCombinationValueClick(obj) {
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
      cycle,
      empInfo,
      custCount,
      getCustCount,
      getManagerIndicators,
      getPerformanceIndicators,
      // 首页可用客户标签
      queryCustLabelList,
      custLabelListPaging,
      pagingCustLabelData,
      taskNumbers,
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
      onValueClick: this.handleLinkToCustomerList,
    };
    // 猜你感兴趣
    const guessYourInterestsProps = {
      title: '猜你感兴趣',
      data: guessYourInterests,
      isNeedExtra: true,
      onValueClick: this.handleLinkToCustomerList,
      onExtraClick: this.handleMoreClick,
    };
    // 产品日历
    const productCalendarProps = {
      icon: 'calendar',
      title: '产品日历',
      data: this.transferProductData(),
      onValueClick: this.handleProductCalendarValueClick,
    };
    // 组合推荐
    const viewAndCombinationProps = {
      push,
      data: {
        view: chiefView,
        combination: introCombination,
        onValueClick: this.handleCombinationValueClick,
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
      getPerformanceIndicators,
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
          <div className={styles.competitionsLink}>
            <img src={rankPng} alt="投顾能力竞赛"  onClick={this.toInvestmentConsultantCompetenceRacePage} />
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
          <div className={styles.newsInfoContainer}>每日晨报</div>
        </div>
        <LabelModal {...labelModalProps} />
      </div>
    );
  }
}
