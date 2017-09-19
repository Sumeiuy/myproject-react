/**
 * @file customerPool/CustomerList.js
 *  客户列表
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Row, Col } from 'antd';

// import Icon from '../../components/common/Icon';
import CustRangeForList from '../../components/customerPool/list/CustRangeForList';
import CustomerTotal from '../../components/customerPool/list/CustomerTotal';
import Filter from '../../components/customerPool/list/Filter';
import Reorder from '../../components/customerPool/list/Reorder';
import CustomerLists from '../../components/customerPool/list/CustomerLists';

import styles from './customerlist.less';

const CUST_MANAGER = '1'; // 客户经理
const ORG = '3'; // 组织机构
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const CUR_PAGE = 1; // 默认当前页
const CUR_PAGESIZE = 10; // 默认页大小
const HTSC_RESPID = '1-46IDNZI'; // 首页指标查询
const MAIN_MAGEGER_ID = 'msm'; // 主服务经理
const ENTER_TYPE = {
  search: 'searchCustPool',
  tag: 'searchCustPool',
  association: 'searchCustPool',
  business: 'businessCustPool',
  custIndicator: 'performanceCustPool',
  numOfCustOpened: 'performanceCustPool',
};

const DEFAULT_SORT = { sortType: 'Aset', sortDirection: 'desc' }; // 默认排序方式

const effects = {
  allInfo: 'customerPool/getAllInfo',
  getDictionary: 'customerPool/getDictionary',
  getCustomerList: 'customerPool/getCustomerList',
  getCustIncome: 'customerPool/getCustIncome',
  getCustContact: 'customerPool/getCustContact',
  getServiceRecord: 'customerPool/getServiceRecord',
  getCustomerScope: 'customerPool/getCustomerScope',
  addServeRecord: 'customerPool/addServeRecord',
  getFollowCust: 'customerPool/getFollowCust',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  performanceIndicators: state.customerPool.performanceIndicators, // 绩效指标
  custRange: state.customerPool.custRange, // 客户池用户范围
  empInfo: state.app.empInfo, // 职位信息
  position: state.customerPool.position, // 职责切换
  dict: state.customerPool.dict, // 职责切换
  custList: state.customerPool.custList,
  page: state.customerPool.custPage,
  monthlyProfits: state.customerPool.monthlyProfits, // 6个月收益数据
  custContactData: state.customerPool.custContactData, // 联系方式数据
  serviceRecordData: state.customerPool.serviceRecordData, // 最近服务记录
  cycle: state.customerPool.dict.kPIDateScopeType,  // 统计周期
  addServeRecordSuccess: state.customerPool.addServeRecordSuccess,
  isAddServeRecord: state.customerPool.isAddServeRecord,
  followLoading: state.customerPool.followLoading, // 关注成功
  fllowCustData: state.customerPool.fllowCustData,
  isGetCustIncome: state.customerPool.isGetCustIncome,
});

const mapDispatchToProps = {
  getAllInfo: fetchDataFunction(true, effects.allInfo),
  getCustomerData: fetchDataFunction(true, effects.getCustomerList),
  getCustIncome: fetchDataFunction(false, effects.getCustIncome),
  getCustomerScope: fetchDataFunction(true, effects.getCustomerScope),
  addServeRecord: fetchDataFunction(true, effects.addServeRecord),
  getServiceRecord: fetchDataFunction(true, effects.getServiceRecord),
  getCustContact: fetchDataFunction(true, effects.getCustContact),
  getFollowCust: fetchDataFunction(true, effects.getFollowCust),
  push: routerRedux.push,
  replace: routerRedux.replace,
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
    performanceIndicators: PropTypes.object,
    custRange: PropTypes.array,
    empInfo: PropTypes.object,
    position: PropTypes.object,
    dict: PropTypes.object.isRequired,
    getCustomerData: PropTypes.func.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    getCustContact: PropTypes.func.isRequired,
    getFollowCust: PropTypes.func.isRequired,
    custContactData: PropTypes.object,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object,
    cycle: PropTypes.array,
    // getStatisticalPeriod: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired, // 添加服务记录
    addServeRecordSuccess: PropTypes.bool.isRequired,
    isAddServeRecord: PropTypes.bool.isRequired,
    fllowCustData: PropTypes.object,
    followLoading: PropTypes.bool,
    isGetCustIncome: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    performanceIndicators: {},
    custRange: [],
    position: {},
    empInfo: {},
    custContactData: EMPTY_OBJECT,
    serviceRecordData: EMPTY_OBJECT,
    cycle: EMPTY_LIST,
    fllowCustData: {},
    followLoading: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      expandAll: false,
      queryParam: {},
      createCustRange: [],
      cycleSelect: '',
      // 判断是否是主服务经理或者是否在业务列表中，用来控制列表快捷按钮的显示与否
      isSms: false,
    };
  }

  componentDidMount() {
    const {
      empInfo: { empRespList = EMPTY_LIST },
      location: { query: { source } },
    } = this.props;
    const respIdOfPosition = _.findIndex(empRespList, item => (item.respId === HTSC_RESPID));
    // 判断是否是主服务经理，或者是否在业务客户列表中，是则为true，否则 false
    if (respIdOfPosition < 0 || source === 'business') {
      // debugger
      this.setState({ // eslint-disable-line
        isSms: true,
      });
    }
    // 生成组织机构树
    this.generateCustRange(this.props);
    // 请求客户列表
    this.getCustomerList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      custRange: preCustRange,
      location: {
        query: preQuery,
      },
      empInfo: { empRespList: PreEmpRespList },
      position: { orgId: preOrgId },
    } = this.props;
    const {
      custRange,
      location: {
        query,
      },
      empInfo: { empRespList },
      position: { orgId },
    } = nextProps;
    // 组织机构树数据变化和职位切换重新生成组织机构树组件的数据
    if (!_.isEqual(preCustRange, custRange) || orgId !== preOrgId) {
      this.generateCustRange(nextProps);
    }
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
    if (!_.isEqual(preOtherQuery, otherQuery) ||
      !_.isEqual(PreEmpRespList, empRespList) ||
      orgId !== preOrgId) {
      this.getCustomerList(nextProps);
    }
    // const noPermission = _.find(empRespList, item => item.id === )
    // console.log('query.orgId----query.source', query.orgId, query.source);
    // debugger
    if (query.orgId === MAIN_MAGEGER_ID || query.source === 'business') {
      this.setState({
        isSms: true,
      });
    }
  }

  // 获取列表数据
  @autobind
  getCustomerList(props) {
    const {
      cycle = [],
      position: { orgId: posOrgId },
      getCustomerData, location: { query },
      empInfo: { empInfo = EMPTY_OBJECT, empRespList = EMPTY_LIST },
    } = props;
    const {
      position: { orgId: thisPropsPosOrgId },
    } = this.props;
    const { occDivnNum = '' } = empInfo;
    const occ = _.isEmpty(occDivnNum) ? '' : occDivnNum;// orgId取不到的情况下去用户信息中的
    // const orgId = _.isEmpty(window.forReactPosition)
    //   ?
    //   occ
    //   : window.forReactPosition.orgId;
    const orgId = posOrgId || occ;
    let respIdOfPosition;
    if (!_.isEmpty(empRespList)) {
      respIdOfPosition = _.findIndex(empRespList, item => (item.respId === HTSC_RESPID));
    }
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
      if (query.cycleSelect) {
        param.dateType = query.cycleSelect;
      } else {
        param.dateType = (cycle[0] || {}).key;
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
    // 业务进来的时候，默认 我的客户 ，不带orgId
    // 我的客户 和 没有权限时，custType=1,其余情况custType=3
    if (query.source !== 'business') {
      // 职位切换
      if (thisPropsPosOrgId !== posOrgId) {
        param.orgId = posOrgId;
        param.custType = ORG;
      } else if (respIdOfPosition > 0 && query.orgId) {   // 有权限时切换组织机构树
        if (MAIN_MAGEGER_ID !== query.orgId) { // 切换到非我的客户，传选中的orgId
          param.orgId = query.orgId;
          param.custType = ORG;
        } else {
          param.custType = CUST_MANAGER; // 切换到我的客户
        }
      } else if (respIdOfPosition > 0 && orgId) { // 第一次进入时，且有权限，传默认的职位orgId
        param.orgId = orgId;
        param.custType = ORG;
      } else if (respIdOfPosition < 0) { // 没有权限
        param.custType = CUST_MANAGER;
      }
    }
    // 过滤数组
    const filtersReq = [];
    // 排序条件
    const sortsReqList = [];
    if (query.unright_type) {
      filtersReq.push({
        filterType: 'unright_type',
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

  // 生成组织机构树的数据
  @autobind
  generateCustRange(props) {
    const {
      custRange,
      empInfo: {
        empInfo = EMPTY_OBJECT,
        empRespList = EMPTY_LIST,
      },
      position: { orgId: posOrgId },
    } = props;
    // 判断是否存在首页绩效指标查看权限
    const respIdOfPosition = _.findIndex(empRespList, item => (item.respId === HTSC_RESPID));
    const myCustomer = {
      id: MAIN_MAGEGER_ID,
      name: '我的客户',
    };
    // 无‘HTSC 首页指标查询’职责的普通用户，取值 '我的客户'
    if (respIdOfPosition < 0) {
      this.setState({
        createCustRange: [myCustomer],
      });
      return false;
    }
    // 保证全局的职位存在的情况下取职位, 取不到时从empInfo中取值
    const occDivnNum = empInfo.occDivnNum || '';
    // let fspJobOrgId = 'ZZ001041020';
    // let fspJobOrgId = !_.isEmpty(window.forReactPosition) ?
    //   window.forReactPosition.orgId :
    //   occDivnNum;
    // if (posOrgId) {
    //   fspJobOrgId = posOrgId;
    // }
    const fspJobOrgId = posOrgId || occDivnNum;
    // 用户职位是经总
    if (fspJobOrgId === (custRange[0] || {}).id) {
      this.setState({
        createCustRange: custRange,
        expandAll: true,
      });
      return false;
    }
    // fspJobOrgId 在机构树中所处的分公司位置
    const groupInCustRange = _.find(custRange, item => item.id === fspJobOrgId);
    if (groupInCustRange) {
      this.setState({
        createCustRange: [groupInCustRange, myCustomer],
        expandAll: true,
      });
      return false;
    }
    // fspJobOrgId 在机构树中所处的营业部位置
    let department;
    _(custRange).forEach((obj) => {
      if (obj.children && !_.isEmpty(obj.children)) {
        const targetValue = _.find(obj.children, o => o.id === fspJobOrgId);
        if (targetValue) {
          department = [targetValue, myCustomer];
        }
      }
    });
    if (department) {
      this.setState({
        createCustRange: department,
      });
      return false;
    }
    // 有权限，但是用户信息中获取到的occDivnNum不在empOrg（组织机构树）中，显示用户信息中的数据
    this.setState({
      createCustRange: [{
        id: empInfo.occDivnNum,
        name: empInfo.occupation,
      }],
    });
    return false;
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
    const { cycleSelect, orgId } = state;
    replace({
      pathname,
      query: {
        ...query,
        orgId,
        cycleSelect,
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
    } = this.props;
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
    const { replace, location: { query, pathname } } = this.props;
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
    console.log('current, size:', current, size);
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
      getFollowCust,
      custContactData,
      serviceRecordData,
      cycle,
      empInfo: { empInfo },
      addServeRecord,
      addServeRecordSuccess,
      isAddServeRecord,
      followLoading,
      fllowCustData,
      isGetCustIncome,
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
    let reorderValue = { sortType: 'Aset', sortDirection: 'desc' };
    if (sortType && sortDirection) {
      reorderValue = { sortType, sortDirection };
    }
    const { expandAll, createCustRange, queryParam, isSms } = this.state;
    const custRangeProps = {
      orgId,
      location,
      replace,
      source,
      createCustRange,
      updateQueryState: this.updateQueryState,
      expandAll,
    };
    if (_.includes(['custIndicator', 'numOfCustOpened'], source)) {
      const selectValue = cycleSelect || (cycle[0] || {}).key;
      custRangeProps.cycle = cycle;
      custRangeProps.selectValue = selectValue;
    }
    // console.log('6个月收益数据： ', monthlyProfits);
    // console.log('createCustRange>>>', isSms);
    return (
      <div className={styles.customerlist}>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={12}>
            {
              <CustomerTotal type={source} num={page.total} bname={bname} />
            }
          </Col>
          <Col span={12}>
            <CustRangeForList
              {...custRangeProps}
            />
          </Col>
        </Row>
        <Filter
          dict={dict}
          location={location}
          onFilterChange={this.filterChange}
        />
        <Reorder
          value={reorderValue}
          onChange={this.orderChange}
        />
        <CustomerLists
          isSms={isSms}
          dict={dict}
          condition={queryParam}
          custRange={createCustRange}
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
          isGetCustIncome={isGetCustIncome}
          onPageChange={this.handlePageChange}
          onSizeChange={this.handleSizeChange}
          getCustIncome={getCustIncome}
          getCustContact={getCustContact}
          getServiceRecord={getServiceRecord}
          getFollowCust={getFollowCust}
          custContactData={custContactData}
          serviceRecordData={serviceRecordData}
          empInfo={empInfo}
          addServeRecord={addServeRecord}
          addServeRecordSuccess={addServeRecordSuccess}
          isAddServeRecord={isAddServeRecord}
          fllowCustData={fllowCustData}
          followLoading={followLoading}
        />
      </div>
    );
  }
}
