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
import Filter from '../../components/customerPool/list/Filter__';
import CustomerLists from '../../components/customerPool/list/CustomerLists__';
import MatchArea from '../../components/customerPool/list/individualInfo/MatchArea';
import { dynamicInsertQuota } from '../../components/customerPool/list/sort/config';
import { permission, emp, url, check } from '../../helper';
import withRouter from '../../decorators/withRouter';
import { seperator, sessionStore } from '../../config';

import {
  ENTER_TYPE,
  ALL_DEPARTMENT_ID,
  MAIN_MAGEGER_ID,
  ENTERLIST_PERMISSION_TASK_MANAGE,
  ENTERLIST_PERMISSION_INDEX_QUERY,
  ENTERLIST_LEFTMENU,
} from './config';

import { RANDOM } from '../../config/filterContant';

import styles from './customerlist__.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const CUR_PAGE = 1; // 默认当前页
const CUR_PAGESIZE = 20; // 默认页大小

const DEFAULT_SORT_DIRECTION = 'desc';
const DEFAULT_SORT = { sortType: 'totAset', sortDirection: DEFAULT_SORT_DIRECTION }; // 默认排序方式

function getFilterArray(labels, hashString) {
  const filtersArray = [];
  const labelList = [].concat(labels);

  const labelFilters = labelList
    .map(key => sessionStore.get(`CUSTOMERPOOL_${key}_${hashString}`));

  if (!_.isEmpty(labelFilters)) {
    _.each(labelFilters,
      filterList =>
        _.each(filterList, item => filtersArray.push(item.optionKey)));
  }

  return filtersArray;
}

function addRangeParams(filterObj) {
  const param = {};
  const rangeParam = [
    'totAset', // 总资产
    'age', // 年龄范围
    'cashAmt', // 资金余额
    'avlAmt', // 普通可用资金
    'avlAmtCrdt', // 信用可用资金
    'totMktVal', // 总市值
    'outMktVal', // 外部市值
  ];

  _.each(rangeParam, (key) => {
    // 总资产
    if (filterObj[key]) {
      param[key] = {
        minVal: filterObj[key][0] || null,
        maxVal: filterObj[key][1] || null,
      };
    }
  });

  // 普通股基佣金率
  if (filterObj.minFee) {
    const min = filterObj.minFee[0];
    const max = filterObj.minFee[1];

    param.minFee = {
      minVal: min ? (min / 1000).toFixed(5) : null,
      maxVal: max ? (max / 1000).toFixed(5) : null,
    };
  }

  // 归集率
  if (filterObj.gjlRate) {
    const min = filterObj.gjlRate[0];
    const max = filterObj.gjlRate[1];

    param.gjlRate = {
      minVal: min ? (min / 100).toFixed(5) : null,
      maxVal: max ? (max / 100).toFixed(5) : null,
    };
  }

  return param;
}

function addDateParams(filterObj) {
  const param = {};
  const dateParam = [
    'dateOpened', // 开户日期
    'highPrdtDt', // 新增高端产品户
    'buyProdDt', // buyProdDt
    'gjzDt', // 新增高净值
    'tgSignDate', // 签约客户
    'validDt', // 新增有效户
  ];

  _.each(dateParam, (key) => {
    if (filterObj[key]) {
      param[key] = {
        dateStart: filterObj[key][0] || null,
        dateEnd: filterObj[key][1] || null,
      };
    }
  });

  return param;
}

function addRadioRangeParams(filterObj) {
  const param = {};
  const radioRangeParams = [
    'kfBuyAmt', // 公墓基金
    'smBuyAmt', // 私募基金
    'finaBuyAmt', // 紫金产品
    'otcBuyAmt', // OTC
    'gjAmt', // 股基交易量
    'gjPurRake', // 股基净佣金
    'netIncome', // 净利息收入
    'purRake', // 净佣金
    'saleFare', // 产品净手续费
    'purFinAset', // 净转入
  ];

  _.each(radioRangeParams, (key) => {
    if (filterObj[key]) {
      param[key] = {
        dateType: filterObj[key][0] || null,
        minVal: filterObj[key][1] || null,
        maxVal: filterObj[key][2] || null,
      };
    }
  });
  return param;
}

