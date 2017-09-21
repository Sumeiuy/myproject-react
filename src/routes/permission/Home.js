/**
 * @file premission/Home.js
 *  权限申请
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { Col } from 'antd';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { constructSeibelPostBody } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import PermissionHeader from '../../components/common/biz/SeibelHeader';
import Detail from '../../components/permission/Detail';
import PermissionList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import { seibelConfig } from '../../config';

import styles from './home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['isResetPageNum'];
const { permission: { pageType, subType, status } } = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 右侧详情
  detailMessage: state.permission.detailMessage,
  // 左侧列表数据
  list: state.permission.list,
  // 拟稿人
  drafterList: state.permission.drafterList,
  // 客户
  custList: state.permission.custList,
  // 部门
  custRange: state.permission.custRange,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取右侧详情
  getDetailMessage: fetchDataFunction(true, 'permission/getDetailMessage'),
  // 获取左侧列表
  getPermissionList: fetchDataFunction(true, 'permission/getPermissionList'),
  // 获取拟稿人
  getDrafterList: fetchDataFunction(true, 'permission/getDrafterList'),
  // 获取客户
  getCustList: fetchDataFunction(true, 'permission/getCustList'),
  // 获取部门
  getEmpOrgTree: fetchDataFunction(true, 'permission/getEmpOrgTree'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Permission extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    drafterList: PropTypes.array.isRequired,
    custList: PropTypes.array.isRequired,
    custRange: PropTypes.array.isRequired,
    getPermissionList: PropTypes.func.isRequired,
    getDrafterList: PropTypes.func.isRequired,
    getCustList: PropTypes.func.isRequired,
    getEmpOrgTree: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    detailMessage: PropTypes.object.isRequired,
    getDetailMessage: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
    };
  }

  componentWillMount() {
    const {
      getEmpOrgTree,
      getPermissionList,
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
    // 默认筛选条件
    getPermissionList({ ...params, type: pageType });
    getEmpOrgTree({});
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { location: { query: prevQuery = EMPTY_OBJECT }, getPermissionList } = this.props;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;
    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        const params = constructSeibelPostBody(nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        );
        getPermissionList({
          ...params,
          type: pageType,
        });
      }
    }
  }

  componentDidUpdate() {
    const { location: { pathname, query, query: { isResetPageNum } }, replace,
      list: { resultData = EMPTY_LIST } } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
          pageNum: 1,
        },
      });
    }
    const isEmpty = _.isEmpty(resultData);
    this.setState({ // eslint-disable-line
      isEmpty,
    });
  }

  get getDetailComponent() {
    if (_.isEmpty(this.props.detailMessage)) {
      return null;
    }
    return <Detail {...this.props.detailMessage} />;
  }

  /**
   * 点击列表每条的时候对应请求详情
   */
  @autobind
  getListRowId(id) {
    const { getDetailMessage } = this.props;
    getDetailMessage({
      id,
    });
  }
    /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  /**
   * 构造表格的列数据
   * 传参为icon的type
   */
  @autobind
  constructTableColumns() {
    return seibelColumns('save_blue');
  }

  // 查询拟稿人
  @autobind
  toSearchDrafter(value) {
    const { getDrafterList } = this.props;
    getDrafterList({
      empId: value,
    });
  }

  // 查询客户
  @autobind
  toSearchCust(value) {
    const { getCustList } = this.props;
    getCustList({
      keyword: value,
    });
  }

  // 头部新建页面
  @autobind
  creatPermossionModal() {
    console.log('新建');
  }

  render() {
    const {
      list,
      location,
      replace,
      drafterList,
      custList,
      custRange,
    } = this.props;
    if (!custRange || !custRange.length) {
      return null;
    }
    const { isEmpty } = this.state;
    const topPanel = (
      <PermissionHeader
        location={location}
        replace={replace}
        page="premissionPage"
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.creatPermossionModal}
        toSearchDrafter={this.toSearchDrafter}
        toSearchCust={this.toSearchCust}
        drafterList={drafterList}
        custList={custList}
        custRange={custRange}
      />
    );

    const leftPanel = (
      <PermissionList
        list={list}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
        getListRowId={this.getListRowId}
      />
    );

    const rightPanel = (
      <Col span="24" className={styles.rightSection}>
        {this.getDetailComponent}
      </Col>
    );
    return (
      <div className={styles.premissionbox}>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="premissionList"
        />
      </div>
    );
  }
}

