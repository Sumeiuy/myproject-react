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
import { message } from 'antd';

import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import Detail from '../../components/commissionAdjustment/Detail';
import AdvisoryDetail from '../../components/commissionAdjustment/AdvisoryDetail';
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
const { comsubs, commission, commission: { pageType, subType, status } } = seibelConfig;

const effects = {
  list: 'app/getSeibleList',
  searchDrafter: 'app/getDrafterList',
  searchCust: 'app/getCustomerList',
  custRange: 'app/getCustRange',
  detail: 'commission/getCommissionDetail',
  subscribeDetail: 'commission/getSubscribeDetail',
  unsubDetail: 'commission/getUnSubscribeDetail',
  record: 'commission/getApprovalRecords',
  productList: 'commission/getProductList',
  applyCustList: 'commission/getCanApplyCustList',
  approver: 'commission/getAprovalUserList',
  validate: 'commission/validateCustInfo',
  submitBatch: 'commission/submitBatchCommission',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // empInfo:
  empInfo: state.app.empInfo,
  // 左侧里诶包
  list: state.app.seibleList,
  // 组织结构树
  custRange: state.app.custRange,
  // 获取列表数据进程
  listProcess: state.loading.effects[effects.list],
  // 拟稿人列表
  filterDrafterList: state.app.drafterList,
  // 已申请的客户列表
  filterCustList: state.app.customerList,
  // 可申请的客户列表
  canApplyCustList: state.commission.canApplyCustList,
  // 目标产品列表
  productList: state.commission.productList,
  // 审批人员列表
  approvalUserList: state.commission.approvalUserList,
  // 验证过程
  validataLoading: state.commission.validataLoading,
  // 验证结果描述
  validateResult: state.commission.validateResult,
  // 右侧批量佣金详情
  detail: state.commission.detail,
  // 右侧咨询订阅详情
  subscribeDetail: state.commission.subscribeDetail,
  // 右侧资讯退订详情
  unsubscribeDetail: state.commission.subscribeDetail,
  // 审批历史记录
  approvalRecord: state.commission.approvalRecord,
  // 查询审批记录进程
  recordLoading: state.commission.recordLoading,
  // 批量佣金调整申请提交后，返回的批量处理号
  batchnum: state.commission.batchnum,
  // 提交批量佣金申请调整的进程
  batchSubmitProcess: state.loading.effects[effects.submitBatch],
});

