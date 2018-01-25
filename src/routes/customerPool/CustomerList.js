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
import { fspContainer } from '../../config';
import withRouter from '../../decorators/withRouter';
import permissionType from './permissionType';
import {
  NOPERMIT,
  CUST_MANAGER,
  ORG,
  ENTER_TYPE,
} from './config';

import styles from './customerlist.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const CUR_PAGE = 1; // 默认当前页
const CUR_PAGESIZE = 10; // 默认页大小

const DEFAULT_SORT = { sortType: 'Aset', sortDirection: 'desc' }; // 默认排序方式

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
  isCustServedByPostn: 'customerPool/isCustServedByPostn',
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
  // 是否包含非本人名下客户
  custServedByPostnResult: state.customerPool.custServedByPostnResult,
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
  getSearchServerPersonList: fetchDataFunction(false, effects.getSearchServerPersonList),
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
  // 查询是否包含本人名下客户
  isCustServedByPostn: fetchDataFunction(true, effects.isCustServedByPostn),
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
    serviceDepartment: PropTypes.array.isRequired,
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
    isCustServedByPostn: PropTypes.func.isRequired,
    custServedByPostnResult: PropTypes.bool.isRequired,
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
    this.permissionType = permissionType().customerPoolPermit;
    this.view360Permit = permissionType().view360Permit;
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
    // 请求客户列表
    this.getCustomerList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      // custRange: preCustRange,
      location: {
        query: preQuery,
      },
      isContactLoading = false,
      isRecordLoading = false,
    } = this.props;
    const {
      // custRange,
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
      empInfo: { empInfo = EMPTY_OBJECT },
    } = props;
    const { occDivnNum = '', empNum } = empInfo;
    const keyword = decodeURIComponent(query.q);
    const param = {
      // 必传，当前页
      curPageNum: query.curPageNum || CUR_PAGE,
      // 必传，页大小
      pageSize: query.pageSize || CUR_PAGESIZE,
      // 不同的入口进入列表页面
      enterType: ENTER_TYPE[query.source],
    };
    // 从热词列表搜索 :FromWdsListErea, 从联想下拉框搜索: FromAssociatedErea, 匹配的全字符: FromFullTextType
    if (query.source === 'search') {
      param.searchTypeReq = 'FromFullTextType';
      param.paramsReqList = [
        { key: 'fullTestSearch', value: keyword },
      ];
    } else if (query.source === 'tag') { // 热词
      param.searchTypeReq = 'FromWdsListErea';
      param.paramsReqList = [
        { key: query.labelMapping, value: query.tagNumId },
      ];
    } else if (query.source === 'association') {
      param.searchTypeReq = 'FromAssociatedErea';
      param.paramsReqList = [
        { key: query.labelMapping, value: query.tagNumId },
      ];
    } else if (_.includes(['custIndicator', 'numOfCustOpened'], query.source)) {
      // 业绩中的时间周期
      param.dateType = query.cycleSelect || (cycle[0] || {}).key;
      // 我的客户 和 没有权限时，custType=1,其余情况custType=3
      param.custType = CUST_MANAGER;
      if (query.ptyMng && query.ptyMng.split('_')[1] === empNum) {
        param.custType = CUST_MANAGER;
      } else if (this.permissionType !== NOPERMIT) {
        param.custType = ORG;
      }
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
    // orgId默认取岗位对应的orgId，服务营业部选 '所有' 不传，其余情况取对应的orgId
    if (query.orgId && query.orgId !== 'all') {
      param.orgId = query.orgId;
    } else if (!query.orgId && this.permissionType !== NOPERMIT) {
      // 有权限，第一次进入列表页传所处岗位对应orgId
      // 在fsp外壳中取岗位切换的id， 本地取empinfo中的occDivnNum
      if (document.querySelector(fspContainer.container)) {
        param.orgId = window.forReactPosition.orgId;
      } else {
        param.orgId = occDivnNum;
      }
    }
    // 服务经理ptyMngId
    if (this.permissionType === NOPERMIT) {
      param.ptyMngId = empNum;
    }
    if (query.ptyMng) {
      param.ptyMngId = query.ptyMng.split('_')[1];
    }
    // 过滤数组
    const filtersReq = [];
    // 排序条件
    const sortsReqList = [];
    if (query.unright_type) {
      filtersReq.push({
        filterType: 'Unrights',
        filterContentList: query.unright_type.split(','),
      });
    }
    if (query.Rights) {
      filtersReq.push({
        filterType: 'Rights',
        filterContentList: query.Rights.split(','),
      });
    }
    if (query.RiskLvl) {
      filtersReq.push({
        filterType: 'RiskLvl',
        filterContentList: [query.RiskLvl],
      });
    }
    if (query.CustClass) {
      filtersReq.push({
        filterType: 'CustClass',
        filterContentList: [query.CustClass],
      });
    }
    if (query.CustomType) {
      filtersReq.push({
        filterType: 'CustomType',
        filterContentList: [query.CustomType],
      });
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
    // 手动上传日志
    handleFilter({ name: obj.name, value: obj.value });

    replace({
      pathname,
      query: {
        ...query,
        [obj.name]: obj.value,
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
    console.log('page, pageSize:', page, pageSize);
    replace({
      pathname,
      query: {
        ...query,
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
      isCustServedByPostn,
      custServedByPostnResult,
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
              <CustomerTotal type={source} num={page.total} bname={bname} />
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
          source={source}
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
          permissionType={this.permissionType}
          view360Permit={this.view360Permit}
          custServedByPostnResult={custServedByPostnResult}
          isCustServedByPostn={isCustServedByPostn}
        />
      </div>
    );
  }
}
