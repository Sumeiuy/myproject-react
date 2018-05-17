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
/* import { Row, Col} from 'antd'; */

/* import TimeCycle from '../../components/customerPool/list/TimeCycle';
import CustomerTotal from '../../components/customerPool/list/CustomerTotal'; */
import Filter from '../../components/customerPool/list/Filter';
import CustomerLists from '../../components/customerPool/list/CustomerLists';
import { permission, emp } from '../../helper';
import withRouter from '../../decorators/withRouter';
/* import { getCustomerListFilters } from '../../helper/page/customerPool'; */
import {
  CUST_MANAGER,
  ORG,
  ENTER_TYPE,
  ALL_DEPARTMENT_ID,
  MAIN_MAGEGER_ID,
} from './config';

import styles from './customerlist.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const CUR_PAGE = 1; // 默认当前页
const CUR_PAGESIZE = 20; // 默认页大小

const DEFAULT_SORT = { sortType: 'Aset', sortDirection: 'desc' }; // 默认排序方式

// 将url上面的filter编码解析为对象
function transfromFilterValFromUrl(filters) {
  // 处理由‘|’分隔的多个过滤器
  const filtersArray = filters ? filters.split('|') : [];

  return _.reduce(filtersArray, (result, value) => {
    const [name, code] = value.split('.');
    let filterValue = code;

    // 如果是多选，需要继续处理','分割的多选值
    if (code.indexOf(',') > -1) {
      filterValue = code.split(',');
    }

    if (name === 'minFee' || name === 'totAset') {
      const minVal = filterValue[0] && filterValue[0].replace('!', '.');
      const maxVal = filterValue[1] && filterValue[1].replace('!', '.');
      filterValue = [minVal, maxVal];
    }

    // 如果对应的过滤器是普通股基佣金率
    result[name] = filterValue; // eslint-disable-line
    return result;
  }, {});
}

function getFilterParam(filterObj) {
  const param = {};
  param.customType = filterObj.customType || null;
  param.custClass = filterObj.custClass || null;
  param.riskLvl = filterObj.riskLvl || null;

  /* if (filterObj.primaryKeyLabels) {
    param.primaryKeyLabels = [].concat(filterObj.primaryKeyLabels);
  } */

  const primaryKeyLabels =
    _.isArray(filterObj.primaryKeyLabels) ?
      filterObj.primaryKeyLabels[0] : filterObj.primaryKeyLabels;

  if (primaryKeyLabels) {
    param.primaryKeyLabels = [].concat(primaryKeyLabels);
  }

  if (filterObj.rights) {
    param.rights = [].concat(filterObj.rights);
  }
  if (filterObj.unrights) {
    param.unrights = [].concat(filterObj.unrights);
  }
  if (filterObj.businessOpened && filterObj.businessOpened[0]) {
    param.businessOpened = {
      dateType: filterObj.businessOpened[0] || null,
      businessType: filterObj.businessOpened[1] || null,
    };
    if (param.businessOpened.businessType === 'all') {
      param.businessOpened.businessType = null;
    }
  }
  if (filterObj.customerLevel) {
    param.customerLevel = [].concat(filterObj.customerLevel);
  }

  if (filterObj.dateOpened) {
    param.dateOpened = {
      dateOpenedStart: filterObj.dateOpened[0] || null,
      dateOpenedEnd: filterObj.dateOpened[1] || null,
    };
  }

  if (filterObj.accountStatus) {
    param.accountStatus = [].concat(filterObj.accountStatus);
  }

  if (filterObj.minFee) {
    const min = filterObj.minFee[0];
    const max = filterObj.minFee[1];

    param.minFee = {
      minVal: min ? (min / 1000).toFixed(5) : null,
      maxVal: max ? (max / 1000).toFixed(5) : null,
    };
  }

  const primaryKeyPrdts =
    _.isArray(filterObj.primaryKeyPrdts) ? filterObj.primaryKeyPrdts[0] : filterObj.primaryKeyPrdts;

  if (primaryKeyPrdts) {
    param.primaryKeyPrdts = [].concat(primaryKeyPrdts);
  }

  if (filterObj.totAset) {
    param.totAset = {
      minVal: filterObj.totAset[0] || null,
      maxVal: filterObj.totAset[1] || null,
    };
  }

  return param;
}

