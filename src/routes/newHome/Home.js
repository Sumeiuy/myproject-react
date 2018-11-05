/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-31 09:47:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import store from 'store';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

import { logPV, logCommon} from '../../decorators/logable';
import withRouter from '../../decorators/withRouter';
import Nav from '../../components/newHome/Nav';
import ViewAndCombination from '../../components/newHome/ViewAndCombination';
import CommonCell from '../../components/newHome/CommonCell';
import ChartsTab from '../../components/newHome/ChartsTab';
import { LabelModal } from '../../components/customerPool/home';
import { dva, url as urlHelper, emp, permission } from '../../helper';
import { isSightingScope, getFilter, getSortParam } from '../../components/customerPool/helper.js';
import { openRctTab } from '../../utils';
import { padSightLabelDesc } from '../../config';
import styles from './home.less';
import { MorningBroadcast } from '../../components/customerPool/home';
import { DATE_FORMAT_STRING, MONTH_DATE_FORMAT, navArray } from './config';
import {
  NEW_HOME_INTRO_THIRD_SEEP_IDNAME,
  NEW_HOME_INTRO_FIFTH_SEEP_IDNAME,
  NEW_HOME_INTRO_SIXTH_SEEP_IDNAME,
  NEW_HOME_INTRO_SEVENTH_SEEP_IDNAME,
  NEW_HOME_INTRO_NINTH_SEEP_IDNAME,
  stepIds,
} from './config';

// 存储在本地用哪个来判断是否在执行者视图中第一次使用'展开收起'
const NEWHOMEFIRSTUSECOLLAPSE_PERFORMERVIEW = 'NEW_HOME_GUIDE_FIRSTUSECOLLAOSE_PERFORMERVIEW';

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
};

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// 事件提示的 code
const TODAY_EVENT_CODE = '4';
// 默认第一个神策埋点名为 搜索栏 点击下一步或者上一步会重写 facingOneModele 的值
let facingOneModele = '搜索栏';
// 神策埋点需要知道用户点击下一步还是上一步 第一步搜索栏是0 用来判断  判断完会重绘
let count = 0;
// 神策埋点用来判断是第几个弹出框点击了上一步还是下一步
let countStep = 1 ;