function addSingleParams(filterObj) {
  const param = {};
  const singleParams = [
    'customType',  // 客户性质
    'custClass',  // 客户类型
  ];

  _.each(singleParams, (key) => {
    if (filterObj[key]) {
      param[key] = filterObj[key] || null;
    }
  });

  return param;
}

function addMultiParams(filterObj) {
  const param = {};
  const multiParams = [
    'rights', // 已开通业务
    'unrights', // 未开通业务
    'customerLevel', // 客户等级
    'accountStatus', // 账户状态
    'completedRate', // 信息完备率
    'riskLevels', // 风险等级
  ];

  _.each(multiParams, (key) => {
    if (filterObj[key]) {
      param[key] = [].concat(filterObj[key]);
    }
  });

  return param;
}

function getFilterParam(filterObj, hashString) {
  const param = {};

  // 标签
  const filtersArray = getFilterArray(filterObj.primaryKeyLabels, hashString);
  param.primaryKeyLabels = _.compact(
    []
      .concat(filterObj.primaryKeyLabels)
      .concat(filtersArray));

  // 开通业务
  if (filterObj.businessOpened && filterObj.businessOpened[0]) {
    param.businessOpened = {
      dateType: filterObj.businessOpened[0] || null,
      businessType: filterObj.businessOpened[1] || null,
    };
    if (param.businessOpened.businessType === 'all') {
      param.businessOpened.businessType = null;
    }
  }
  // 持仓产品
  if (filterObj.primaryKeyPrdts) {
    param.primaryKeyPrdts = _.compact([].concat(filterObj.primaryKeyPrdts[0]));
  }

  // 订购组合
  if (filterObj.primaryKeyJxgrps) {
    param.primaryKeyJxgrps = _.compact([].concat(filterObj.primaryKeyJxgrps[0]));
  }

  // 持仓行业
  if (filterObj.primaryKeyIndustry) {
    param.primaryKeyIndustry = _.compact([].concat(filterObj.primaryKeyIndustry));
  }


  // 最近一次服务 unServiced
  if (filterObj.lastServDt) {
    if (filterObj.lastServDt[1] === 'serviced') {
      param.lastServDt = {
        dateStart: filterObj.lastServDt[0] || null,
      };
    } else if (filterObj.lastServDt[1] === 'unServiced') {
      param.lastServDt = {
        dateEnd: filterObj.lastServDt[0] || null,
      };
    }
  }

  // 介绍人
  if (filterObj.devMngId) {
    param.devMngId = filterObj.devMngId[0] || null;
  }

  // 处理所有的单选类参数
  const singleParams = addSingleParams(filterObj);
  // 处理所有的多选类参数
  const multiParams = addMultiParams(filterObj);
  // 处理所有的数值范围类参数
  const rangeParams = addRangeParams(filterObj);
  // 处理所有的日期范围类参数
  const dateParams = addDateParams(filterObj);
  // 处理所有的单选+日期范围类参数
  const radioRangeParams = addRadioRangeParams(filterObj);

  return {
    ...param,
    ...singleParams,
    ...multiParams,
    ...rangeParams,
    ...dateParams,
    ...radioRangeParams,
  };
}

function getSortParam(query, filterParams) {
  const { sortType, sortDirection } = query;
  let sortsReqList = [DEFAULT_SORT];
  const sortFilter = filterParams[sortType] || {};
  const dateType = sortFilter.dateType || '';
  if (sortType && sortDirection) {
    sortsReqList = [{ sortType, sortDirection, dateType }];
  }
  return {
    sortsReqList,
  };
}