function getSortParam(query) {
  const sortsReqList = [];
  if (query.sortType || query.sortDirection) {
    sortsReqList.push({
      sortType: query.sortType,
      sortDirection: query.sortDirection,
    });
  } else {
    sortsReqList.push(DEFAULT_SORT);
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
  queryHoldingProduct: 'customerPool/queryHoldingProduct',
  clearTaskFlowData: 'customerPool/clearTaskFlowData',
  queryProduct: 'customerPool/queryProduct',
  clearProductData: 'customerPool/clearProductData',
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
  sightingTelescopeFilters: state.customerPool.sightingTelescopeFilters,
  // 是否包含非本人名下客户和超出1000条数据限制
  sendCustsServedByPostnResult: state.customerPool.sendCustsServedByPostnResult,
  // 持仓产品详情
  holdingProducts: state.customerPool.holdingProducts,
  searchedProductList: state.customerPool.productList,
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
  queryProduct: fetchDataFunction(false, effects.queryProduct),
  clearProductData: fetchDataFunction(false, effects.clearProductData),
  // 获取uuid
  queryCustUuid: fetchDataFunction(true, effects.queryCustUuid),
  getFiltersOfSightingTelescope: fetchDataFunction(true, effects.getFiltersOfSightingTelescope),
  // 查询是否包含非本人名下客户和超出1000条数据限制
  isSendCustsServedByPostn: fetchDataFunction(true, effects.isSendCustsServedByPostn),
  // 根据持仓产品的id查询对应的详情
  queryHoldingProduct: fetchDataFunction(false, effects.queryHoldingProduct),
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
    searchServerPersonList: PropTypes.array.isRequired,
    // 联系方式接口loading
    isContactLoading: PropTypes.bool,
    // 服务记录接口loading
    isRecordLoading: PropTypes.bool,
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
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
    queryHoldingProduct: PropTypes.func.isRequired,
    queryProduct: PropTypes.func.isRequired,
    holdingProducts: PropTypes.object.isRequired,
    searchedProductList: PropTypes.array,
    clearProductData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    custRange: [],
    empInfo: {},
    custContactData: EMPTY_OBJECT,
    serviceRecordData: EMPTY_OBJECT,
    cycle: EMPTY_LIST,
    isContactLoading: false,
    isRecordLoading: false,
    filesList: [],
    searchedProductList: [],
  }

  static childContextTypes = {
    getSearchServerPersonList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      expandAll: false,
      queryParam: {},
      cycleSelect: '',
    };
    // HTSC 首页指标查询
    this.hasIndexViewPermission = permission.hasIndexViewPermission();
    // HTSC 任务管理岗
    this.hasTkMampPermission = permission.hasTkMampPermission();
    // HTSC 交易信息查询权限（非私密客户）
    this.hasNPCTIQPermission = permission.hasNPCTIQPermission();
    // HTSC 交易信息查询权限（含私密客户）
    this.hasPCTIQPermission = permission.hasPCTIQPermission();
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
      location: {
        query,
      },
    } = this.props;
    // 请求客户列表
    this.getCustomerList(this.props);
    if (query.source === 'sightingTelescope') {
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
    } = this.props;
    const {
      location: {
        query,
      },
    } = nextProps;

    // query变化、权限列表存在变化和职位切换时，重新获取列表数据
    const preOtherQuery = _.omit(preQuery, ['selectedIds', 'selectAll']);
    const otherQuery = _.omit(query, ['selectedIds', 'selectAll']);
    if (!_.isEqual(preOtherQuery, otherQuery)) {
      this.getCustomerList(nextProps);
    }
  }

  @autobind
  getCustomerList(props) {
    const {
      getCustomerData, location: { query },
    } = props;

    const keyword = decodeURIComponent(query.q);
    const labelName = decodeURIComponent(query.labelName);
    const labelDesc = decodeURIComponent(query.labelDesc);

    const param = {
      // 必传，当前页
      curPageNum: query.curPageNum || CUR_PAGE,
      // 必传，页大小
      pageSize: query.pageSize || CUR_PAGESIZE,
      // 不同的入口进入列表页面
      enterType: ENTER_TYPE[query.source],
    };

    param.orgId = this.getPostOrgId(query);
    param.ptyMngId = this.getPostPtyMngId(query);

    if (query.source === 'search') {   // 搜索框模糊下钻
      param.searchTypeReq = 'ALL';
      param.searchText = keyword;
    }

    if (query.source === 'sightingTelescope') {
      // 如果是瞄准镜，需要加入queryLabelReq
      param.queryLabelReq = {
        labelName,
        labelDesc,
      };
    }

    if (query.source === 'association') {
      param.searchTypeReq = query.type;
      param.searchText = labelName;
    }

    if (query.source === 'association') {
      if (query.type === 'PRODUCT') {
        param.searchTypeReq = null;
        param.searchText = null;
      }
    }

    if (query.source === 'tag' || query.source === 'sightingTelescope') {
      param.searchTypeReq = null;
      param.searchText = null;
    }

    const filterObj = transfromFilterValFromUrl(query.filters);
    const filterParam = getFilterParam(filterObj);
    const sortParam = getSortParam(query);

    const finalParam = {
      ...param,
      ...filterParam,
      ...sortParam,
    };

    // console.log('.................................................filterObj', finalParam);

    this.setState({
      queryParam: finalParam,
    });

    getCustomerData(finalParam);
  }

  // 获取 客户列表接口的orgId入参的值
  getPostOrgId(query = {}) {
    // 来自非理财平台
    if (query.source === 'external') {
      return this.hasTkMampPermission ? emp.getOrgId() : '';
    }
    /* 来自理财平台首页 */
    // 服务营业部筛选字段departmentOrgId有值且不等于all
    if (query.departmentOrgId) {
      return query.departmentOrgId !== ALL_DEPARTMENT_ID ? query.departmentOrgId : '';
    }
    // 没有 任务管理权限从首页搜索、联想词、热词、潜在业务 或绩效指标的客户范围为 我的客户 下钻到客户列表页
    if (query.orgId) {
      return query.orgId !== MAIN_MAGEGER_ID ? query.orgId : '';
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
    // 来自非理财平台
    if (query.source === 'external') {
      return this.hasTkMampPermission ? '' : emp.getId();
    }
    /* 来自理财平台 */
    // url中存在ptyMng，取id
    if (query.ptyMngId) {
      return query.ptyMngId;
    }
    // 没有 任务管理权限从首页搜索、联想词、热词、潜在业务 或绩效指标的客户范围为 我的客户 下钻到客户列表页
    if (query.orgId === MAIN_MAGEGER_ID) {
      return emp.getId();
    }
    return '';
  }

  // 获取 客户列表接口的custType入参的值
  getPostCustType(query = {}) {
    if (query.departmentOrgId) {
      return query.departmentOrgId === ALL_DEPARTMENT_ID ? CUST_MANAGER : ORG;
    }
    // 首页从客户范围组件中我的客户进入客户列表页面custType=1
    if (query.orgId === MAIN_MAGEGER_ID) {
      return CUST_MANAGER;
    }
    return ORG;
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
    const filterSeperator = '|';
    // 将筛选项组装成
    // type.a|category.b,c,d  形式放到url中
    const { filters = '' } = query;
    const filtersArray = filters ? filters.split(filterSeperator) : [];
    const newFilterArray = [...filtersArray];
    // 手动上传日志
    handleFilter({ name: obj.name, value: obj.value });
    const index = _.findIndex(filtersArray, o => o.split('.')[0] === obj.name);
    if (isDeleteFilterFromLocation) {
      if (index > -1) {
        newFilterArray[index] = '';
      }
    } else {
      const filterItem = `${obj.name}.${obj.value}`;
      if (index > -1) {
        newFilterArray[index] = filterItem;
      } else {
        newFilterArray.push(filterItem);
      }
    }

    const stringifyFilters = newFilterArray.filter(item => item !== '').join(filterSeperator);
    replace({
      pathname,
      query: {
        ...query,
        // [obj.name]: obj.value,
        filters: stringifyFilters,
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
      sightingTelescopeFilters,
      isSendCustsServedByPostn,
      sendCustsServedByPostnResult,
      queryHoldingProduct,
      holdingProducts,
      queryProduct,
      searchedProductList,
      clearProductData,
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
        {/*   <Row type="flex" justify="space-between" align="middle">
            <Col span={12}>
              {
                <CustomerTotal type={source} num={page.total} bname={bname} />
              }
            </Col>
          <Col span={12}>
              <TimeCycle
                source={source}
                {...cycleTimeProps}
              />
            </Col>
        </Row> */}
        <Filter
          sightingTelescopeFilters={sightingTelescopeFilters}
          queryProduct={queryProduct}
          clearProductData={clearProductData}
          searchedProductList={searchedProductList}
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
          hasNPCTIQPermission={this.hasNPCTIQPermission}
          hasPCTIQPermission={this.hasPCTIQPermission}
          queryHoldingProduct={queryHoldingProduct}
          holdingProducts={holdingProducts}
          queryHoldingProductReqState={interfaceState[effects.queryHoldingProduct]}
        />
      </div>
    );
  }
}
