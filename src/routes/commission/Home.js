/**
 * @description 佣金调整首页
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { withRouter, routerRedux } from 'dva/router';

import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import Detail from '../../components/commissionAdjustment/Detail';
import ApprovalRecordBoard from '../../components/commissionAdjustment/ApprovalRecordBoard';
import CreateNewApprovalBoard from '../../components/commissionAdjustment/CreateNewApprovalBoard';
import CommissionHeader from '../../components/common/biz/SeibelHeader';
import CommissionList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import { constructSeibelPostBody, getEmpId } from '../../utils/helper';
import { seibelConfig } from '../../config';
import './home.less';

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
const { commission, commission: { pageType, subType, status } } = seibelConfig;
const effects = {
  list: 'commission/getCommissionList',
  detail: 'commission/getCommissionDetail',
  record: 'commission/getApprovalRecords',
  searchCust: 'commission/searchCustList',
  searchDrafter: 'commission/searchDrafterList',
  custRange: 'commission/getCustRange',
  productList: 'commission/getProductList',
  approver: 'commission/getAprovalUserList',
  validate: 'commission/validateCustInfo',
};

const mapStateToProps = state => ({
  list: state.commission.list,
  productList: state.commission.productList,
  approvalUserList: state.commission.approvalUserList,
  validataLoading: state.commission.validataLoading,
  validateResult: state.commission.validateResult,
  detail: state.commission.detail,
  custRange: state.commission.custRange,
  approvalRecord: state.commission.approvalRecord,
  recordLoading: state.commission.recordLoading,
  filterCustList: state.commission.filterCustList,
  filterDrafterList: state.commission.filterDrafterList,
});

const getDataFunction = (loading, type) => query => ({
  type,
  payload: query || {},
  loading,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  getCommissionList: getDataFunction(true, effects.list), // 获取批量佣金调整List
  getCommissionDetail: getDataFunction(true, effects.detail), // 获取批量佣金调整Detail
  getApprovalRecords: getDataFunction(false, effects.record), // 获取用户审批记录
  searchCustList: getDataFunction(false, effects.searchCust), // 通过关键字，查询可选用户列表
  searchDrafter: getDataFunction(false, effects.searchDrafter), // 通过关键字，查询可选拟稿人列表
  getCustRange: getDataFunction(false, effects.custRange), // 组织机构
  getProductList: getDataFunction(false, effects.productList), // 查询目标产品列表
  getAprovalUserList: getDataFunction(false, effects.approver), // 查询审批人员列表
  validateCustInfo: getDataFunction(false, effects.validate), // 校验用户资格
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CommissionHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    validateCustInfo: PropTypes.func.isRequired,
    getAprovalUserList: PropTypes.func.isRequired,
    getCommissionList: PropTypes.func.isRequired,
    getCommissionDetail: PropTypes.func.isRequired,
    getApprovalRecords: PropTypes.func.isRequired,
    searchCustList: PropTypes.func.isRequired,
    searchDrafter: PropTypes.func.isRequired,
    getCustRange: PropTypes.func.isRequired,
    getProductList: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    productList: PropTypes.array.isRequired,
    list: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    approvalRecord: PropTypes.object.isRequired,
    recordLoading: PropTypes.bool.isRequired,
    validataLoading: PropTypes.bool.isRequired,
    validateResult: PropTypes.string.isRequired,
    approvalUserList: PropTypes.array.isRequired,
    filterCustList: PropTypes.array.isRequired,
    filterDrafterList: PropTypes.array.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      approvalBoard: false,
      createApprovalBoard: false,
    };
  }

  componentWillMount() {
    const {
      getCommissionList,
      getAprovalUserList,
      getCustRange,
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
    getCustRange({});
    getAprovalUserList({ loginUser: getEmpId() });
    // 默认筛选条件
    getCommissionList({ ...params, type: pageType });
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { location: { query: prevQuery = EMPTY_OBJECT }, getCommissionList } = this.props;
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
        getCommissionList({
          ...params,
          type: pageType,
        });
      }
    }

    // 判断用户点击查询审批记录
    const { recordLoading: prevRL } = this.props;
    const { recordLoading: nextRL } = nextProps;
    if (prevRL && !nextRL) {
      // 表示发起审批记录查询完成
      // 打开弹出窗
      this.openApprovalBoard();
    }
  }

  componentDidUpdate() {
    const {
      location: {
        pathname,
        query,
        query: { isResetPageNum },
      },
      replace,
    } = this.props;
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
  }

  /**
   * 点击列表每条的时候对应请求详情
   */
  @autobind
  getListRowId(id) {
    const { getCommissionDetail } = this.props;
    getCommissionDetail({
      batchNum: id,
    });
  }

  // 点击查看的时候，弹出框需要的所点击的用户信息
  @autobind
  getApprovalBoardCustInfo(info) {
    const loginuser = getEmpId();
    this.props.getApprovalRecords({ ...info, loginuser });
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

  // 头部新建按钮点击事件处理程序
  @autobind
  handleCreateBtnClick() {
    this.openCreateApprovalBoard();
  }

  // 根据用户输入查询查询拟稿人
  @autobind
  searDrafterList(keyword) {
    this.props.searchDrafter({
      type: pageType,
      keyword,
    });
  }

  // 根据用户输入的客户关键字查询客户List
  @autobind
  searchCustList(keyword) {
    this.props.searchCustList({
      keyword,
    });
  }

  // 生成左侧列表页面的数据列
  @autobind
  constructTableColumns() {
    return seibelColumns({
      pageName: 'commission',
      type: 'yongjin',
      pageData: commission,
    });
  }

  // 打开审批记录弹出窗
  @autobind
  openApprovalBoard() {
    this.setState({
      approvalBoard: true,
    });
  }

  // 打开新建申请的弹出框
  @autobind
  openCreateApprovalBoard() {
    this.setState({
      createApprovalBoard: true,
    });
  }

  // 关闭审批记录弹出窗
  @autobind
  closeApprovalBoard() {
    this.setState({
      approvalBoard: false,
    });
  }

  // 关闭新建申请弹出层
  @autobind
  closeNewApprovalBoard() {
    this.setState({
      createApprovalBoard: false,
    });
  }

  render() {
    const {
      location,
      replace,
      list,
      detail,
      filterDrafterList,
      filterCustList,
      custRange,
      approvalRecord,
      productList,
      getProductList,
      approvalUserList,
      validataLoading,
      validateResult,
      validateCustInfo,
    } = this.props;
    if (_.isEmpty(custRange)) {
      return null;
    }
    const isEmpty = _.isEmpty(list);
    // 此处需要提供一个方法给返回的接口查询设置是否查询到数据
    const { approvalBoard, createApprovalBoard } = this.state;
    const topPanel = (
      <CommissionHeader
        location={location}
        replace={replace}
        page="commission"
        subtypeOptions={subType}
        stateOptions={status}
        toSearchDrafter={this.searDrafterList}
        drafterList={filterDrafterList}
        toSearchCust={this.searchCustList}
        customerList={filterCustList}
        custRange={custRange}
        creatSeibelModal={this.handleCreateBtnClick}
      />
    );
    const leftPanel = (
      <CommissionList
        list={list}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
        clickRow={this.getListRowId}
        backKeys={['bussiness1', 'flowId']}
      />
    );

    const rightPanel = (
      <Detail
        data={detail}
        location={location}
        checkApproval={this.getApprovalBoardCustInfo}
      />
    );
    return (
      <div className="feedbackbox">
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="feedbackList"
        />
        <ApprovalRecordBoard
          modalKey="approvalBoard"
          record={approvalRecord}
          visible={approvalBoard}
          onClose={this.closeApprovalBoard}
        />
        <CreateNewApprovalBoard
          modalKey="createApprovalBoard"
          visible={createApprovalBoard}
          onClose={this.closeNewApprovalBoard}
          queryProductList={getProductList}
          targetProductList={productList}
          approverList={approvalUserList}
          customerList={[]}
          validataLoading={validataLoading}
          validateResult={validateResult}
          validateCust={validateCustInfo}
        />
      </div>
    );
  }
}
