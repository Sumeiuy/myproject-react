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

const CUST_MANAGER = 1; // 客户经理
const ORG = 3; // 组织机构
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
  isAllSelect: state.customerPool.isAllSelect, // 是否全选
  selectedIds: state.customerPool.selectedIds, // 非全选时选中的id数组
  custContactData: state.customerPool.custContactData, // 联系方式数据
  serviceRecordData: state.customerPool.serviceRecordData, // 最近服务记录
  cycle: state.customerPool.cycle,  // 统计周期
  addServeRecordSuccess: state.customerPool.addServeRecordSuccess,
  isAddServeRecord: state.customerPool.isAddServeRecord,
});

const mapDispatchToProps = {
  getAllInfo: fetchDataFunction(true, effects.allInfo),
  getCustomerData: fetchDataFunction(true, effects.getCustomerList),
  getCustIncome: fetchDataFunction(true, effects.getCustIncome),
  getCustomerScope: fetchDataFunction(true, effects.getCustomerScope),
  addServeRecord: fetchDataFunction(true, effects.addServeRecord),
  getServiceRecord: fetchDataFunction(true, effects.getServiceRecord),
  getCustContact: fetchDataFunction(true, effects.getCustContact),
  push: routerRedux.push,
  replace: routerRedux.replace,
  saveIsAllSelect: query => ({
    type: 'customerPool/saveIsAllSelect',
    payload: query || {},
  }),
  saveSelectedIds: query => ({
    type: 'customerPool/saveSelectedIds',
    payload: query || {},
  }),
  // getStatisticalPeriod: query => ({
  //   type: 'customerPool/getStatisticalPeriod',
  //   payload: query || {},
  // }),
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
    monthlyProfits: PropTypes.array.isRequired,
    isAllSelect: PropTypes.object.isRequired,
    selectedIds: PropTypes.object.isRequired,
    saveIsAllSelect: PropTypes.func.isRequired,
    saveSelectedIds: PropTypes.func.isRequired,
    getCustContact: PropTypes.func.isRequired,
    custContactData: PropTypes.object,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.array,
    cycle: PropTypes.array,
    // getStatisticalPeriod: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired, // 添加服务记录
    addServeRecordSuccess: PropTypes.bool.isRequired,
    isAddServeRecord: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    performanceIndicators: {},
    custRange: [],
    position: {},
    empInfo: {},
    custContactData: EMPTY_OBJECT,
    serviceRecordData: EMPTY_LIST,
    cycle: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      expandAll: false,
      queryParam: {},
      createCustRange: [],
      cycleSelect: '',
    };
  }

  componentDidMount() {
    // const {
    //   getCustomerScope,
    //   getStatisticalPeriod,
    //   location: { query },
    // } = this.props;
    // 请求组织机构树
    // getCustomerScope();
    // 生成组织机构树
    this.generateCustRange(this.props);
    // 请求客户列表
    this.getCustomerList(this.props);
    // 业绩客户列表时请求时间周期
    // if (_.includes(['custIndicator', 'numOfCustOpened'], query.source)) {
    //   getStatisticalPeriod();
    // }
    // saveIsAllSelect(false);
    // saveSelectedIds(EMPTY_LIST);
  }

  componentWillReceiveProps(nextProps) {
    const {
      custRange: preCustRange,
      location: {
        query: preQuery,
      },
      empInfo: { empRespList: PreEmpRespList },
      position: { orgId: preOrgId },
      // cycle: preCycle,
    } = this.props;
    const {
      // getStatisticalPeriod,
      custRange,
      location: {
        query,
      },
      empInfo: { empRespList },
      position: { orgId },
      // cycle,
    } = nextProps;
    // 组织机构树数据变化和职位切换重新生成组织机构树组件的数据
    if (!_.isEqual(preCustRange, custRange) || orgId !== preOrgId) {
      this.generateCustRange(nextProps);
    }
    // query变化、权限列表存在变化和职位切换时，重新获取列表数据
    if (!_.isEqual(preQuery, query) ||
      !_.isEqual(PreEmpRespList, empRespList) ||
      orgId !== preOrgId) {
      this.getCustomerList(nextProps);
    }
    // if (_.includes(['custIndicator', 'numOfCustOpened'], query.source) &&
    // !_.isEqual(preCycle, cycle)) {
    //   getStatisticalPeriod();
    // }
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
    const orgId = _.isEmpty(window.forReactPosition)
      ?
      occ
      : window.forReactPosition.orgId;
    if (_.isEmpty(empRespList)) {
      return;
    }
    const respIdOfPosition = _.findIndex(empRespList, item => (item.respId === HTSC_RESPID));
    const k = decodeURIComponent(query.q);
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
        { key: 'fullTestSearch', value: k },
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
    // const fspJobOrgId = 'ZZ001041020';
    let fspJobOrgId = !_.isEmpty(window.forReactPosition) ?
      window.forReactPosition.orgId :
      occDivnNum;
    if (posOrgId) {
      fspJobOrgId = posOrgId;
    }
    // 用户职位是经总
    if (fspJobOrgId === (custRange[0] || {}).id) {
      this.setState({
        createCustRange: custRange,
        expandAll: true,
      });
      return false;
    }
    // fspJobOrgId 在机构树中所处的分公司位置
    const orgIdIndexInCustRange = _.findIndex(custRange, item => item.id === fspJobOrgId);
    if (orgIdIndexInCustRange > -1) {
      this.setState({
        createCustRange: [custRange[orgIdIndexInCustRange], myCustomer],
        expandAll: true,
      });
      return false;
    }
    // fspJobOrgId 在机构树中所处的营业部位置
    _(custRange).forEach((obj) => {
      if (obj.children && !_.isEmpty(obj.children)) {
        const tmpArr = _.filter(obj.children, v => v.id === fspJobOrgId);
        if (!_.isEmpty(tmpArr)) {
          this.setState({
            createCustRange: [...tmpArr, myCustomer],
          });
          return false;
        }
      }
      return true;
    });
    return false;
  }

  // 组织机构树切换和时间周期切换
  @autobind
  updateQueryState(state) {
    console.log('updateQueryState: ', state);
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    const {
      saveIsAllSelect,
      saveSelectedIds,
      selectedIds,
      isAllSelect,
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
      },
    });
    // 筛选时清空已选中的数据、还原全选的状态
    saveIsAllSelect({ ...isAllSelect, [query.source]: false });
    saveSelectedIds({
      ...selectedIds,
      [query.source]: EMPTY_LIST,
    });
  }

  // 筛选变化
  @autobind
  filterChange(obj) {
    const {
      saveIsAllSelect,
      saveSelectedIds,
      isAllSelect,
      selectedIds,
      replace,
      location: { query, pathname },
    } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [obj.name]: obj.value,
        curPageNum: 1,
      },
    });
    // 筛选时清空已选中的数据、还原全选的状态
    saveIsAllSelect({ ...isAllSelect, [query.source]: false });
    saveSelectedIds({
      ...selectedIds,
      [query.source]: EMPTY_LIST,
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
      selectedIds,
      isAllSelect,
      saveIsAllSelect,
      saveSelectedIds,
      getCustContact,
      getServiceRecord,
      custContactData,
      serviceRecordData,
      cycle,
      empInfo: { empInfo },
      addServeRecord,
      addServeRecordSuccess,
      isAddServeRecord,
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
    const { expandAll, createCustRange, queryParam } = this.state;
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
    console.log('createCustRange>>>', createCustRange);
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
          dict={dict}
          condition={queryParam}
          custRange={createCustRange}
          source={source}
          entertype={ENTER_TYPE[source]}
          location={location}
          push={push}
          custList={custList}
          q={decodeURIComponent(q)}
          page={page}
          curPageNum={curPageNum}
          pageSize={pageSize}
          monthlyProfits={monthlyProfits}
          onPageChange={this.handlePageChange}
          onSizeChange={this.handleSizeChange}
          getCustIncome={getCustIncome}
          saveSelectedIds={saveSelectedIds}
          saveIsAllSelect={saveIsAllSelect}
          isAllSelect={isAllSelect}
          selectedIds={selectedIds}
          getCustContact={getCustContact}
          getServiceRecord={getServiceRecord}
          custContactData={custContactData}
          serviceRecordData={serviceRecordData}
          empInfo={empInfo}
          addServeRecord={addServeRecord}
          addServeRecordSuccess={addServeRecordSuccess}
          isAddServeRecord={isAddServeRecord}
        />
      </div>
    );
  }
}