// 获取新手引导步骤列表  因为需求更改了引导顺序 但是NEW_HOME_INTRO_后面的数字不影响顺序  只需要更改newStepList里面的排序顺序就能改变引导显示的顺序
function getIntroStepListInNewHome() {
  const newStepList = [
    {
      // 主导航 4
      element: document.querySelector('#tabMenu'),
      intro: '导航菜单从左侧移到上方，留出更多页面空间为您展现精彩内容。',
      position: 'bottom',
    }, {
      // 重点关注客户 5
      element: document.querySelector(`#${NEW_HOME_INTRO_THIRD_SEEP_IDNAME}`),
      intro: '新增值得重点关注的客户类别统计，点击可进入客户列表，助您全方位拓展业务。',
      position: 'right',
    }, {
      // 客户分析 8
      element: document.querySelector(`#${NEW_HOME_INTRO_FIFTH_SEEP_IDNAME}`),
      intro: '新增“客户分析”栏目，从六大维度洞察名下客户，点击各项指标可下钻查看客户明细列表。',
      position: 'top',
    }, {
      // 产品日历 9
      element: document.querySelector(`#${NEW_HOME_INTRO_SIXTH_SEEP_IDNAME}`),
      intro: ' 新增“今日产品”栏目，让您及时掌握首发、开放销售、到期等关键产品信息。点击数字可以查看产品明细列表。',
      position: 'top',
    }, {
      //组合推荐 10
      element: document.querySelector(`#${NEW_HOME_INTRO_SEVENTH_SEEP_IDNAME}`),
      intro: '近30天涨幅排名前五的投资组合在这里，点击即可查看组合详情。',
      position: 'top',
    }, {
      //每日晨报 11
      element: document.querySelector(`#${NEW_HOME_INTRO_NINTH_SEEP_IDNAME}`),
      intro: ' 每日晨报让您可听、可看、可下载最新财经热点话题。',
      position: 'top',
    },
  ];
  return newStepList;
}

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
    queryProductCalendar({ date });
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

    // 组合推荐
    queryIntroCombination();

    // 待办事项, 有任务管理岗时，将岗位id传给后端
    // 判断当前登录用户是否在非营业部
    const isNotSaleDepartment = emp.isManagementHeadquarters(this.loginOrgId)
      || emp.isFiliale(custRange, this.loginOrgId);
    // 非营业部登录用户有权限时，传登陆者的orgId
    queryNumbers({ orgId: isNotSaleDepartment && permission.hasTkMampPermission() ? this.loginOrgId : '' });

  }

  componentDidUpdate(prevProps, prevState) {
    // 第一次渲染完判断是否是第一次进入执行者视图，是的话显示引导 放在didupdate里是为了解决在didmount下并没有渲染完成导致定位不准的问题
    if (!this.isFirstUseCollapse()) {
      setTimeout(this.intialGuide, 500);
      store.set(NEWHOMEFIRSTUSECOLLAPSE_PERFORMERVIEW, true);
    }
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
        const newItem = { ...item };
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
  // 判断是否在执行者视图中使用'展开收起'功能
  isFirstUseCollapse() {
    return store.get(NEWHOMEFIRSTUSECOLLAPSE_PERFORMERVIEW);
  }

  // 神策埋点 targetElement.id是第几个元素的id名
  @autobind
  handleIntorButtomChange(targetElement){
    const data = stepIds[targetElement.id];
    facingOneModele = data.name;
    // count = 0  data.step从第0开始 判断step是下一步还是上一步
    let step = count < data.step ? '下一步' : '上一步';
    count = data.step;
    logCommon({
      type: 'Click',
      payload: {
        name: data && step,
        value: data && `第${countStep}个`,
      },
    });
    // 从第0个开始点下一步是0  第一步点上一步是1  写在这里是神策需要先上报再修改 不然显示会混乱
    step === '下一步' ? countStep++ : countStep--;
  }

  // 神策埋点 显示是第几个弹框点击的关闭
  @autobind
  handleIntorButtomClose(facingOneModele){
    logCommon({
      type: 'Click',
      payload: {
        name:'关闭',
        value: facingOneModele,
      },
    });
  }
  // 引导功能初始化
  @autobind
  intialGuide() {
    // onexit会执行2次  使用count只执行一次
    let count = 0;
    introJs().setOptions({
      hidePrev:true,
      hideNext:true,
      showBullets: true,
      showProgress: false,
      overlayOpacity: 0.4,
      exitOnOverlayClick: false,
      showStepNumbers: false,
      tooltipClass: styles.introTooltip,
      highlightClass: styles.highlightClass,
      doneLabel: '结束',
      prevLabel: '上一个',
      nextLabel: '下一个',
      skipLabel: '关闭',
      steps: getIntroStepListInNewHome(),
      scrollToElement: true,
      disableInteraction: true,
    }).onchange((targetElement)=> {
      this.handleIntorButtomChange(targetElement);
      }).onexit(() => {
        // 没到最后一步点关闭按钮 执行onexit
        if(!count){
          count++;
          this.handleIntorButtomClose(facingOneModele);
        }
      }).start();

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
      icon: 'focusAttention',
      title: '重点关注',
      data: keyAttention,
      onClick: this.handleLinkToCustomerList,
      introPositionId: NEW_HOME_INTRO_THIRD_SEEP_IDNAME
    };
    // 猜你感兴趣
    const guessYourInterestsProps = {
      icon: 'interested',
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
      introPositionId: NEW_HOME_INTRO_SIXTH_SEEP_IDNAME
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
      introPositionId: NEW_HOME_INTRO_NINTH_SEEP_IDNAME,
    };

    return (
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.competitionsLink}>
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
