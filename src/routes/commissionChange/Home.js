/**
 * @file routes/commissionChange/Home.js
 * @description 佣金调整、资讯订阅、资讯退订驳回再修改页面
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'dva-react-router-3/router';
import { autobind } from 'core-decorators';
// import _ from 'lodash';

import SubscribDeatilChange from '../../components/commissionChange/SubscribDeatilChange';
import SingleDetailChange from '../../components/commissionChange/SingleDetailChange';
import Barable from '../../decorators/selfBar';
import { isInFsp, getCssStyle } from '../../utils/helper';
import styles from './home.less';

const effects = {
  // 咨讯订阅驳回待修改的详情
  subDetail: 'commissionChange/getSubscribeDetailToChange',
  // 修改页面产品与客户的三匹配信息
  threeMatchInfo: 'commissionChange/queryThreeMatchInfo',
  // 修改页面获取审批人员列表
  approver: 'commissionChange/getAprovalUserList',
  // 修改页面咨讯订阅提交
  subSubscribe: 'commissionChange/submitConsultSubscribe',
  // 查询驳回后单佣金调整的详情
  singleDetail: 'commissionChange/getSingleDetailToChange',
  // 获取驳回后单佣金调整的目标股基佣金率码值表
  gjRate: 'commissionChange/getSingleGJCommissionRate',
  // 获取驳回后单佣金调整的可选产品列表
  singleProductList: 'commissionChange/getSingleComProductList',
  // 获取驳回后单佣金调整的原始其他佣金率选项
  otherRate: 'commissionChange/getSingleOtherCommissionOptions',
  // 获取驳回后单佣金调整的客户信息
  singleCustomer: 'commissionChange/getSingleCustList',
};

const mapStateToProps = state => ({
  // empInfo:
  empInfo: state.app.empInfo,
  subDetail: state.commissionChange.subscribeDetailToChange,
  threeMatchInfo: state.commissionChange.threeMatchInfo,
  // 咨询订阅提交后返回的id
  consultSubId: state.commissionChange.consultSubId,
  // 审批人员列表
  approvalUserList: state.commissionChange.approvalUserList,
  // 驳回后修改的单佣金
  singleDetail: state.commissionChange.singleDetailToChange,
  // 驳回后修改的目标股基佣金率码值列表
  singleGJ: state.commissionChange.singleGJCommission,
  // 驳回后修改的单佣金调整的可选佣金产品列表(里面包含了已经选中的)
  singleComProductList: state.commissionChange.singleComProductList,
  // 驳回后修改的单佣金调整的其他佣金率选项
  singleOtherRate: state.commissionChange.singleOtherCommissionOptions,
  // 驳回后修改的单佣金调整的客户信息
  singleCustomer: state.commissionChange.singleCustomerList,
  // 获取驳回后单佣金调整详情数据的Loading
  singleDetailLoading: state.loading.effects[effects.singleDetail],
});

const getDataFunction = (loading, type) => query => ({
  type,
  payload: query || {},
  loading,
});


const mapDispatchToProps = {
  // 获取咨询订阅详情Detail
  getSubscribeDetail: getDataFunction(true, effects.subDetail),
  // 查询审批人员列表
  getAprovalUserList: getDataFunction(false, effects.approver),
  // 三匹配
  queryThreeMatchInfo: getDataFunction(false, effects.threeMatchInfo),
  // 咨询订阅提交
  submitSub: getDataFunction(false, effects.subSubscribe),
  // 获取驳回后修改的单佣金调整详情
  querySingleDetail: getDataFunction(false, effects.singleDetail),
  // 获取驳回后修改的单佣金调整中的目标股基佣金率码值列表
  querySingleGj: getDataFunction(false, effects.gjRate),
  // 获取驳回后修改的单佣金调整中的可选佣金产品列表
  querySingleProductList: getDataFunction(false, effects.singleProductList),
  // 获取驳回后修改的单佣金调整的原始其他佣金率选项
  queryOtherRate: getDataFunction(false, effects.otherRate),
  // 获取驳回后的单佣金调整的客户信息
  querySingleCustomer: getDataFunction(false, effects.singleCustomer),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class RejectionAndAmendment extends PureComponent {
  static propTypes = {
    // 公共
    location: PropTypes.object.isRequired,
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    approvalUserList: PropTypes.array.isRequired,
    getAprovalUserList: PropTypes.func.isRequired,
    // 咨讯订阅修改相关
    subDetail: PropTypes.object.isRequired,
    // subscribelProList: PropTypes.array.isRequired,
    consultSubId: PropTypes.string.isRequired,
    getSubscribeDetail: PropTypes.func.isRequired,
    // getSubscribelProList: PropTypes.func.isRequired,
    empInfo: PropTypes.object.isRequired,
    submitSub: PropTypes.func.isRequired,
    // 驳回后修改单佣金调整相关
    singleDetailLoading: PropTypes.bool,
    singleDetail: PropTypes.object.isRequired,
    querySingleDetail: PropTypes.func.isRequired,
    querySingleGj: PropTypes.func.isRequired,
    // 目标股基佣金率码值列表
    singleGJ: PropTypes.array.isRequired,
    // 驳回后修改的单佣金调整中可选的佣金产品列表
    singleComProductList: PropTypes.array.isRequired,
    querySingleProductList: PropTypes.func.isRequired,
    // 驳回后的单佣金调整的其他佣金率选项
    queryOtherRate: PropTypes.func.isRequired,
    singleOtherRate: PropTypes.array.isRequired,
    // 驳回后的单佣金调整的客户信息
    singleCustomer: PropTypes.object.isRequired,
    querySingleCustomer: PropTypes.func.isRequired,
  }

  static defaultProps = {
    singleDetailLoading: false,
  }

  componentDidMount() {
    this.setHomeHeight();
  }

  @autobind
  setHomeHeight() {
    // 判断是否在fsp系统
    let height = getCssStyle(document.documentElement, 'height');
    if (isInFsp()) {
      height = `${Number.parseInt(height, 10) - 55}px`;
    }
    this.changeHome.style.height = height;
  }

  @autobind
  changeHomeRef(input) {
    this.changeHome = input;
  }

  // 判断当前是哪个驳回修改页面
  @autobind
  judgeSubtypeNow() {
    const { location: { query: { type, flowId } } } = this.props;
    if (type === 'SINGLE') {
      // 单佣金
      const {
        singleDetailLoading,
        singleDetail,
        singleGJ,
        singleComProductList,
        querySingleDetail,
        querySingleGj,
        querySingleProductList,
        threeMatchInfo,
        queryThreeMatchInfo,
        queryOtherRate,
        singleOtherRate,
      } = this.props;
      return (
        <SingleDetailChange
          flowCode={flowId}
          detail={singleDetail}
          detailLoading={singleDetailLoading}
          singleGJ={singleGJ}
          optionalList={singleComProductList}
          threeMatchInfo={threeMatchInfo}
          otherRate={singleOtherRate}
          onQueryDetail={querySingleDetail}
          onQueryGJ={querySingleGj}
          onQueryProductList={querySingleProductList}
          onQuery3Match={queryThreeMatchInfo}
          onQueryOtherRate={queryOtherRate}
        />
      );
    } else if (type === 'SUBSCRIBE') {
      // 咨讯订阅
      const {
        location,
        subDetail,
        threeMatchInfo,
        getSubscribeDetail,
        consultSubId,
        getAprovalUserList,
        queryThreeMatchInfo,
        submitSub,
        approvalUserList,
      } = this.props;
      return (
        <SubscribDeatilChange
          location={location}
          subscribeDetailToChange={subDetail}
          getSubscribeDetailToChange={getSubscribeDetail}
          threeMatchInfo={threeMatchInfo}
          queryThreeMatchInfo={queryThreeMatchInfo}
          queryApprovalUser={getAprovalUserList}
          consultSubId={consultSubId}
          submitSub={submitSub}
          approvalUserList={approvalUserList}
        />
      );
    } else if (type === 'UNSUBSCRIBE') {
      // 咨讯退订
      // TODO 等待单佣金修改组件完成
      return null;
    }
    return null;
  }

  render() {
    return (
      <div className={styles.rejectAmend} ref={this.changeHomeRef}>
        {
          this.judgeSubtypeNow()
        }
      </div>
    );
  }
}
