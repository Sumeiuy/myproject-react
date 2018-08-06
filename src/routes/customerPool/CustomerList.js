/**
 * @file customerPool/CustomerList.js
 *  客户列表
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Row, Col } from 'antd';

import TimeCycle from '../../components/customerPool/list/TimeCycle';
import CustomerTotal from '../../components/customerPool/list/CustomerTotal';
import Filter from '../../components/customerPool/list/Filter';
import CustomerLists from '../../components/customerPool/list/CustomerLists';
import { permission, emp } from '../../helper';
import withRouter from '../../decorators/withRouter';
import { getCustomerListFilters } from '../../helper/page/customerPool';
import {
  CUST_MANAGER,
  ORG,
  ENTER_TYPE,
  DEFAULT_ENTER_TYPE,
  ALL_DEPARTMENT_ID,
  MAIN_MAGEGER_ID,
  ENTERLIST_PERMISSION_TASK_MANAGE,
  ENTERLIST_PERMISSION_INDEX_QUERY,
  ENTERLIST_PERMISSION_SIGHTINGLABEL,
} from './config';

import styles from './customerlist.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const CUR_PAGE = 1; // 默认当前页
const CUR_PAGESIZE = 20; // 默认页大小

const DEFAULT_SORT = { sortType: 'totAset', sortDirection: 'desc' }; // 默认排序方式

const effects = {
  allInfo: 'customerPool/getAllInfo',
  getDictionary: 'customerPool/getDictionary',
  getCustomerList: 'customerPool/getCustomerList',
  getCustIncome: 'customerPool/getCustIncome',
  getCustContact: 'customerPool/getCustContact',
  getCustEmail: 'customerPool/getCustEmail', // 获取邮件地址
  getServiceRecord: 'customerPool/getServiceRecord',
  getCustomerScope: 'customerPool/getCustomerScope',
  getSearchServerPersonList: 'customerPool/getSearchServerPersonList',
  handleFilter: 'customerList/handleFilter',  // 手动上传日志
  handleSelect: 'customerList/handleDropDownSelect',  // 手动上传日志
  handleOrder: 'customerList/handleOrder', // 手动上传日志
  handleCheck: 'customerList/handleCheck',  // 手动上传日志
  handleSearch: 'customerList/handleSearch',  // 手动上传日志
  handleCloseClick: 'contactModal/handleCloseClick',  // 手动上传日志
  handleAddServiceRecord: 'contactModal/handleAddServiceRecord',  // 手动上传日志
  handleCollapseClick: 'contactModal/handleCollapseClick',  // 手动上传日志
  queryCustUuid: 'performerView/queryCustUuid',
  getCeFileList: 'customerPool/getCeFileList',
  getFiltersOfSightingTelescope: 'customerPool/getFiltersOfSightingTelescope',
  isSendCustsServedByPostn: 'customerPool/isSendCustsServedByPostn',
  addServeRecord: 'customerPool/addCommonServeRecord',
  queryHoldingProduct: 'customerPool/queryHoldingProduct',
  addCallRecord: 'customerPool/addCallRecord',
  queryHoldingSecurityRepetition: 'customerPool/queryHoldingSecurityRepetition',
  getCustRangeByAuthority: 'customerPool/getCustRangeByAuthority',
  queryCustSignedLabels: 'customerLabel/queryCustSignedLabels',
  queryLikeLabelInfo: 'customerLabel/queryLikeLabelInfo',
  signCustLabels: 'customerLabel/signCustLabels',
  signBatchCustLabels: 'customerLabel/signBatchCustLabels',
  queryHoldingIndustryDetail: 'customerPool/queryHoldingIndustryDetail',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 客户池用户范围
  custRange: state.customerPool.custRange,
  // 职位信息
  empInfo: state.app.empInfo,
  // 职责切换
  dict: state.app.dict,
  custList: state.customerPool.custList,
  page: state.customerPool.custPage,
  // 6个月收益数据
  monthlyProfits: state.customerPool.monthlyProfits,
  // 联系方式数据
  custContactData: state.customerPool.custContactData,
  // 邮箱地址
  custEmail: state.customerPool.custEmail,
  // 最近服务记录
  serviceRecordData: state.customerPool.serviceRecordData,
  // 统计周期
  cycle: state.app.dict.kPIDateScopeType,
  // 接口的loading状态
  interfaceState: state.loading.effects,
  // 服务人员列表
  searchServerPersonList: state.customerPool.searchServerPersonList,
  // 联系方式接口loading
  isContactLoading: state.loading.effects[effects.getCustContact],
  // 服务记录接口loading
  isRecordLoading: state.loading.effects[effects.getServiceRecord],
  // 列表页的服务营业部
  serviceDepartment: state.customerPool.serviceDepartment,
  filesList: state.customerPool.filesList,
  // 是否是本人名下客户
  custServedByPostnResult: state.customerPool.custServedByPostnResult,
  sightingTelescopeFilters: state.customerPool.sightingTelescopeFilters,
  // 是否包含非本人名下客户和超出1000条数据限制
  sendCustsServedByPostnResult: state.customerPool.sendCustsServedByPostnResult,
  // 自建任务平台的服务类型、任务反馈字典
  motSelfBuiltFeedbackList: state.app.motSelfBuiltFeedbackList,
  // 持仓产品详情
  holdingProducts: state.customerPool.holdingProducts,
  // 添加服务记录成功后返回的服务记录的id
  currentCommonServiceRecord: state.customerPool.currentCommonServiceRecord,
  // 组合产品订购客户重复的持仓证券
  holdingSecurityData: state.customerPool.holdingSecurityData,
  // 客户已标记标签
  custLabel: state.customerLabel.custLabel,
  // 模糊搜索客户标签
  custLikeLabel: state.customerLabel.custLikeLabel,
  // 持仓行业的详情
  industryDetail: state.customerPool.industryDetail,
});

const mapDispatchToProps = {
  getAllInfo: fetchDataFunction(true, effects.allInfo),
  getCustomerData: fetchDataFunction(true, effects.getCustomerList),
  getCustIncome: fetchDataFunction(false, effects.getCustIncome),
  getCustomerScope: fetchDataFunction(true, effects.getCustomerScope),
  getServiceRecord: fetchDataFunction(true, effects.getServiceRecord),
  getCustContact: fetchDataFunction(true, effects.getCustContact),
  getCustEmail: fetchDataFunction(true, effects.getCustEmail),
  handleFilter: fetchDataFunction(false, effects.handleFilter),
  handleSelect: fetchDataFunction(false, effects.handleSelect),
  handleOrder: fetchDataFunction(false, effects.handleOrder),
  handleCheck: fetchDataFunction(false, effects.handleCheck),
  handleSearch: fetchDataFunction(false, effects.handleSearch),
  handleCloseClick: fetchDataFunction(false, effects.handleCloseClick),
  handleAddServiceRecord: fetchDataFunction(false, effects.handleAddServiceRecord),
  handleCollapseClick: fetchDataFunction(false, effects.handleCollapseClick),
  getCeFileList: fetchDataFunction(false, effects.getCeFileList),
  // 搜索服务服务经理
  getSearchServerPersonList: fetchDataFunction(true, effects.getSearchServerPersonList),
  push: routerRedux.push,
  replace: routerRedux.replace,
  toggleServiceRecordModal: query => ({
    type: 'app/toggleServiceRecordModal',
    payload: query || false,
  }),
  // 清除数据
  clearCreateTaskData: query => ({
    type: 'customerPool/clearCreateTaskData',
    payload: query || {},
  }),
  // 获取uuid
  queryCustUuid: fetchDataFunction(true, effects.queryCustUuid),
  getFiltersOfSightingTelescope: fetchDataFunction(true, effects.getFiltersOfSightingTelescope),
  // 查询是否包含非本人名下客户和超出1000条数据限制
  isSendCustsServedByPostn: fetchDataFunction(true, effects.isSendCustsServedByPostn),
  // 添加服务记录
  addServeRecord: fetchDataFunction(true, effects.addServeRecord),
  // 根据持仓产品的id查询对应的详情
  queryHoldingProduct: fetchDataFunction(false, effects.queryHoldingProduct),
  // 添加通话记录关联服务记录
  addCallRecord: fetchDataFunction(true, effects.addCallRecord),
  // 组合产品订购客户查询持仓证券重合度
  queryHoldingSecurityRepetition: fetchDataFunction(false, effects.queryHoldingSecurityRepetition),
  // 获取服务营业部的数据
  getCustRangeByAuthority: fetchDataFunction(true, effects.getCustRangeByAuthority),
  // 查询客户已标记标签
  queryCustSignedLabels: fetchDataFunction(true, effects.queryCustSignedLabels),
  queryLikeLabelInfo: fetchDataFunction(false, effects.queryLikeLabelInfo),
  signCustLabels: fetchDataFunction(true, effects.signCustLabels),
  signBatchCustLabels: fetchDataFunction(true, effects.signBatchCustLabels),
  queryHoldingIndustryDetail: fetchDataFunction(false, effects.queryHoldingIndustryDetail),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerList extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getCustomerScope: PropTypes.func.isRequired,
    getAllInfo: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    empInfo: PropTypes.object,
    dict: PropTypes.object.isRequired,
    getCustomerData: PropTypes.func.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    getCustContact: PropTypes.func.isRequired,
    getCustEmail: PropTypes.func.isRequired,
    custContactData: PropTypes.object,
    custEmail: PropTypes.object,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object,
    cycle: PropTypes.array,
    // getStatisticalPeriod: PropTypes.func.isRequired,
    // 显示隐藏添加服务记录弹框
    toggleServiceRecordModal: PropTypes.func.isRequired,
    // 接口的loading状态
    interfaceState: PropTypes.object.isRequired,
    getSearchServerPersonList: PropTypes.func.isRequired,
    searchServerPersonList: PropTypes.array.isRequired,
    // 联系方式接口loading
    isContactLoading: PropTypes.bool,
    // 服务记录接口loading
    isRecordLoading: PropTypes.bool,
    serviceDepartment: PropTypes.object,
    // 手动上传日志
    handleFilter: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleOrder: PropTypes.func.isRequired,
    handleCheck: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    handleAddServiceRecord: PropTypes.func.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    custServedByPostnResult: PropTypes.bool.isRequired,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    queryHoldingProduct: PropTypes.func.isRequired,
    holdingProducts: PropTypes.object.isRequired,
    addCallRecord: PropTypes.func.isRequired,
    currentCommonServiceRecord: PropTypes.object.isRequired,
    // 组合产品订购客户查询持仓证券重合度
    queryHoldingSecurityRepetition: PropTypes.func.isRequired,
    holdingSecurityData: PropTypes.object.isRequired,
    getCustRangeByAuthority: PropTypes.func.isRequired,
    queryCustSignedLabels: PropTypes.func.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    signCustLabels: PropTypes.func.isRequired,
    signBatchCustLabels: PropTypes.func.isRequired,
    custLabel: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    queryHoldingIndustryDetail: PropTypes.func.isRequired,
    industryDetail: PropTypes.object.isRequired,
  }

  static defaultProps = {
    custRange: [],
    empInfo: {},
    custContactData: EMPTY_OBJECT,
    custEmail: EMPTY_OBJECT,
    serviceRecordData: EMPTY_OBJECT,
    cycle: EMPTY_LIST,
    isContactLoading: false,
    isRecordLoading: false,
    filesList: [],
    serviceDepartment: {},
  }

  static childContextTypes = {
    getSearchServerPersonList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      expandAll: false,
      queryParam: {},
      // createCustRange: [],
      cycleSelect: '',
      // 初始化没有loading
      isLoadingEnd: true,
    };
    // 用户默认岗位orgId
    this.orgId = emp.getOrgId();
    // 用户工号
    this.empId = emp.getId();
    // 判断当前登录用户是否在非营业部（公司或经总）
    this.isNotSaleDepartment = emp.isManagementHeadquarters(this.orgId)
      || emp.isFiliale(this.props.custRange, this.orgId);
    // HTSC 首页指标查询
    this.hasIndexViewPermission = permission.hasIndexViewPermission();
    // HTSC 任务管理岗
    this.hasTkMampPermission = permission.hasTkMampPermission();
    // HTSC 交易信息查询权限（非私密客户）
    this.hasNPCTIQPermission = permission.hasNPCTIQPermission();
    // HTSC 交易信息查询权限（含私密客户）
    this.hasPCTIQPermission = permission.hasPCTIQPermission();
    this.dataForNextPage = {};
  }

  getChildContext() {
    return {
      // 获取 查询服务人员列表
      getSearchServerPersonList: (data) => {
        this.props.getSearchServerPersonList({
          keyword: data,
          pageSize: 10,
          pageNum: 1,
        });
      },
    };
  }

  componentDidMount() {
    const {
      getFiltersOfSightingTelescope,
      getCustRangeByAuthority,
      location: {
        query,
      },
    } = this.props;
    // 请求服务营业部筛选器的数据
    getCustRangeByAuthority();
    // 请求客户列表
    this.getCustomerList(this.props);
    if (_.includes(ENTERLIST_PERMISSION_SIGHTINGLABEL, query.source)) {
      getFiltersOfSightingTelescope({
        prodId: decodeURIComponent(query.labelMapping),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: {
        query: preQuery,
      },
      isContactLoading = false,
      isRecordLoading = false,
    } = this.props;
    const {
      location: {
        query,
      },
      isContactLoading: nextContactLoading = false,
      isRecordLoading: nextRecordLoading = false,
    } = nextProps;
    // query变化、权限列表存在变化和职位切换时，重新获取列表数据
    const {
      selectedIds: preSelectedIds,
      selectAll: preSelectAll,
      ...preOtherQuery
    } = preQuery;
    const {
      selectedIds,
      selectAll,
      ...otherQuery
    } = query;
    if (!_.isEqual(preOtherQuery, otherQuery)) {
      this.getCustomerList(nextProps);
    }

    // loading状态
    // 只有全部loading完毕才触发isLoadingEnd
    if ((isContactLoading && !nextContactLoading && isRecordLoading && !nextRecordLoading)
      || (!nextContactLoading && !nextRecordLoading)) {
      this.setState({
        isLoadingEnd: true,
      });
    }
  }

  // 获取列表数据
  @autobind
  getCustomerList(props) {
    const {
      cycle = [],
      getCustomerData, location: { query },
    } = props;
    const keyword = decodeURIComponent(query.q);
    // 标签名字与标签描述
    const labelName = decodeURIComponent(query.labelName);
    const labelMapping = decodeURIComponent(query.labelMapping);
    const productName = query.productName && decodeURIComponent(query.productName);
    const param = {
      // 必传，当前页
      curPageNum: query.curPageNum || CUR_PAGE,
      // 必传，页大小
      pageSize: query.pageSize || CUR_PAGESIZE,
    };
    // 潜在业务进入客户列表需要传bizFlag='biz'
    if (query.bizFlag) {
      param.bizFlag = query.bizFlag;
    }
    if (query.source === 'search') { // 搜索框
      param.searchTypeReq = 'ALL';
      param.searchText = keyword;
    } else if (_.includes(['tag', 'sightingTelescope'], query.source)) { // 热词或者瞄准镜
      param.primaryKey = [labelMapping];
      param.searchTypeReq = query.type;
      if (query.source === 'sightingTelescope') {
        // 如果是瞄准镜，需要加入labelMapping
        param.labelId = query.labelMapping;
      }
    } else if (query.source === 'association' || query.source === 'securitiesProducts') { // 联想词
      // 非瞄准镜的标签labelMapping传local值时，去请求客户列表searchTypeReq传 Any
      if (query.type === 'INDUSTRY') {
        // 持仓行业按照新版客户列表的传参形式，其他按照以前的格式传参
        param.primaryKeyIndustry = [labelMapping];
      } else {
        param.searchTypeReq = query.type;
        param.searchText = labelName;
        param.primaryKey = [labelMapping];
      }
    } else if (_.includes(['custIndicator', 'numOfCustOpened'], query.source)) { // 经营指标或者投顾绩效
      // 业绩中的时间周期
      param.dateType = query.cycleSelect || (cycle[0] || {}).key;
      param.custType = this.getPostCustType(query);
    } else if (query.source === 'orderCombination') {
      // 订购组合和证券产品
      param.primaryKeyJxgrps = [labelMapping];
    } else if (query.source === 'external') { // 外部平台
      param.searchTypeReq = query.type;
      param.primaryKey = [labelMapping];
      // 下面参数用在发起任务页面
      this.dataForNextPage.type = query.type;
      this.dataForNextPage.id = labelMapping;
      this.dataForNextPage.product = labelName;
      this.dataForNextPage.productName = productName;
    } else if (query.source === 'productPotentialTargetCust') { // 产品潜在目标客户，产品中心外部跳转
      // type是LABEL
      // 目前只有一个label，将labelMapping传给后台
      param.searchTypeReq = query.type;
      param.primaryKey = [labelMapping];
      // 产品潜在目标客户进来，默认都是瞄准镜标签，需要加入labelMapping
      param.labelId = query.labelMapping;
    }
    // 客户业绩参数
    if (query.customerType) {
      param.performanceForm = {
        type: 'customerType',
        value: query.customerType,
      };
    }
    // 业绩业务参数
    if (query.rightType) {
      param.performanceForm = {
        type: 'rightType',
        value: query.rightType,
      };
    }

    param.orgId = this.getPostOrgId(query);
    param.ptyMngId = this.getPostPtyMngId(query);
    // 过滤数组
    const filtersReq = [];
    // 排序条件
    const sortsReqList = [];
    if (query.filters) {
      const filtersArray = query.filters ? query.filters.split('|') : [];
      const {
        filters,
        labels,
      } = getCustomerListFilters(filtersArray, labelMapping, filtersReq);
      param.filtersReq = filters;
      if (query.source === 'sightingTelescope') {
        param.primaryKey = labels;
      }
    }
    if (query.sortType || query.sortDirection) {
      sortsReqList.push({
        sortType: query.sortType,
        sortDirection: query.sortDirection,
      });
    } else {
      sortsReqList.push(DEFAULT_SORT);
    }
    if (!_.isEmpty(filtersReq)) {
      param.filtersReq = filtersReq;
    }
    if (!_.isEmpty(sortsReqList)) {
      param.sortsReqList = sortsReqList;
    }
    this.setState({
      queryParam: param,
    });
    getCustomerData(param);
  }

  // 获取 客户列表接口的orgId入参的值
  getPostOrgId(query = {}) {
    // 服务营业部筛选字段departmentOrgId有值且不等于all
    if (query.departmentOrgId) {
      return query.departmentOrgId !== ALL_DEPARTMENT_ID ? query.departmentOrgId : '';
    }
    // 从首页的搜索、热词、联想词、瞄准镜和外部平台过来，判断是否有任务管理权限
    if (_.includes(ENTERLIST_PERMISSION_TASK_MANAGE, query.source)) {
      return this.hasTkMampPermission ? this.orgId : '';
    }
    // 从首页潜在业务客户过来
    if (query.source === 'business') {
      // 营业部登录用户只能看名下客户
      // 非营业部登录用户有权限时
      if (this.isNotSaleDepartment && this.hasTkMampPermission) {
        return this.orgId;
      }
    }
    // 首页新增客户和业务开通进来的
    if (_.includes(ENTERLIST_PERMISSION_INDEX_QUERY, query.source)) {
      if (query.orgId) {
        return query.orgId !== MAIN_MAGEGER_ID ? query.orgId : '';
      }
      return this.hasIndexViewPermission ? this.orgId : '';
    }
    /**
     * url中存在了orgId等于all,
     * 任务管理岗权限作用的首页入口进入列表，没有任务管理岗权限
     * 首页指标查询权限作用的首页入口进入列表，没有首页指标查询权限
     * 3中情况返回空字符串
     */
    return '';
  }

  // 获取 客户列表接口的ptyMngId入参的值
  getPostPtyMngId(query = {}) {
    // url中存在ptyMng，取id
    if (query.ptyMngId) {
      return query.ptyMngId;
    }
    // 从首页的搜索、热词、联想词、瞄准镜和外部平台过来，判断是否有任务管理权限
    if (_.includes(ENTERLIST_PERMISSION_TASK_MANAGE, query.source)) {
      return this.hasTkMampPermission ? '' : this.empId;
    }
    // 从首页潜在业务客户过来
    if (query.source === 'business') {
      // 没有权限时或营业部登录用户只能看名下客户
      if (!(this.isNotSaleDepartment && this.hasTkMampPermission)) {
        return this.empId;
      }
    }
    // 首页新增客户和业务开通进来的
    if (_.includes(ENTERLIST_PERMISSION_INDEX_QUERY, query.source)) {
      if (!this.hasIndexViewPermission
        || (query.orgId && query.orgId === MAIN_MAGEGER_ID)) {
        return this.empId;
      }
    }
    return '';
  }

  // 获取 客户列表接口的custType入参的值
  getPostCustType(query = {}) {
    if (query.departmentOrgId && query.departmentOrgId === ALL_DEPARTMENT_ID) {
      return CUST_MANAGER;
    }
    if (!this.hasIndexViewPermission
      || (query.orgId && query.orgId === MAIN_MAGEGER_ID)) {
      return CUST_MANAGER;
    }
    return ORG;
  }

  @autobind
  setLoading() {
    this.setState({
      isLoadingEnd: false,
    });
  }

  // 组织机构树切换和时间周期切换
  @autobind
  updateQueryState(state) {
    // console.log('updateQueryState: ', state);
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    const {
      replace,
      location: { query, pathname },
    } = this.props;
    const { cycleSelect } = state;
    const obj = {};
    if (cycleSelect) {
      obj.cycleSelect = cycleSelect;
    }
    replace({
      pathname,
      query: {
        ...query,
        ...obj,
        curPageNum: 1,
        selectAll: false,
        selectedIds: '',
      },
    });
  }

  // 筛选变化
  @autobind
  filterChange(obj) {
    const {
      replace,
      location: { query, pathname },
      handleFilter,
    } = this.props;
    const filterSeperator = '|';
    // 将筛选项组装成
    // type.a|category.b,c,d  形式放到url中
    const { filters = '' } = query;
    const filtersArray = filters ? filters.split(filterSeperator) : [];
    const newFilterArray = [...filtersArray];
    // 手动上传日志
    handleFilter({ name: obj.name, value: obj.value });
    const index = _.findIndex(filtersArray, o => o.split('.')[0] === obj.name);
    const filterItem = `${obj.name}.${obj.value}`;
    if (index > -1) {
      newFilterArray[index] = filterItem;
    } else {
      newFilterArray.push(filterItem);
    }
    replace({
      pathname,
      query: {
        ...query,
        // [obj.name]: obj.value,
        filters: newFilterArray.join(filterSeperator),
        curPageNum: 1,
        selectAll: false,
        selectedIds: '',
      },
    });
  }

  // 排序条件变化
  @autobind
  orderChange(obj) {
    const {
      replace,
      location: { query, pathname },
      handleOrder,
    } = this.props;
    // 手动上传日志
    handleOrder({ sortType: obj.sortType, sortDirection: obj.sortDirection });

    replace({
      pathname,
      query: {
        ...query,
        sortType: obj.sortType,
        sortDirection: obj.sortDirection,
        curPageNum: 1,
      },
    });
  }

  // 翻页动作
  @autobind
  handlePageChange(page, pageSize) {
    const { replace, location: { query, pathname } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        pageSize,
        curPageNum: page,
      },
    });
  }

  // 改变一页的大小
  @autobind
  handleSizeChange(current, size) {
    const { replace, location: { query, pathname } } = this.props;
    // console.log('current, size:', current, size);
    replace({
      pathname,
      query: {
        ...query,
        pageSize: size,
        curPageNum: 1,
      },
    });
  }

  render() {
    const {
      push,
      location,
      replace,
      dict,
      custList,
      page,
      monthlyProfits,
      getCustIncome,
      getCustContact,
      getCustEmail,
      getServiceRecord,
      custContactData,
      custEmail,
      serviceRecordData,
      cycle,
      toggleServiceRecordModal,
      interfaceState,
      searchServerPersonList,
      empInfo: { empInfo = EMPTY_OBJECT },
      serviceDepartment,
      handleSelect,
      handleCheck,
      handleSearch,
      handleCloseClick,
      handleAddServiceRecord,
      handleCollapseClick,
      clearCreateTaskData,
      queryCustUuid,
      getCeFileList,
      filesList,
      custServedByPostnResult,
      sightingTelescopeFilters,
      isSendCustsServedByPostn,
      sendCustsServedByPostnResult,
      addServeRecord,
      motSelfBuiltFeedbackList,
      queryHoldingProduct,
      holdingProducts,
      addCallRecord,
      currentCommonServiceRecord,
      queryHoldingSecurityRepetition,
      holdingSecurityData,
      queryCustSignedLabels,
      queryLikeLabelInfo,
      signCustLabels,
      signBatchCustLabels,
      custLabel,
      custLikeLabel,
      queryHoldingIndustryDetail,
      industryDetail,
    } = this.props;
    const {
      sortDirection,
      sortType,
      orgId,
      source,
      pageSize,
      curPageNum,
      q,
      cycleSelect,
      bname,
      combinationName = '',
      type,
      labelName,
    } = location.query;
    // 排序的默认值 ： 总资产降序
    let reorderValue = DEFAULT_SORT;
    if (sortType && sortDirection) {
      reorderValue = { sortType, sortDirection };
    }
    const { expandAll, queryParam, isLoadingEnd } = this.state;
    const custRangeProps = {
      orgId,
      custRange: serviceDepartment,
      expandAll,
    };
    const cycleTimeProps = {
      updateQueryState: this.updateQueryState,
    };
    if (_.includes(['custIndicator', 'numOfCustOpened'], source)) {
      const selectValue = cycleSelect || (cycle[0] || {}).key;
      cycleTimeProps.cycle = cycle;
      cycleTimeProps.selectValue = selectValue;
    }
    return (
      <div className={styles.customerlist}>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={12}>
            {
              <CustomerTotal
                type={source}
                num={page.total}
                bname={bname}
                combinationName={combinationName}
                subType={type}
                labelName={labelName}
              />
            }
          </Col>
          <Col span={12}>
            <TimeCycle
              source={source}
              {...cycleTimeProps}
            />
          </Col>
        </Row>
        <Filter
          sightingTelescopeFilters={sightingTelescopeFilters}
          dict={dict}
          location={location}
          onFilterChange={this.filterChange}
        />
        <CustomerLists
          handleCollapseClick={handleCollapseClick}
          handleAddServiceRecord={handleAddServiceRecord}
          handleCloseClick={handleCloseClick}
          handleSearch={handleSearch}
          handleCheck={handleCheck}
          handleSelect={handleSelect}
          dict={dict}
          empInfo={empInfo}
          condition={queryParam}
          entertype={ENTER_TYPE[source] || DEFAULT_ENTER_TYPE}
          location={location}
          replace={replace}
          push={push}
          custList={custList}
          q={decodeURIComponent(q)}
          page={page}
          curPageNum={curPageNum}
          pageSize={pageSize}
          monthlyProfits={monthlyProfits}
          custIncomeReqState={interfaceState[effects.getCustIncome]}
          onPageChange={this.handlePageChange}
          onSizeChange={this.handleSizeChange}
          getCustIncome={getCustIncome}
          getCustContact={getCustContact}
          getCustEmail={getCustEmail}
          getServiceRecord={getServiceRecord}
          custContactData={custContactData}
          custEmail={custEmail}
          serviceRecordData={serviceRecordData}
          toggleServiceRecordModal={toggleServiceRecordModal}
          reorderValue={reorderValue}
          onReorderChange={this.orderChange}
          searchServerPersonList={searchServerPersonList}
          {...cycleTimeProps}
          {...custRangeProps}
          isLoadingEnd={isLoadingEnd}
          onRequestLoading={this.setLoading}
          clearCreateTaskData={clearCreateTaskData}
          queryCustUuid={queryCustUuid}
          getCeFileList={getCeFileList}
          filesList={filesList}
          custServedByPostnResult={custServedByPostnResult}
          hasTkMampPermission={this.hasTkMampPermission}
          hasIndexViewPermission={this.hasIndexViewPermission}
          isSendCustsServedByPostn={isSendCustsServedByPostn}
          sendCustsServedByPostnResult={sendCustsServedByPostnResult}
          addServeRecord={addServeRecord}
          motSelfBuiltFeedbackList={motSelfBuiltFeedbackList}
          hasNPCTIQPermission={this.hasNPCTIQPermission}
          hasPCTIQPermission={this.hasPCTIQPermission}
          queryHoldingProduct={queryHoldingProduct}
          holdingProducts={holdingProducts}
          queryHoldingProductReqState={interfaceState[effects.queryHoldingProduct]}
          isNotSaleDepartment={this.isNotSaleDepartment}
          dataForNextPage={this.dataForNextPage}
          addCallRecord={addCallRecord}
          currentCommonServiceRecord={currentCommonServiceRecord}
          queryHoldingSecurityRepetition={queryHoldingSecurityRepetition}
          holdingSecurityData={holdingSecurityData}
          queryCustSignedLabels={queryCustSignedLabels}
          queryLikeLabelInfo={queryLikeLabelInfo}
          signCustLabels={signCustLabels}
          signBatchCustLabels={signBatchCustLabels}
          custLabel={custLabel}
          custLikeLabel={custLikeLabel}
          queryHoldingIndustryDetail={queryHoldingIndustryDetail}
          industryDetail={industryDetail}
          queryHoldingIndustryDetailReqState={interfaceState[effects.queryHoldingIndustryDetail]}
        />
      </div>
    );
  }
}
