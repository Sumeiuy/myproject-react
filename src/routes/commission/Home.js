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
import CommissionHeader from '../../components/common/biz/SeibelHeader';
import CommissionList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import { constructSeibelPostBody } from '../../utils/helper';
import { seibelConfig } from '../../config';
import './Home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
const { commission: { pageType, subType, status } } = seibelConfig;
const effects = {
  list: 'commission/getCommissionList',
  detail: 'commission/getCommissionDetail',
  record: 'commission/getApprovalRecords',
  searchCust: 'commission/searchCustList',
  searchDrafter: 'commission/searchDrafterList',
};

const mapStateToProps = state => ({
  list: state.commission.list,
  detail: state.commission.detail,
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
  getApprovalRecords: getDataFunction(true, effects.record), // 获取批量佣金调整Detail
  searchCustList: getDataFunction(true, effects.searchCust), // 通过关键字，查询可选用户列表
  searchDrafter: getDataFunction(true, effects.searchDrafter), // 通过关键字，查询可选拟稿人列表
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CommissionHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    getCommissionList: PropTypes.func.isRequired,
    getCommissionDetail: PropTypes.func.isRequired,
    getApprovalRecords: PropTypes.func.isRequired,
    searchCustList: PropTypes.func.isRequired,
    searchDrafter: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    approvalRecord: PropTypes.array.isRequired,
    recordLoading: PropTypes.bool.isRequired,
    filterCustList: PropTypes.bool.isRequired,
    filterDrafterList: PropTypes.bool.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      approvalBoard: false,
      approvalCust: {},
    };
  }

  componentWillMount() {
    const {
      getCommissionList,
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
    this.setState({
      approvalCust: info,
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

  @autobind
  searchResult(isEmpty) {
    this.setState({
      isEmpty,
    });
  }

  // 头部新建按钮点击事件处理程序
  @autobind
  handleCreateBtnClick() {
    console.warn('新建按钮');
  }

  // 根据用户输入查询查询拟稿人
  @autobind
  searDrafterList(keyword) {
    console.warn('请输入的拟稿人关键字', keyword);
  }

  // 生成左侧列表页面的数据列
  @autobind
  constructTableColumns() {
    return seibelColumns('save_blue');
  }

  // 打开审批记录弹出窗
  @autobind
  openApprovalBoard() {
    this.setState({
      approvalBoard: true,
    });
  }

  // 关闭审批记录弹出窗
  closeApprovalBoard() {
    this.setState({
      approvalBoard: false,
    });
  }

  render() {
    const { list, location, replace, detail } = this.props;
    // 此处需要提供一个方法给返回的接口查询设置是否查询到数据
    const { isEmpty, approvalBoard, approvalCust } = this.state;
    const topPanel = (
      <CommissionHeader
        location={location}
        replace={replace}
        page="commission"
        subtypeOptions={subType}
        stateOptions={status}
        drafterList={[]}
        creatSeibelModal={this.handleCreateBtnClick}
        toSearchDrafter={this.searDrafterList}
      />
    );
    const leftPanel = (
      <CommissionList
        list={list}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
        getListRowId={this.getListRowId}
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
          cust={approvalCust}
          visible={approvalBoard}
          onClose={this.closeApprovalBoard}
        />
      </div>
    );
  }
}
