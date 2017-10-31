/**
 * @description 佣金调整首页
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { message } from 'antd';

import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import Detail from '../../components/commissionAdjustment/Detail';
import SingleDetail from '../../components/commissionAdjustment/SingleDetail';
import AdvisoryDetail from '../../components/commissionAdjustment/AdvisoryDetail';
import ApprovalRecordBoard from '../../components/commissionAdjustment/ApprovalRecordBoard';
import CreateNewApprovalBoard from '../../components/commissionAdjustment/CreateNewApprovalBoard';
import CommissionHeader from '../../components/common/biz/ConnectedSeibelHeader';
import CommissionList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import { constructSeibelPostBody, getEmpId } from '../../utils/helper';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';
import './home.less';

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
const { comsubs, commission, commission: { pageType, subType, status } } = seibelConfig;

const effects = {
  list: 'app/getSeibleList',
  detail: 'commission/getCommissionDetail',
  singleDetail: 'commission/getSingleDetail',
  subscribeDetail: 'commission/getSubscribeDetail',
  unsubDetail: 'commission/getUnSubscribeDetail',
  record: 'commission/getApprovalRecords',
  productList: 'commission/getProductList',
  applyCustList: 'commission/getCanApplyCustList',
  approver: 'commission/getAprovalUserList',
  validate: 'commission/validateCustInfo',
  submitBatch: 'commission/submitBatchCommission',
  submitSingle: 'commission/submitSingleCommission',
  batchgj: 'commission/getGJCommissionRate',
  singlegj: 'commission/getSingleGJCommissionRate',
  singleCustList: 'commission/getSingleCustList',
  subscribeCustList: 'commission/getSubscribelCustList',
  singleComOptions: 'commission/getSingleOtherCommissionOptions',
  singleProList: 'commission/getSingleComProductList',
  threeMatchInfo: 'commission/queryThreeMatchInfo',
  subscribelProList: 'commission/getSubscribelProList',
  unSubscribelProList: 'commission/getUnSubscribelProList',
  subSubscribe: 'commission/submitConsultSubscribe',
  unSubSubscribe: 'commission/submitConsultUnSubscribe',
};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // empInfo:
  empInfo: state.app.empInfo,
  // 左侧里诶包
  list: state.app.seibleList,
  // 获取列表数据进程
  listProcess: state.loading.effects[effects.list],
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
  // 右侧单佣金调整详情
  singleDetail: state.commission.singleDetail,
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
  // 目标股基佣金率码值列表
  gjCommissionList: state.commission.gjCommission,
  // 单佣金调整佣金率码值列表
  singleGJCommission: state.commission.singleGJCommission,
  // 单佣金调整的其他佣金费率码值
  singleOtherRatio: state.commission.singleOtherCommissionOptions,
  // 单佣金调整页面客户查询列表
  singleCustomerList: state.commission.singleCustomerList,
  // 咨询订阅、咨询退订客户查询列表
  subscribeCustomerList: state.commission.subscribeCustomerList,
  // 单佣金调整可选产品列表
  singleComProductList: state.commission.singleComProductList,
  // 客户与产品的三匹配信息
  threeMatchInfo: state.commission.threeMatchInfo,
  // 新建咨讯订阅可选产品列表
  subscribelProList: state.commission.subscribelProList,
  // 新建咨讯订阅可选产品列表
  unSubscribelProList: state.commission.unSubscribelProList,
  // 单佣金调整申请结果
  singleSubmit: state.commission.singleSubmit,
  // 咨询订阅提交后返回的id
  consultSubId: state.commission.consultSubId,
  // 咨询退订提交后返回的id
  consultUnsubId: state.commission.consultUnsubId,
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
  // 获取批量佣金调整Detail
  getBatchCommissionDetail: getDataFunction(true, effects.detail),
  // 获取单佣金调整Detail
  getSingleDetail: getDataFunction(true, effects.singleDetail),
  // 获取咨询订阅详情Detail
  getSubscribeDetail: getDataFunction(true, effects.subscribeDetail),
  // 获取资讯退订详情Detail
  getUnSubscribeDetail: getDataFunction(true, effects.unsubDetail),
  // 获取用户审批记录
  getApprovalRecords: getDataFunction(false, effects.record),
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
  // 提交单佣金调整申请
  submitSingle: getDataFunction(false, effects.submitSingle),
  // 获取批量佣金目标股基佣金率
  getGJCommissionRate: getDataFunction(false, effects.batchgj),
  // 获取单佣金目标股基佣金率
  getSingleGJ: getDataFunction(false, effects.singlegj),
  // 获取单佣金调整中的其他佣金费率选项
  getSingleOtherRates: getDataFunction(false, effects.singleComOptions),
  // 查询单佣金调整页面客户列表
  getSingleCustList: getDataFunction(false, effects.singleCustList),
  // 咨讯订阅、咨讯退订客户列表
  getSubscribelCustList: getDataFunction(false, effects.subscribeCustList),
  // 获取单佣金调整中的可选产品列表
  getSingleProductList: getDataFunction(false, effects.singleProList),
  // 查询产品与客户的三匹配信息
  queryThreeMatchInfo: getDataFunction(false, effects.threeMatchInfo),
  // 获取新建咨讯订阅可选产品列表
  getSubscribelProList: getDataFunction(false, effects.subscribelProList),
  // 获取新建咨讯退订可选产品列表
  getUnSubscribelProList: getDataFunction(false, effects.unSubscribelProList),
  // 咨询订阅提交
  submitSub: getDataFunction(false, effects.subSubscribe),
  // 咨询退订提交
  submitUnSub: getDataFunction(false, effects.unSubSubscribe),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class CommissionHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    validateCustInfo: PropTypes.func.isRequired,
    getCanApplyCustList: PropTypes.func.isRequired,
    getAprovalUserList: PropTypes.func.isRequired,
    getCommissionList: PropTypes.func.isRequired,
    getBatchCommissionDetail: PropTypes.func.isRequired,
    getSubscribeDetail: PropTypes.func.isRequired,
    getUnSubscribeDetail: PropTypes.func.isRequired,
    getSingleDetail: PropTypes.func.isRequired,
    getApprovalRecords: PropTypes.func.isRequired,
    getSingleCustList: PropTypes.func.isRequired,
    getSubscribelCustList: PropTypes.func.isRequired,
    getProductList: PropTypes.func.isRequired,
    productList: PropTypes.array.isRequired,
    list: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    singleDetail: PropTypes.object.isRequired,
    subscribeDetail: PropTypes.object.isRequired,
    unsubscribeDetail: PropTypes.object.isRequired,
    approvalRecord: PropTypes.object.isRequired,
    recordLoading: PropTypes.bool.isRequired,
    listProcess: PropTypes.bool,
    batchSubmitProcess: PropTypes.bool,
    validataLoading: PropTypes.bool.isRequired,
    validateResult: PropTypes.string.isRequired,
    approvalUserList: PropTypes.array.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    batchnum: PropTypes.string.isRequired,
    submitBatch: PropTypes.func.isRequired,
    getGJCommissionRate: PropTypes.func.isRequired,
    gjCommissionList: PropTypes.array.isRequired,
    getSingleOtherRates: PropTypes.func.isRequired,
    singleOtherRatio: PropTypes.array.isRequired,
    getSingleProductList: PropTypes.func.isRequired,
    singleComProductList: PropTypes.array.isRequired,
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    singleCustomerList: PropTypes.array.isRequired,
    subscribeCustomerList: PropTypes.array.isRequired,
    getSubscribelProList: PropTypes.func.isRequired,
    getUnSubscribelProList: PropTypes.func.isRequired,
    subscribelProList: PropTypes.array.isRequired,
    unSubscribelProList: PropTypes.array.isRequired,
    singleGJCommission: PropTypes.array.isRequired,
    getSingleGJ: PropTypes.func.isRequired,
    submitSingle: PropTypes.func.isRequired,
    singleSubmit: PropTypes.string.isRequired,
    submitSub: PropTypes.func.isRequired,
    consultSubId: PropTypes.string.isRequired,
    submitUnSub: PropTypes.func.isRequired,
    consultUnsubId: PropTypes.string.isRequired,
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
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
    // 获取审批人员列表
    getAprovalUserList({ loginUser: getEmpId() });
    // 默认筛选条件
    getCommissionList({ ...params, type: pageType });
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

  // 查询佣金调整4个子类型的详情信息
  getDetail4Subtye(record) {
    const { subType: st, id, business1, custType } = record;
    const {
      getBatchCommissionDetail,
      getSubscribeDetail,
      getUnSubscribeDetail,
      getSingleDetail,
    } = this.props;
    switch (st) {
      case comsubs.batch:
        getBatchCommissionDetail({ batchNum: business1 });
        break;
      case comsubs.single:
        getSingleDetail({ flowCode: business1 });
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
    const {
      detail,
      location,
      subscribeDetail,
      unsubscribeDetail,
      singleDetail,
    } = this.props;
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
        detailComponent = (
          <SingleDetail
            data={singleDetail}
            location={location}
          />
        );
        break;
      case comsubs.subscribe:
        detailComponent = (
          <AdvisoryDetail
            name="资讯订阅"
            data={subscribeDetail}
            location={location}
          />
        );
        break;
      case comsubs.unsubscribe:
        detailComponent = (
          <AdvisoryDetail
            name="资讯退订"
            data={unsubscribeDetail}
            location={location}
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
      approvalRecord,
      productList,
      getProductList,
      getCanApplyCustList,
      getSingleCustList,
      getSubscribelCustList,
      submitBatch,
      submitSub,
      submitUnSub,
      approvalUserList,
      canApplyCustList,
      validataLoading,
      validateResult,
      validateCustInfo,
      dict: { otherRatio },
      empInfo: { empInfo, empPostnList },
      getGJCommissionRate,
      gjCommissionList,
      getSingleOtherRates,
      singleOtherRatio,
      getSingleProductList,
      singleComProductList,
      threeMatchInfo,
      queryThreeMatchInfo,
      singleCustomerList,
      subscribeCustomerList,
      getSubscribelProList,
      subscribelProList,
      getUnSubscribelProList,
      unSubscribelProList,
      singleGJCommission,
      getSingleGJ,
      submitSingle,
      singleSubmit,
    } = this.props;
    const isEmpty = _.isEmpty(list.resultData);
    // 此处需要提供一个方法给返回的接口查询设置是否查询到数据
    const { approvalBoard, createApprovalBoard, currentSubtype } = this.state;
    const topPanel = (
      <CommissionHeader
        location={location}
        replace={replace}
        page="commission"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
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
          empPostnList={empPostnList}
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
          gjCommission={gjCommissionList}
          queryGJCommission={getGJCommissionRate}
          getSingleOtherRates={getSingleOtherRates}
          singleOtherRatio={singleOtherRatio}
          getSingleProductList={getSingleProductList}
          singleComProductList={singleComProductList}
          threeMatchInfo={threeMatchInfo}
          queryThreeMatchInfo={queryThreeMatchInfo}
          querySingleCustList={getSingleCustList}
          querySubscribelCustList={getSubscribelCustList}
          singleCustList={singleCustomerList}
          subscribeCustList={subscribeCustomerList}
          getSubscribelProList={getSubscribelProList}
          subscribelProList={subscribelProList}
          getUnSubscribelProList={getUnSubscribelProList}
          unSubscribelProList={unSubscribelProList}
          singleGJCommission={singleGJCommission}
          getSingleGJ={getSingleGJ}
          onSubmitSingle={submitSingle}
          singleSubmit={singleSubmit}
          submitSub={submitSub}
          submitUnSub={submitUnSub}
        />
      </div>
    );
  }
}
