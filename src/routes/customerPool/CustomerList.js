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
const MAIN_MAGEGER_ID = 'msm';
const ENTER_TYPE = {
  search: 'searchCustPool',
  tag: 'searchCustPool',
  association: 'searchCustPool',
  business: 'businessCustPool',
};

const DEFAULT_SORT = { sortType: 'Aset', sortDirection: 'desc' }; // 默认排序方式

const effects = {
  allInfo: 'customerPool/getAllInfo',
  getDictionary: 'customerPool/getDictionary',
  getCustomerList: 'customerPool/getCustomerList',
  getCustIncome: 'customerPool/getCustIncome',
};

const fectchDataFunction = (globalLoading, type) => query => ({
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
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getCustomerData: fectchDataFunction(true, effects.getCustomerList),
  getCustIncome: fectchDataFunction(true, effects.getCustIncome),
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
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerList extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getAllInfo: PropTypes.func.isRequired,
    performanceIndicators: PropTypes.object,
    collectCustRange: PropTypes.func.isRequired,
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
  }

  static defaultProps = {
    collectCustRange: () => { },
    performanceIndicators: {},
    custRange: [],
    position: {},
    empInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      orgId: '',
      fspOrgId: '',
      createCustRange: [],
      expandAll: false,
      queryParam: {},
    };
  }

  componentDidMount() {
    const { custRange } = this.props;
    if (custRange.length > 0) {
      this.handleSetCustRange(this.props);
    }
    this.getCustomerList(this.props);
    // saveIsAllSelect(false);
    // saveSelectedIds(EMPTY_LIST);
  }

  componentWillReceiveProps(nextProps) {
    // debugger
    const { location: preLocation,
      position: prePosition,
      custRange: preCustRange } = this.props;
    const { location: nextLocation,
      position: nextPosition,
      custRange: nextCustRange } = nextProps;
    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;
    if (preOrgId !== nextOrgId) {
      this.setState({
        fspOrgId: nextOrgId,
        createCustRange: this.handleCreateCustRange(nextOrgId, nextProps),
      }, this.getCustomerList(nextProps));
    }
    if (!_.isEqual(preCustRange, nextCustRange) || preLocation !== nextLocation) {
      this.handleSetCustRange(nextProps);
      // this.setState({
      //   createCustRange: this.handleCreateCustRange(null, nextProps),
      // });
    }
    if (!_.isEqual(preLocation.query, nextLocation.query)) {
      this.getCustomerList(nextProps);
    }
  }

  @autobind
  getCustomerList(props) {
    const { getCustomerData, location: { query },
    empInfo: { empInfo = EMPTY_OBJECT, empRespList = EMPTY_LIST } } = props;
    const { occDivnNum = '' } = empInfo;
    const occ = _.isEmpty(occDivnNum) ? '' : occDivnNum;// orgId取不到的情况下去用户信息中的
    const orgId = _.isEmpty(window.forReactPosition)
      ?
      occ
      : window.forReactPosition.orgId;
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
      // param.fullTestSearch = k;
    }
    if (respIdOfPosition > 0 && query.orgId) {   // 客户经理机构号
      if (MAIN_MAGEGER_ID !== query.orgId) {
        param.orgId = query.orgId;
      }
    } else if (respIdOfPosition > 0 && orgId) {
      param.orgId = orgId;
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

  @autobind
  handleSetCustRange(props) {
    const { custRange,
    empInfo: { empInfo = EMPTY_OBJECT, empRespList = EMPTY_LIST } } = props;
    const { occDivnNum = '' } = empInfo;
    const occ = _.isEmpty(occDivnNum) ? '' : occDivnNum;// orgId取不到的情况下去用户信息中的
    const fspOrgid = _.isEmpty(window.forReactPosition) ? occ : window.forReactPosition.orgId;
    // const orgid = _.isEmpty(orgId) // window.forReactPosition
    //   ?
    //   fspOrgid
    //   : orgId;
    const respIdOfPosition = _.findIndex(empRespList, item => (item.respId === HTSC_RESPID));
    this.setState({
      fspOrgId: respIdOfPosition < 0 ? '' : fspOrgid,
      orgId: respIdOfPosition < 0 ? '' : fspOrgid, // 组织ID
    }, () => {
      if (custRange.length > 0) {
        this.handleGetAllInfo(custRange);
      }
    });
  }

  @autobind
  handleGetAllInfo(custRangeData) {
    const { fspOrgId } = this.state;
    let custType = ORG;
    const orgsId = custRangeData.length > 0 ? custRangeData[0].id : '';
    this.setState({
      createCustRange: this.handleCreateCustRange(fspOrgId, this.props),
    });
    if (fspOrgId === orgsId) { // 判断客户范围类型
      custType = ORG;
    } else {
      this.setState({
        expandAll: true,
      });
      custType = CUST_MANAGER;
    }
    console.log('custType', custType);
  }

  @autobind
  handleCreateCustRange(orgId, nextProps) {
    const { empInfo, custRange } = nextProps;
    const { empPostnList = EMPTY_LIST,
      empRespList = EMPTY_LIST } = empInfo; // 1-46IDNZI HTSC_RESPID
    const { fspOrgId } = this.state;
    let orgNewCustRange = [];
    const newCustRrange = [];
    const myCustomer = {
      id: MAIN_MAGEGER_ID,
      name: '我的客户',
    };
    const respIdOfPosition = _.findIndex(empRespList, item => item.respId === HTSC_RESPID);
    if (respIdOfPosition < 0) {
      newCustRrange.push(myCustomer);
      return newCustRrange;
    }
    let newOrgId = fspOrgId;
    if (!_.isEmpty(orgId)) {
      newOrgId = orgId;
    }
    if (custRange.length < 1) {
      return null;
    }
    if (newOrgId === custRange[0].id) {
      return custRange;
    }
    this.setState({
      expandAll: true,
    });
    orgNewCustRange = _.findIndex(custRange, item => item.id === newOrgId);
    let newData;
    if (orgNewCustRange > -1) { // 总机构内
      newData = custRange[orgNewCustRange];
      newCustRrange.push(newData);
    } else { // 职位中去查找
      orgNewCustRange = _.findIndex(empPostnList, item => item.orgId === newOrgId);
      if (orgNewCustRange > -1) {
        const org = {
          id: empPostnList[orgNewCustRange].orgId,
          name: empPostnList[orgNewCustRange].orgName,
        };
        newData = org;
        newCustRrange.push(newData);
      }
    }
    newCustRrange.push(myCustomer);
    return newCustRrange;
  }

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(state) {
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    const {
      saveIsAllSelect,
      saveSelectedIds,
      selectedIds,
      isAllSelect,
      replace,
      location: { query, pathname },
    } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        orgId: state.orgId,
        curPageNum: 1,
      },
    });
    // 筛选时清空已选中的数据、还原全选的状态
    saveIsAllSelect({ ...isAllSelect, [query.source]: false });
    saveSelectedIds({
      ...selectedIds,
      [query.source]: EMPTY_LIST,
    });
    this.setState({
      ...state,
    });
  }

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
      collectCustRange,
      dict,
      custList,
      page,
      monthlyProfits,
      getCustIncome,
      selectedIds,
      isAllSelect,
      saveIsAllSelect,
      saveSelectedIds,
    } = this.props;
    const {
      sortDirection,
      sortType,
      // orgId,
      source,
      pageSize,
      curPageNum,
      q,
    } = location.query;
    // 排序的默认值 ： 总资产降序
    let reorderValue = { sortType: 'Aset', sortDirection: 'desc' };
    if (sortType && sortDirection) {
      reorderValue = { sortType, sortDirection };
    }
    const { expandAll, createCustRange, queryParam } = this.state;
    // console.log('6个月收益数据： ', monthlyProfits);
    console.log('createCustRange>>>', createCustRange);
    return (
      <div className={styles.customerlist}>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={12}>
            {
              <CustomerTotal type={source} num={page.total} />
            }
          </Col>
          <Col span={12}>
            <CustRangeForList
              location={location}
              replace={replace}
              source={source}
              createCustRange={createCustRange}
              updateQueryState={this.updateQueryState}
              collectCustRange={collectCustRange}
              expandAll={expandAll}
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
        />
      </div>
    );
  }
}