const getDataFunction = (loading, type) => query => ({
  type,
  payload: query || {},
  loading,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取批量佣金调整List
  getCommissionList: getDataFunction(true, effects.list),
  // 获取批量佣金调整List
  getCustRange: getDataFunction(true, effects.custRange),
  // 获取批量佣金调整Detail
  getBatchCommissionDetail: getDataFunction(true, effects.detail),
  // 获取咨询订阅详情Detail
  getSubscribeDetail: getDataFunction(true, effects.subscribeDetail),
  // 获取资讯退订详情Detail
  getUnSubscribeDetail: getDataFunction(true, effects.unsubDetail),
  // 获取用户审批记录
  getApprovalRecords: getDataFunction(false, effects.record),
  // 通过关键字，查询可选的已申请用户列表
  searchCustList: getDataFunction(false, effects.searchCust),
  // 通过关键字，查询可选拟稿人列表
  searchDrafter: getDataFunction(false, effects.searchDrafter),
  // 查询目标产品列表
  getProductList: getDataFunction(false, effects.productList),
  // 查询审批人员列表
  getAprovalUserList: getDataFunction(false, effects.approver),
  // 校验用户资格
  validateCustInfo: getDataFunction(false, effects.validate),
  // 通过关键字，查询可选的可申请用户列表
  getCanApplyCustList: getDataFunction(false, effects.applyCustList),
  // 提交批量佣金调整申请
  submitBatch: getDataFunction(false, effects.submitBatch),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CommissionHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    getCustRange: PropTypes.func.isRequired,
    validateCustInfo: PropTypes.func.isRequired,
    getCanApplyCustList: PropTypes.func.isRequired,
    getAprovalUserList: PropTypes.func.isRequired,
    getCommissionList: PropTypes.func.isRequired,
    getBatchCommissionDetail: PropTypes.func.isRequired,
    getSubscribeDetail: PropTypes.func.isRequired,
    getUnSubscribeDetail: PropTypes.func.isRequired,
    getApprovalRecords: PropTypes.func.isRequired,
    searchCustList: PropTypes.func.isRequired,
    searchDrafter: PropTypes.func.isRequired,
    getProductList: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    productList: PropTypes.array.isRequired,
    list: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    subscribeDetail: PropTypes.object.isRequired,
    unsubscribeDetail: PropTypes.object.isRequired,
    approvalRecord: PropTypes.object.isRequired,
    recordLoading: PropTypes.bool.isRequired,
    listProcess: PropTypes.bool,
    batchSubmitProcess: PropTypes.bool,
    validataLoading: PropTypes.bool.isRequired,
    validateResult: PropTypes.string.isRequired,
    approvalUserList: PropTypes.array.isRequired,
    filterCustList: PropTypes.array.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    filterDrafterList: PropTypes.array.isRequired,
    batchnum: PropTypes.string.isRequired,
    submitBatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    listProcess: false,
    batchSubmitProcess: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSubtype: '',
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
      custRange,
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
    if (_.isEmpty(custRange)) {
      getCustRange({});
    }
    // 获取审批人员列表
    getAprovalUserList({ loginUser: getEmpId() });
    // 默认筛选条件
    getCommissionList({ ...params, type: pageType });
  }

  componentDidMount() {
    // 给元素添加该class修改滚动条颜色，以避免其他页面受影响
    document.querySelector('body').classList.add('selfScrollBarStyle');
  }

  componentWillReceiveProps(nextProps) {
    const { listProcess: prevLP } = this.props;
    const { listProcess: nextLP, list, location: { query: { currentId } } } = nextProps;
    if (!nextLP && prevLP) {
      if (!_.isEmpty(list.resultData)) {
        // 表示左侧列表获取完毕
        // 因此此时获取Detail
        const item = _.filter(list.resultData, o => String(o.id) === String(currentId))[0];
        const { subType: st } = item;
        this.setState({
          currentSubtype: st,
        });
        this.getDetail4Subtye(item);
      }
    }
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

    // 用户提交批量佣金调整申请
    const { batchSubmitProcess: prevBSP } = this.props;
    const { batchSubmitProcess: nextBSP, batchnum } = nextProps;
    if (prevBSP && !nextBSP) {
      // 完成提交
      // 以后看需要是否需要做相应操作
      if (batchnum !== 'fail') {
        // 成功
        message.success('提交成功');
      } else {
        message.error('提交失败');
      }
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

  componentWillUnmount() {
    // 给元素添加该class修改滚动条颜色，以避免其他页面受影响
    document.querySelector('body').classList.remove('selfScrollBarStyle');
  }

  // 查询佣金调整4个子类型的详情信息
  getDetail4Subtye(record) {
    const { subType: st, id, business1, custType } = record;
    const {
      getBatchCommissionDetail,
      getSubscribeDetail,
      getUnSubscribeDetail,
    } = this.props;
    switch (st) {
      case comsubs.batch:
        getBatchCommissionDetail({ batchNum: business1 });
        break;
      case comsubs.single:
        break;
      case comsubs.subscribe:
        getSubscribeDetail({ orderId: id, type: custType });
        break;
      case comsubs.unsubscribe:
        getUnSubscribeDetail({ orderId: id, type: custType });
        break;
      default:
        break;
    }
  }

  // 点击查看的时候，弹出框需要的所点击的用户信息
  @autobind
  getApprovalBoardCustInfo(info) {
    const loginuser = getEmpId();
    this.props.getApprovalRecords({ ...info, loginuser });
  }

  /**
   * 根据子类型获取不同的Detail组件
   * @param  {string} st 子类型
   */
  @autobind
  getDetailComponentBySubType(st) {
    const { detail, location, subscribeDetail, unsubscribeDetail } = this.props;
    let detailComponent = null;
    switch (st) {
      case comsubs.batch:
        detailComponent = (
          <Detail
            data={detail}
            location={location}
            checkApproval={this.getApprovalBoardCustInfo}
          />
        );
        break;
      case comsubs.single:
        break;
      case comsubs.subscribe:
        detailComponent = (
          <AdvisoryDetail
            name="资讯订阅"
            data={subscribeDetail}
          />
        );
        break;
      case comsubs.unsubscribe:
        detailComponent = (
          <AdvisoryDetail
            name="资讯退订"
            data={unsubscribeDetail}
          />
        );
        break;
      default:
        break;
    }
    return detailComponent;
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  handleListRowClick(record) {
    const { id, subType: st } = record;
    const {
      location: { query: { currentId } },
    } = this.props;
    if (currentId === id) return;
    this.setState({ currentSubtype: st });
    this.getDetail4Subtye(record);
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
      type: pageType,
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
      filterDrafterList,
      filterCustList,
      custRange,
      approvalRecord,
      productList,
      getProductList,
      getCanApplyCustList,
      submitBatch,
      approvalUserList,
      canApplyCustList,
      validataLoading,
      validateResult,
      validateCustInfo,
      dict: { otherRatio },
      empInfo: { empInfo },
    } = this.props;
    if (_.isEmpty(custRange)) {
      return null;
    }
    const isEmpty = _.isEmpty(list.resultData);
    // 此处需要提供一个方法给返回的接口查询设置是否查询到数据
    const { approvalBoard, createApprovalBoard, currentSubtype } = this.state;
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
        clickRow={this.handleListRowClick}
      />
    );
    // TODO 此处需要根据不同的子类型使用不同的Detail组件
    const rightPanel = this.getDetailComponentBySubType(currentSubtype);

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
          empInfo={empInfo}
          modalKey="createApprovalBoard"
          visible={createApprovalBoard}
          onClose={this.closeNewApprovalBoard}
          queryProductList={getProductList}
          targetProductList={productList}
          approverList={approvalUserList}
          onSearchApplyCust={getCanApplyCustList}
          customerList={canApplyCustList}
          validataLoading={validataLoading}
          validateResult={validateResult}
          validateCust={validateCustInfo}
          otherRatios={otherRatio}
          onBatchSubmit={submitBatch}
        />
      </div>
    );
  }
}
