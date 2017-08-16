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
import CustRangeForList from '../../components/customerPool/CustRangeForList';
import CustomerTotal from '../../components/customerPool/CustomerTotal';
import Filter from '../../components/customerPool/Filter';
import Reorder from '../../components/customerPool/Reorder';
import CustomerLists from '../../components/customerPool/CustomerLists';

import styles from './customerlist.less';

const CUST_MANAGER = 1; // 客户经理
const ORG = 3; // 组织机构

const CUR_PAGE = 1; // 默认当前页
const CUR_PAGESIZE = 10; // 默认页大小

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
  empInfo: state.customerPool.empInfo, // 职位信息
  position: state.customerPool.position, // 职责切换
  dict: state.customerPool.dict, // 职责切换
  custList: state.customerPool.custList,
  page: state.customerPool.custPage,
  monthlyProfits: state.customerPool.monthlyProfits, // 6个月收益数据
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getCustomerData: fectchDataFunction(true, effects.getCustomerList),
  getCustIncome: fectchDataFunction(true, effects.getCustIncome),
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
    getAllInfo: PropTypes.func.isRequired,
    performanceIndicators: PropTypes.object,
    collectCustRange: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    cycle: PropTypes.array,
    empInfo: PropTypes.object,
    position: PropTypes.object,
    dict: PropTypes.object.isRequired,
    getCustomerData: PropTypes.func.isRequired,
    getCustIncome: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
    monthlyProfits: PropTypes.array.isRequired,
  }

  static defaultProps = {
    collectCustRange: () => { },
    performanceIndicators: {},
    custRange: [],
    position: {},
    cycle: [],
    empInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      orgId: '',
      fspOrgId: '',
      createCustRange: [],
      expandAll: false,
    };
  }

  componentWillMount() {
    const { custRange, location: { query } } = this.props;
    const orgid = _.isEmpty(window.forReactPosition) ? '' : window.forReactPosition.orgId;

    this.setState({
      fspOrgId: orgid,
      orgId: orgid, // 组织ID
    }, () => {
      if (custRange.length > 0) {
        this.handleGetAllInfo(custRange);
      }
    });
    this.getCustomerList(query);
    // getCustIncome({ custNumber: '020100053538' });
  }

  componentWillReceiveProps(nextProps) {
    const { location: preLocation,
      position: prePosition, custRange: preCustRange, cycle: preCycle } = this.props;
    const { location: nextLocation,
      position: nextPosition, custRange: nextCustRange, cycle: nextCycle } = nextProps;
    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;
    if (preOrgId !== nextOrgId) {
      this.setState({
        fspOrgId: nextOrgId,
        createCustRange: this.handleCreateCustRange(nextOrgId, nextProps),
      }, this.getCustomerList);
    }
    if (!_.isEqual(preCycle, nextCycle)) {
      this.setState({
        cycleSelect: nextCycle[0].key,
      });
    }
    if (!_.isEqual(preCustRange, nextCustRange) || preLocation !== nextLocation) {
      this.handleGetAllInfo(nextCustRange);
      this.setState({
        createCustRange: this.handleCreateCustRange(null, nextProps),
      });
    }
    if (!_.isEqual(preLocation.query, nextLocation.query)) {
      this.getCustomerList(nextLocation.query);
    }
  }

  @autobind
  getCustomerList(query) {
    const { getCustomerData } = this.props;
    const orgId = _.isEmpty(window.forReactPosition) ? '' : window.forReactPosition.orgId;
    const k = decodeURIComponent(query.q);
    const param = {
      // 必传，当前页
      curPageNum: query.curPageNum || CUR_PAGE,
      // 必传，页大小
      pageSize: query.pageSize || CUR_PAGESIZE,
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
    if (orgId) {   // 客户经理机构号
      param.orgId = orgId;
    }
    // 过滤数组
    const filtersReq = [];
    // 排序条件
    const sortsReqList = [];
    if (query.Rights) {
      filtersReq.push({
        filterType: 'Rights',
        filterContentList: [query.Rights],
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
    }
    if (!_.isEmpty(filtersReq)) {
      param.filtersReq = filtersReq;
    }
    if (!_.isEmpty(sortsReqList)) {
      param.sortsReqList = sortsReqList;
    }
    getCustomerData(param);
  }

  @autobind
  handleGetAllInfo(custRangeData) {
    const { cycle } = this.props;
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
    this.setState({
      cycleSelect: cycle.length > 0 ? cycle[0].key : '',
    });
    console.log('custType', custType);
  }

  @autobind
  handleCreateCustRange(orgId, nextProps) {
    const { empInfo, custRange } = nextProps;
    const { empPostnList } = empInfo;
    const { fspOrgId } = this.state;
    let newOrgId = fspOrgId;
    if (!_.isEmpty(orgId)) {
      newOrgId = orgId;
    }
    let orgNewCustRange = [];
    const newCustRrange = [];
    if (custRange.length < 1) {
      return null;
    }
    if (newOrgId === custRange[0].id) {
      return custRange;
    }
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
    const myCustomer = {
      id: '',
      name: '我的客户',
    };
    newCustRrange.push(myCustomer);
    return newCustRrange;
  }

  // 此方法用来修改Duration 和 Org数据
  @autobind
  updateQueryState(state) {
    // 切换Duration和Orig时候，需要将数据全部恢复到默认值
    const { replace, location: { query, pathname } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        orgId: state.orgId,
      },
    });
    this.setState({
      ...state,
    }, () => {
      this.getCustomerList();
    });
    console.log('update>>>>', state);
  }

  @autobind
  filterChange(obj) {
    const { replace, location: { query, pathname } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [obj.name]: obj.value,
      },
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
      location,
      replace,
      collectCustRange,
      dict,
      custList,
      page,
      monthlyProfits,
      getCustIncome,
    } = this.props;
    const {
      CustomType,
      CustClass,
      RiskLvl,
      Rights,
      sortDirection,
      sortType,
      orgId,
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
    const { expandAll, createCustRange } = this.state;
    console.log('6个月收益数据： ', monthlyProfits);
    console.log('cust>>>', custList);    // console.log('createCustRange>>>', createCustRange);
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
              orgId={orgId}
              createCustRange={createCustRange}
              updateQueryState={this.updateQueryState}
              collectCustRange={collectCustRange}
              expandAll={expandAll}
            />
          </Col>
        </Row>
        {
          (_.includes(['search', 'tag', 'association', 'business'], source)) ?
            <div className="filter">
              <Filter
                value={CustomType || ''}
                filterLabel="客户性质"
                filter="CustomType"
                filterField={dict.custNature}
                onChange={this.filterChange}
              />
              <Filter
                value={CustClass || ''}
                filterLabel="客户类型"
                filter="CustClass"
                filterField={dict.custType}
                onChange={this.filterChange}
              />
              <Filter
                value={RiskLvl || ''}
                filterLabel="风险等级"
                filter="RiskLvl"
                filterField={dict.custRiskBearing}
                onChange={this.filterChange}
              />
              <Filter
                value={Rights || ''}
                filterLabel="已开通业务"
                filter="Rights"
                filterField={dict.custBusinessType}
                onChange={this.filterChange}
              />
            </div> : null
        }
        <Reorder
          value={reorderValue}
          onChange={this.orderChange}
        />
        <CustomerLists
          custList={custList}
          q={decodeURIComponent(q)}
          page={page}
          curPageNum={curPageNum}
          pageSize={pageSize}
          monthlyProfits={monthlyProfits}
          onPageChange={this.handlePageChange}
          onSizeChange={this.handleSizeChange}
          getCustIncome={getCustIncome}
        />
      </div>
    );
  }
}
