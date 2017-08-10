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

import Icon from '../../components/common/Icon';
import CustRange from '../../components/customerPool/CustRange';
import CustomerTotal from '../../components/customerPool/CustomerTotal';
import Filter from '../../components/customerPool/Filter';
import Reorder from '../../components/customerPool/Reorder';

import styles from './customerlist.less';

const CUST_MANAGER = 1; // 客户经理
const ORG = 3; // 组织机构

const effects = {
  allInfo: 'customerPool/getAllInfo',
  getDictionary: 'customerPool/getDictionary',
  getCustomerList: 'customerPool/getCustomerList',
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
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  getCustomerList: fectchDataFunction(true, effects.getCustomerList),
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
    getCustomerList: PropTypes.func.isRequired,
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
    };
  }

  componentWillMount() {
    const orgid = _.isEmpty(window.forReactPosition) ? 'ZZ001041' : window.forReactPosition.orgId;
    this.setState({
      fspOrgId: orgid,
      orgId: orgid, // 组织ID
    });
    this.props.getCustomerList();
  }

  componentWillReceiveProps(nextProps) {
    const { position: prePosition, custRange: preCustRange, cycle: preCycle } = this.props;
    const { position: nextPosition, custRange: nextCustRange, cycle: nextCycle } = nextProps;
    const { orgId: preOrgId } = prePosition;
    const { orgId: nextOrgId } = nextPosition;
    if (preOrgId !== nextOrgId) {
      this.setState({
        orgId: nextOrgId,
      });
      this.getCustomerList();
    }
    if (preCycle !== nextCycle) {
      this.setState({
        cycle: nextCycle[0].key,
      });
    }
    if (preCustRange !== nextCustRange) {
      this.handleGetAllInfo();
    }
  }

  @autobind
  getCustomerList() {
    // const { getPerformanceIndicators, custRange } = this.props;
    // const { orgId, cycle } = this.state;
    // let custType = ORG;
    // if (orgId === custRange[0].id) { // 判断客户范围类型
    //   custType = ORG;
    // } else {
    //   custType = CUST_MANAGER;
    // }
    // getPerformanceIndicators({
    //   custTypes: custType, // 客户范围类型
    //   dateType: cycle, // 周期类型
    //   orgId, // 组织ID
    // });
  }

  @autobind
  createCustRange() {
    const { empInfo, custRange } = this.props;
    const { empPostnDTOList } = empInfo;
    const { fspOrgId } = this.state;
    let orgNewCustRange = [];
    const newCustRrange = [];
    if (!_.isEmpty(custRange) && fspOrgId === custRange[0].id) {
      return custRange;
    }
    orgNewCustRange = _.findIndex(custRange, item => item.id === fspOrgId);
    let newData;
    if (orgNewCustRange > -1) { // 总机构内
      newData = custRange[orgNewCustRange];
      newCustRrange.push(newData);
    } else { // 职位中去查找
      orgNewCustRange = _.findIndex(empPostnDTOList, item => item.orgId === fspOrgId);
      if (orgNewCustRange > -1) {
        const org = {
          id: empPostnDTOList[orgNewCustRange].orgId,
          name: empPostnDTOList[orgNewCustRange].orgName,
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

  @autobind
  handleGetAllInfo() {
    const { getAllInfo, custRange, cycle } = this.props;
    const { orgId } = this.state;
    let custType = ORG;
    const orgsId = !_.isEmpty(custRange[0]) ? custRange[0].id : '';
    if (orgId === orgsId) { // 判断客户范围类型
      custType = ORG;
    } else {
      custType = CUST_MANAGER;
    }
    this.setState({
      cycle: _.isEmpty(cycle) ? '' : cycle[0].key,
    });
    getAllInfo({
      request: {
        custTypes: custType, // 客户范围类型
        orgId, // 组织ID
      },
    });
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
        ...state,
      },
    });
    this.setState({
      ...state,
    }, () => {
      this.getCustomerList();
    });
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

  render() {
    const { location, replace, collectCustRange, dict } = this.props;
    const {
      custNature,
      custRiskBearing,
      custBusinessType,
      sortDirection,
      sortType,
    } = location.query;
    // 排序的默认值 ： 总资产降序
    let reorderValue = { sortType: 'totalAssets', sortDirection: 'desc' };
    if (sortType && sortDirection) {
      reorderValue = { sortType, sortDirection };
    }
    return (
      <div className={styles.customerlist}>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={12}>
            <CustomerTotal type="search" num={40} />
          </Col>
          <Col span={12}>
            <div className="custRange">
              <Icon type="kehu" />
              <CustRange
                custRange={this.createCustRange()}
                location={location}
                replace={replace}
                updateQueryState={this.updateQueryState}
                collectData={collectCustRange}
              />
            </div>
          </Col>
        </Row>
        <div className="filter">
          <Filter
            value={custNature}
            filterLabel="客户性质"
            filter="custNature"
            filterField={dict.custNature}
            onChange={this.filterChange}
          />
          {/* <Filter
            filterLabel="客户类型"
            filter="custType"
            filterField={dict.custType}
            onChange={this.filterChange}
          />*/}
          <Filter
            value={custRiskBearing}
            filterLabel="风险等级"
            filter="custRiskBearing"
            filterField={dict.custRiskBearing}
            onChange={this.filterChange}
          />
          <Filter
            value={custBusinessType}
            filterLabel="已开通业务"
            filter="custBusinessType"
            filterField={dict.custBusinessType}
            onChange={this.filterChange}
          />
        </div>
        <Reorder
          value={reorderValue}
          onChange={this.orderChange}
        />
      </div>
    );
  }
}
