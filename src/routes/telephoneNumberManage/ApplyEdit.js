/**
 * @Author: hongguangqing
 * @Descripter: 公务手机卡号申请页面
 * @Date: 2018-04-17 16:49:00
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-25 16:27:23
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import ApplyEditForm from '../../components/telephoneNumberManage/ApplyEditForm';
import { dva } from '../../helper';

const dispatch = dva.generateEffect;
// TODO: TESTFLOWID常量，仅用于自测（flowId 从location中获取，跳转的入口在FSP内）
const TESTFLOWID = '277F04385B7BFE45ABFD49D0EF615A63';
const effects = {
  // 右侧详情
  getDetailInfo: 'telephoneNumberManage/getDetailInfo',
  // 详情页面服务经理表格申请数据
  queryEmpAppBindingList: 'telephoneNumberManage/queryEmpAppBindingList',
  // 获取新建页面投顾
  queryAdvisorList: 'telephoneNumberManage/queryAdvisorList',
  // 新建页面获取下一步审批人
  queryNextApproval: 'telephoneNumberManage/queryNextApproval',
  // 获取批量投顾
  queryBatchAdvisorList: 'telephoneNumberManage/queryBatchAdvisorList',
  // 新建修改的更新接口
  updateBindingFlow: 'telephoneNumberManage/updateBindingFlow',
  // 走流程接口
  doApprove: 'telephoneNumberManage/doApprove',
  // 清除数据
  clearProps: 'telephoneNumberManage/clearProps',
};
const mapStateToProps = state => ({
  // 右侧详情数据
  detailInfo: state.telephoneNumberManage.detailInfo,
  // 服务经理表格申请数据
  empAppBindingList: state.telephoneNumberManage.empAppBindingList,
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 获取新建页面的投顾
  advisorListData: state.telephoneNumberManage.advisorListData,
  // 新建页面获取下一步审批人
  nextApprovalData: state.telephoneNumberManage.nextApprovalData,
  // 获取批量投顾
  batchAdvisorListData: state.telephoneNumberManage.batchAdvisorListData,
  // 新建修改的更新接口
  updateBindingFlowAppId: state.telephoneNumberManage.updateBindingFlowAppId,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取右侧详情信息
  getDetailInfo: dispatch(effects.getDetailInfo, { forceFull: true }),
  // 服务经理表格申请数据
  queryEmpAppBindingList: dispatch(effects.queryEmpAppBindingList, { forceFull: true }),
  // 获取新建页面的投顾
  queryAdvisorList: dispatch(effects.queryAdvisorList, { loading: false }),
  // 获取新建下一步审批人
  queryNextApproval: dispatch(effects.queryNextApproval, { forceFull: true }),
  // 获取批量投顾
  queryBatchAdvisorList: dispatch(effects.queryBatchAdvisorList, { forceFull: true }),
  // 新建修改的更新接口
  updateBindingFlow: dispatch(effects.updateBindingFlow, { forceFull: true }),
  // 走流程接口
  doApprove: dispatch(effects.doApprove, { forceFull: true }),
  // 清除数据
  clearProps: dispatch(effects.clearProps, { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class ApplyHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 服务经理表格申请数据
    empAppBindingList: PropTypes.object.isRequired,
    queryEmpAppBindingList: PropTypes.func.isRequired,
    // 新建页面获取投顾
    advisorListData: PropTypes.object.isRequired,
    queryAdvisorList: PropTypes.func.isRequired,
    // 新建页面获取下一步审批人
    nextApprovalData: PropTypes.array.isRequired,
    queryNextApproval: PropTypes.func.isRequired,
    // 获取批量投顾
    batchAdvisorListData: PropTypes.object.isRequired,
    queryBatchAdvisorList: PropTypes.func.isRequired,
    // 新建修改的更新接口
    updateBindingFlowAppId: PropTypes.string.isRequired,
    updateBindingFlow: PropTypes.func.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
    // 清除数据
    clearProps: PropTypes.func.isRequired,
  }

  static defaultProps = {
    attachmentList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { getDetailInfo, location: { query: { flowId } } } = this.props;
    const newFolwId = (flowId && !_.isEmpty(flowId)) ? flowId : TESTFLOWID;
    getDetailInfo({ flowId: newFolwId }).then(() => {
      const { appId } = this.props.detailInfo;
      this.props.queryEmpAppBindingList({
        appId,
        pageNum: 1,
        pageSize: 10,
      });
    });
  }

  render() {
    const {
      location,
      detailInfo,
      getDetailInfo,
      empAppBindingList,
      advisorListData,
      queryAdvisorList,
      nextApprovalData,
      queryNextApproval,
      batchAdvisorListData,
      queryBatchAdvisorList,
      updateBindingFlowAppId,
      updateBindingFlow,
      doApprove,
    } = this.props;
    if (_.isEmpty(detailInfo) || _.isEmpty(empAppBindingList)) {
      return null;
    }
    console.warn('empAppBindingList', empAppBindingList);
    return (
      <ApplyEditForm
        location={location}
        detailInfo={detailInfo}
        getDetailInfo={getDetailInfo}
        empAppBindingList={empAppBindingList}
        advisorListData={advisorListData}
        queryAdvisorList={queryAdvisorList}
        nextApprovalData={nextApprovalData}
        queryNextApproval={queryNextApproval}
        batchAdvisorListData={batchAdvisorListData}
        queryBatchAdvisorList={queryBatchAdvisorList}
        updateBindingFlowAppId={updateBindingFlowAppId}
        updateBindingFlow={updateBindingFlow}
        doApprove={doApprove}
      />
    );
  }
}
