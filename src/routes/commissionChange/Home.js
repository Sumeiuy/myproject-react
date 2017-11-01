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
import Barable from '../../decorators/selfBar';
// import styles from './home.less';

const effects = {
  // 咨讯订阅驳回待修改的详情
  subDetail: 'commissionChange/getSubscribeDetailToChange',
  // 修改页面咨讯订阅可选产品列表
  subscribelProList: 'commissionChange/getSubscribelProList',
  // 修改页面产品与客户的三匹配信息
  threeMatchInfo: 'commissionChange/queryThreeMatchInfo',
  // 修改页面获取审批人员列表
  approver: 'commissionChange/getAprovalUserList',
  // 修改页面咨讯订阅提交
  subSubscribe: 'commissionChange/submitConsultSubscribe',
};

const mapStateToProps = state => ({
  // empInfo:
  empInfo: state.app.empInfo,
  subDetail: state.commissionChange.subscribeDetailToChange,
  threeMatchInfo: state.commissionChange.threeMatchInfo,
  subscribelProList: state.commissionChange.subscribelProList,
  // 咨询订阅提交后返回的id
  consultSubId: state.commissionChange.consultSubId,
  // 审批人员列表
  approvalUserList: state.commission.approvalUserList,
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
  // 获取修改页面咨讯订阅可选产品列表
  getSubscribelProList: getDataFunction(false, effects.subscribelProList),
  // 咨询订阅提交
  submitSub: getDataFunction(false, effects.subSubscribe),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class RejectionAndAmendment extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 咨讯订阅修改相关
    subDetail: PropTypes.object.isRequired,
    threeMatchInfo: PropTypes.object.isRequired,
    subscribelProList: PropTypes.array.isRequired,
    consultSubId: PropTypes.string.isRequired,
    getSubscribeDetail: PropTypes.func.isRequired,
    getAprovalUserList: PropTypes.func.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    getSubscribelProList: PropTypes.func.isRequired,
    submitSub: PropTypes.func.isRequired,
    approvalUserList: PropTypes.array.isRequired,
  }

  static defaultProps = {
  }

  // 判断当前是哪个驳回修改页面
  @autobind
  judgeSubtypeNow() {
    const { location: { query: { type } } } = this.props;
    if (type === 'SINGLE') {
      // 单佣金
      // TODO 等待单佣金修改组件完成
      return null;
    } else if (type === 'SUBSCRIBE') {
      // 咨讯订阅
      const {
        subDetail,
        threeMatchInfo,
        subscribelProList,
        consultSubId,
        getSubscribeDetail,
        getAprovalUserList,
        queryThreeMatchInfo,
        getSubscribelProList,
        submitSub,
        approvalUserList,
      } = this.props;
      return (
        <SubscribDeatilChange
          getSubscribeDetailToChange={getSubscribeDetail}
          subscribeDetailToChange={subDetail}
          getSubscribelProList={getSubscribelProList}
          subscribelProList={subscribelProList}
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
      <div>
        {
          this.judgeSubtypeNow()
        }
      </div>
    );
  }
}