const effects = {
  allInfo: 'customerPool/getAllInfo',
  getDictionary: 'customerPool/getDictionary',
  getCustomerList: 'customerPool/getCustomerList',
  getCustIncome: 'customerPool/getCustIncome',
  getCustContact: 'customerPool/getCustContact',
  getServiceRecord: 'customerPool/getServiceRecord',
  getCustomerScope: 'customerPool/getCustomerScope',
  getSearchPersonList: 'customerPool/getSearchPersonList',
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
  getFiltersOfSightingTelescopeSequence: 'customerPool/getFiltersOfSightingTelescopeSequence',
  isSendCustsServedByPostn: 'customerPool/isSendCustsServedByPostn',
  addServeRecord: 'customerPool/addCommonServeRecord',
  queryHoldingProduct: 'customerPool/queryHoldingProduct',
  queryProduct: 'customerPool/queryProduct',
  queryJxGroupProduct: 'customerPool/queryJxGroupProduct',
  getTagList: 'customerPool/getTagList',
  clearProductData: 'customerPool/clearProductData',
  clearSearchPersonList: 'customerPool/clearSearchPersonList',
  clearJxGroupProductData: 'customerPool/clearJxGroupProductData',
  addCallRecord: 'customerPool/addCallRecord',
  queryHoldingSecurityRepetition: 'customerPool/queryHoldingSecurityRepetition',
  getCustRangeByAuthority: 'customerPool/getCustRangeByAuthority',
  queryIndustryList: 'customerPool/queryIndustryList',
  queryHoldingIndustryDetail: 'customerPool/queryHoldingIndustryDetail',
  queryCustSignedLabels: 'customerLabel/queryCustSignedLabels',
  queryLikeLabelInfo: 'customerLabel/queryLikeLabelInfo',
  signCustLabels: 'customerLabel/signCustLabels',
  signBatchCustLabels: 'customerLabel/signBatchCustLabels',
  addLabel: 'customerLabel/addLabel',
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
  // 最近服务记录
  serviceRecordData: state.customerPool.serviceRecordData,
  // 统计周期
  cycle: state.app.dict.kPIDateScopeType,
  // 接口的loading状态
  interfaceState: state.loading.effects,
  // 服务人员列表
  searchServerPersonList: state.customerPool.searchServerPersonList,
  // 列表页的服务营业部
  serviceDepartment: state.customerPool.serviceDepartment,
  filesList: state.customerPool.filesList,
  // 是否是本人名下客户
  custServedByPostnResult: state.customerPool.custServedByPostnResult,
  allSightingTelescopeFilters: state.customerPool.allSightingTelescopeFilters,
  // 是否包含非本人名下客户和超出1000条数据限制
  sendCustsServedByPostnResult: state.customerPool.sendCustsServedByPostnResult,
  // 自建任务平台的服务类型、任务反馈字典
  motSelfBuiltFeedbackList: state.app.motSelfBuiltFeedbackList,
  // 持仓产品详情
  holdingProducts: state.customerPool.holdingProducts,
  searchedProductList: state.customerPool.productList,
  tagList: state.customerPool.tagList,
  jxGroupProductList: state.customerPool.jxGroupProductList,
  // 添加服务记录成功后返回的服务记录的id
  currentCommonServiceRecord: state.customerPool.currentCommonServiceRecord,
  // 组合产品订购客户重复的持仓证券
  holdingSecurityData: state.customerPool.holdingSecurityData,
  // 持仓行业过滤器的数据
  industryList: state.customerPool.industryList,
  // 持仓行业的详情
  industryDetail: state.customerPool.industryDetail,
  // 客户已标记标签
  custLabel: state.customerLabel.custLabel,
  // 模糊搜索客户标签
  custLikeLabel: state.customerLabel.custLikeLabel,
});

const mapDispatchToProps = {
  getAllInfo: fetchDataFunction(true, effects.allInfo),
  getCustomerData: fetchDataFunction(true, effects.getCustomerList),
  getCustIncome: fetchDataFunction(false, effects.getCustIncome),
  getCustomerScope: fetchDataFunction(true, effects.getCustomerScope),
  getServiceRecord: fetchDataFunction(true, effects.getServiceRecord),
  getCustContact: fetchDataFunction(true, effects.getCustContact),
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
  getSearchServerPersonList: fetchDataFunction(false, effects.getSearchServerPersonList),
  getSearchPersonList: fetchDataFunction(false, effects.getSearchPersonList),
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
  queryProduct: fetchDataFunction(false, effects.queryProduct),
  queryJxGroupProduct: fetchDataFunction(false, effects.queryJxGroupProduct),
  getTagList: fetchDataFunction(false, effects.getTagList),
  clearProductData: fetchDataFunction(false, effects.clearProductData),
  clearSearchPersonList: fetchDataFunction(false, effects.clearSearchPersonList),
  clearJxGroupProductData: fetchDataFunction(false, effects.clearJxGroupProductData),
  // 获取uuid
  queryCustUuid: fetchDataFunction(true, effects.queryCustUuid),
  getFiltersOfSightingTelescopeSequence:
    fetchDataFunction(true, effects.getFiltersOfSightingTelescopeSequence),
  // 查询是否包含非本人名下客户和超出1000条数据限制
  isSendCustsServedByPostn: fetchDataFunction(true, effects.isSendCustsServedByPostn),
  // 添加服务记录
  addServeRecord: fetchDataFunction(true, effects.addServeRecord),
  // 根据持仓产品的id查询对应的详情
  queryHoldingProduct: fetchDataFunction(false, effects.queryHoldingProduct),
  // 添加通话记录关联服务记录
  addCallRecord: fetchDataFunction(true, effects.addCallRecord),
  // 获取服务营业部的数据
  getCustRangeByAuthority: fetchDataFunction(true, effects.getCustRangeByAuthority),
  // 组合产品订购客户查询持仓证券重合度
  queryHoldingSecurityRepetition: fetchDataFunction(false, effects.queryHoldingSecurityRepetition),
  queryIndustryList: fetchDataFunction(true, effects.queryIndustryList),
  queryHoldingIndustryDetail: fetchDataFunction(false, effects.queryHoldingIndustryDetail),
  // 查询客户已标记标签
  queryCustSignedLabels: fetchDataFunction(true, effects.queryCustSignedLabels),
  queryLikeLabelInfo: fetchDataFunction(false, effects.queryLikeLabelInfo),
  signCustLabels: fetchDataFunction(true, effects.signCustLabels),
  signBatchCustLabels: fetchDataFunction(true, effects.signBatchCustLabels),
  addLabel: fetchDataFunction(true, effects.addLabel),
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
    custContactData: PropTypes.object,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object,
    cycle: PropTypes.array,
    // getStatisticalPeriod: PropTypes.func.isRequired,
    // 显示隐藏添加服务记录弹框
    toggleServiceRecordModal: PropTypes.func.isRequired,
    // 接口的loading状态
    interfaceState: PropTypes.object.isRequired,
    getSearchServerPersonList: PropTypes.func.isRequired,
    getSearchPersonList: PropTypes.func.isRequired,
    searchServerPersonList: PropTypes.array.isRequired,
    serviceDepartment: PropTypes.object.isRequired,
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
    getFiltersOfSightingTelescopeSequence: PropTypes.func.isRequired,
    allSightingTelescopeFilters: PropTypes.array.isRequired,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    motSelfBuiltFeedbackList: PropTypes.array.isRequired,
    queryHoldingProduct: PropTypes.func.isRequired,
    queryProduct: PropTypes.func.isRequired,
    queryJxGroupProduct: PropTypes.func.isRequired,
    getTagList: PropTypes.func.isRequired,
    searchedProductList: PropTypes.array,
    jxGroupProductList: PropTypes.array,
    tagList: PropTypes.array,
    clearProductData: PropTypes.func.isRequired,
    clearSearchPersonList: PropTypes.func.isRequired,
    clearJxGroupProductData: PropTypes.func.isRequired,
    holdingProducts: PropTypes.object.isRequired,
    addCallRecord: PropTypes.func.isRequired,
    currentCommonServiceRecord: PropTypes.object.isRequired,
    getCustRangeByAuthority: PropTypes.func.isRequired,
    // 组合产品订购客户查询持仓证券重合度
    queryHoldingSecurityRepetition: PropTypes.func.isRequired,
    holdingSecurityData: PropTypes.object.isRequired,
    queryIndustryList: PropTypes.func.isRequired,
    industryList: PropTypes.array.isRequired,
    queryHoldingIndustryDetail: PropTypes.func.isRequired,
    industryDetail: PropTypes.object.isRequired,
    queryCustSignedLabels: PropTypes.func.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    signCustLabels: PropTypes.func.isRequired,
    signBatchCustLabels: PropTypes.func.isRequired,
    custLabel: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    addLabel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    custRange: [],
    empInfo: {},
    custContactData: EMPTY_OBJECT,
    serviceRecordData: EMPTY_OBJECT,
    cycle: EMPTY_LIST,
    filesList: [],
    searchedProductList: [],
    jxGroupProductList: [],
    tagList: [],
    serviceDepartment: {},
  }

  static childContextTypes = {
    getSearchServerPersonList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const {
      location: {
        query,
      },
    } = props;
    this.state = {
      expandAll: false,
      queryParam: {},
      cycleSelect: '',
    };
    // 用户默认岗位orgId
    this.orgId = emp.getOrgId();
    this.hashString = query.hashString || RANDOM;
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
    sessionStore.set(`CUSTOMERPOOL_FILTER_SELECT_FROM_MOREFILTER_${this.hashString}`, false);
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
      getTagList,
      location: {
        query,
      },
      getCustRangeByAuthority,
      queryIndustryList,
    } = this.props;
    // 请求客户列表
    this.getCustomerList(this.props);
    // 请求所有的标签
    getTagList();
    // 请求瞄准镜标签相关的子标签
    this.getFiltersOfAllSightingTelescope(query);
    // 请求服务营业部筛选器的数据
    getCustRangeByAuthority();
    // 请求持仓行业数据
    queryIndustryList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: {
        query: preQuery,
      },
    } = this.props;

    const {
      location: {
        query,
      },
    } = nextProps;

    // query变化、权限列表存在变化和职位切换时，重新获取列表数据
    const preOtherQuery = _.omit(preQuery, ['selectedIds', 'selectAll']);
    const otherQuery = _.omit(query, ['selectedIds', 'selectAll']);

    // TODO：根据location请求相应的所有子标签条件
    if (!_.isEqual(preOtherQuery, otherQuery) &&
      !sessionStore.get(`CUSTOMERPOOL_FILTER_SELECT_FROM_MOREFILTER_${this.hashString}`)) {
      this.getCustomerList(nextProps);
    }
    sessionStore.set(`CUSTOMERPOOL_FILTER_SELECT_FROM_MOREFILTER_${this.hashString}`, false);
  }

  @autobind
  getFiltersOfAllSightingTelescope(query) {
    const { getFiltersOfSightingTelescopeSequence } = this.props;
    const filters = query.filters || '';
    const primaryKeyLabels = url.transfromFilterValFromUrl(filters).primaryKeyLabels;
    if (primaryKeyLabels) {
      const sightingTelescopeList = this.checkPrimaryKeyLabel(primaryKeyLabels);
      getFiltersOfSightingTelescopeSequence({
        sightingTelescopeList,
      });
    }
  }

  @autobind
  getCustomerList(props) {
    const {
      getCustomerData, location: { query },
    } = props;

    const filterObj = url.transfromFilterValFromUrl(query.filters);
    const keyword = decodeURIComponent(filterObj.searchText || '');
    const labelName = decodeURIComponent(query.labelName);

    const param = {
      // 必传，当前页
      curPageNum: query.curPageNum || CUR_PAGE,
      // 必传，页大小
      pageSize: query.pageSize || CUR_PAGESIZE,
    };
    const orgId = this.getPostOrgId(query);
    param.orgId = orgId;
    const { ptyMngId } = this.getPostPtyMngId(query);
    param.ptyMngId = ptyMngId;

    // 潜在业务客户增加一个bizFlag入参
    if (query.bizFlag) {
      param.bizFlag = query.bizFlag;
    }

    // 当服务营业部为不限时, 如果服务经理不是当前用户，则营业部默认条件为当前职位归属机构
    if (!orgId && ptyMngId !== emp.getId()) {
      param.orgId = emp.getOrgId();
    }

    if (keyword) {   // 搜索框模糊下钻
      param.searchTypeReq = 'ALL';
      param.searchText = keyword;
    }

    if (query.source === 'association') { // 热词
      if (query.type !== 'LABEL') {  // 热词里面竟然有普通标签，sb瞎写，这里把普通标签的处理去掉
        param.searchTypeReq = query.type;
        param.searchText = labelName;
      }
    }

    if (query.source === 'association') {
      if (query.type === 'PRODUCT' || query.type === 'INDUSTRY') {
        param.searchTypeReq = null;
        param.searchText = null;
      }
    }

    if (query.source === 'tag' || query.source === 'sightingTelescope') {
      param.searchTypeReq = null;
      param.searchText = null;
    }

    const filterParam = getFilterParam(filterObj, this.hashString);
    const sortParam = getSortParam(query, filterParam);

    const finalParam = {
      ...param,
      ...filterParam,
      ...sortParam,
    };

    this.setState({
      queryParam: finalParam,
    });
    getCustomerData(finalParam);
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
    // 从左侧菜单进来，判断是否有任务管理权限或者首页指标查询权限
    if (_.includes(ENTERLIST_LEFTMENU, query.source)) {
      return this.hasTkMampPermission || this.hasIndexViewPermission
        ? this.orgId : '';
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
  @autobind
  getPostPtyMngId(nextQuery) {
    const {
      empInfo: { empInfo },
      location: { query },
    } = this.props;
    const finalQuery = nextQuery || query;
    const { ptyMngId, ptyMngName } = finalQuery;
    const currentPtyMng = {
      ptyMngId: empInfo.empNum,
      ptyMngName: empInfo.empName,
    };
    // url中存在ptyMng，取id
    if (_.has(finalQuery, 'ptyMngId')) {
      return { ptyMngId, ptyMngName };
    }
    // 从首页的搜索、热词、联想词、瞄准镜和外部平台过来，判断是否有任务管理权限
    if (_.includes(ENTERLIST_PERMISSION_TASK_MANAGE, finalQuery.source)) {
      return this.hasTkMampPermission ?
        { ptyMngId: '' } : currentPtyMng;
    }
    // 从首页潜在业务客户过来
    if (finalQuery.source === 'business') {
      // 没有权限时或营业部登录用户只能看名下客户
      if (!(this.isNotSaleDepartment && this.hasTkMampPermission)) {
        return currentPtyMng;
      }
    }
    // 首页新增客户和业务开通进来的
    if (_.includes(ENTERLIST_PERMISSION_INDEX_QUERY, finalQuery.source)) {
      if (!this.hasIndexViewPermission
        || (finalQuery.orgId && finalQuery.orgId === MAIN_MAGEGER_ID)) {
        return currentPtyMng;
      }
    }
    // 从左侧菜单过来，判断是否有任务管理权限或者首页指标查询权限
    if (_.includes(ENTERLIST_LEFTMENU, finalQuery.source)) {
      return this.hasTkMampPermission || this.hasIndexViewPermission ?
        { ptyMngId: '' } : currentPtyMng;
    }
    return { ptyMngId: '' };
  }

  @autobind
  checkPrimaryKeyLabel(primaryKeyLabels) {
    const labelList = []
      .concat(primaryKeyLabels)
      .filter(item => check.isSightingTelescope(item));

    return labelList;
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
  filterChange(obj, isDeleteFilterFromLocation = false) {
    const {
      replace,
      location: { query, pathname },
      handleFilter,
    } = this.props;

    const filterSeperator = seperator.filterSeperator;
    const filterInsideSeperator = seperator.filterInsideSeperator;

    // type.a|category.b,c,d  形式放到url中
    const { filters = '' } = query;
    const filtersArray = filters ? filters.split(filterSeperator) : [];
    const newFilterArray = [...filtersArray];

    // 手动上传日志
    handleFilter({ name: obj.name, value: obj.value });

    // 清除url上所有的已选moreFilter
    if (obj.clearAllMoreFilters) {
      const indexArray = _.map(obj.name,
        key => _.findIndex(filtersArray, o => o.split(filterInsideSeperator)[0] === key));
      _.each(indexArray, (num) => {
        if (num > -1) {
          newFilterArray[num] = '';
        }
      });
    } else {
      const index = _.findIndex(filtersArray, o => o.split(filterInsideSeperator)[0] === obj.name);
      if (isDeleteFilterFromLocation) {
        if (index > -1) {
          newFilterArray[index] = '';
        }
      } else {
        const filterItem = `${obj.name}${filterInsideSeperator}${obj.value}`;
        if (index > -1) {
          newFilterArray[index] = filterItem;
        } else {
          newFilterArray.push(filterItem);
        }
      }
    }
    // 个性化信息与过滤器的联动
    MatchArea.setFilterOrder(obj.name, obj.value, this.hashString);
    // 列表排序与过滤器联动
    const nextSort = this.getSortFromFilter(obj, isDeleteFilterFromLocation);
    const stringifyFilters = newFilterArray.filter(item => item !== '').join(filterSeperator);
    replace({
      pathname,
      query: {
        ...query,
        ...nextSort,
        individualInfo: true,
        filters: stringifyFilters,
        curPageNum: 1,
        selectAll: false,
        selectedIds: '',
        hashString: this.hashString, // 唯一的本地缓存hash
      },
    });
  }

  // 根据过滤器的变化当前排序字段的联动
  @autobind
  getSortFromFilter(filterItem, isDeleteFilterFromLocation = false) {
    const {
      location: { query },
    } = this.props;
    const { sortType = '', sortDirection = '' } = query;
    let currentSort = { sortType, sortDirection };
    const { clearAllMoreFilters, name, value } = filterItem;
    let valueList = _.split(value, seperator.filterValueSeperator);
    valueList = _.filter(valueList, valueItem => valueItem !== '');
    if (clearAllMoreFilters) {
      return currentSort;
    }
    // 当删除当前排序指标对应的过滤器时，排序指标置空使用默认值
    if (isDeleteFilterFromLocation && name === sortType) {
      currentSort = { sortType: '', sortDirection: '' };
    }
    const needDynamicInsertQuota = _.find(dynamicInsertQuota, item => item.filterType === name);
    if (needDynamicInsertQuota) {
      // 当前所触发过滤器下有值并且需要动态插入排序指标，则设置为该排序指标
      if (valueList.length) {
        currentSort = {
          sortType: needDynamicInsertQuota.sortType,
          sortDirection: DEFAULT_SORT_DIRECTION,
        };
      } else if (name === sortType) {
        currentSort = { sortType: '', sortDirection: '' };
      }
    }
    return currentSort;
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
      getServiceRecord,
      custContactData,
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
      isSendCustsServedByPostn,
      sendCustsServedByPostnResult,
      addServeRecord,
      motSelfBuiltFeedbackList,
      queryHoldingProduct,
      holdingProducts,
      queryProduct,
      queryJxGroupProduct,
      searchedProductList,
      jxGroupProductList,
      tagList,
      clearProductData,
      clearSearchPersonList,
      clearJxGroupProductData,
      addCallRecord,
      currentCommonServiceRecord,
      allSightingTelescopeFilters,
      getFiltersOfSightingTelescopeSequence,
      getSearchPersonList,
      queryHoldingSecurityRepetition,
      holdingSecurityData,
      queryIndustryList,
      industryList,
      queryHoldingIndustryDetail,
      industryDetail,
      queryCustSignedLabels,
      queryLikeLabelInfo,
      signCustLabels,
      signBatchCustLabels,
      custLabel,
      custLikeLabel,
      addLabel,
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
      /*  bname, */
    } = location.query;
    // 排序的默认值 ： 总资产降序
    let reorderValue = DEFAULT_SORT;
    if (sortType && sortDirection) {
      reorderValue = { sortType, sortDirection };
    }
    const { expandAll, queryParam } = this.state;

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
        <Filter
          filtersOfAllSightingTelescope={allSightingTelescopeFilters}
          getFiltersOfSightingTelescopeSequence={getFiltersOfSightingTelescopeSequence}
          getSearchPersonList={getSearchPersonList}
          tagList={tagList}
          hashString={this.hashString}
          queryProduct={queryProduct}
          queryJxGroupProduct={queryJxGroupProduct}
          clearProductData={clearProductData}
          clearSearchPersonList={clearSearchPersonList}
          searchedProductList={searchedProductList}
          jxGroupProductList={jxGroupProductList}
          clearJxGroupProductData={clearJxGroupProductData}
          dict={dict}
          location={location}
          onFilterChange={this.filterChange}
          searchServerPersonList={searchServerPersonList}
          queryIndustryList={queryIndustryList}
          industryList={industryList}
        />
        <CustomerLists
          getSearchPersonList={getSearchPersonList}
          clearSearchPersonList={clearSearchPersonList}
          handleCollapseClick={handleCollapseClick}
          handleAddServiceRecord={handleAddServiceRecord}
          handleCloseClick={handleCloseClick}
          handleSearch={handleSearch}
          handleCheck={handleCheck}
          handleSelect={handleSelect}
          dict={dict}
          empInfo={empInfo}
          condition={queryParam}
          entertype={ENTER_TYPE[source]}
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
          getServiceRecord={getServiceRecord}
          custContactData={custContactData}
          serviceRecordData={serviceRecordData}
          toggleServiceRecordModal={toggleServiceRecordModal}
          reorderValue={reorderValue}
          onReorderChange={this.orderChange}
          searchServerPersonList={searchServerPersonList}
          {...cycleTimeProps}
          {...custRangeProps}
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
          addCallRecord={addCallRecord}
          currentCommonServiceRecord={currentCommonServiceRecord}
          currentPytMng={this.getPostPtyMngId()}
          queryHoldingSecurityRepetition={queryHoldingSecurityRepetition}
          holdingSecurityData={holdingSecurityData}
          queryHoldingIndustryDetail={queryHoldingIndustryDetail}
          industryDetail={industryDetail}
          queryHoldingIndustryDetailReqState={interfaceState[effects.queryHoldingIndustryDetail]}
          queryCustSignedLabels={queryCustSignedLabels}
          queryLikeLabelInfo={queryLikeLabelInfo}
          signCustLabels={signCustLabels}
          signBatchCustLabels={signBatchCustLabels}
          custLabel={custLabel}
          custLikeLabel={custLikeLabel}
          addLabel={addLabel}
        />
      </div>
    );
  }
}
