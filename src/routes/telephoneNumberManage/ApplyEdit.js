/**
 * @Author: hongguangqing
 * @Descripter: 公务手机卡号修改页面
 * @Date: 2018-04-17 16:49:00
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-05-03 10:53:13
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

const effect = dva.generateEffect;
// TODO: TESTFLOWID常量，仅用于自测（flowId 从location中获取，跳转的入口在FSP内）
const TESTFLOWID = '277F04385B7BFE45ABFD49D0EF615A63';
const effects = {
  // 右侧详情
  getDetailInfo: 'telephoneNumberManage/getDetailInfo',
  // 详情页面服务经理表格申请数据
  queryEmpAppBindingList: 'telephoneNumberManage/queryEmpAppBindingList',
  // 获取新建页面投顾
  queryAdvisorList: 'telephoneNumberManage/queryAdvisorList',
  // 获取批量投顾
  queryBatchAdvisorList: 'telephoneNumberManage/queryBatchAdvisorList',
  // 新建修改的更新接口
  updateBindingFlow: 'telephoneNumberManage/updateBindingFlow',
  // 走流程接口
  doApprove: 'telephoneNumberManage/doApprove',
  // 清除数据
  clearProps: 'telephoneNumberManage/clearProps',
  // 按钮组信息
  getButtonList: 'telephoneNumberManage/getButtonList',
  // 验证提交数据
  validateData: 'telephoneNumberManage/validateData',
  // 删除绑定的服务经理
  deleteBindingAdvisor: 'telephoneNumberManage/deleteBindingAdvisor',
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
  // 获取批量投顾
  batchAdvisorListData: state.telephoneNumberManage.batchAdvisorListData,
  // 新建修改的更新接口
  updateBindingFlowAppId: state.telephoneNumberManage.updateBindingFlowAppId,
  // 按钮组信息
  buttonList: state.telephoneNumberManage.buttonList,
  // 验证提交数据
  validateResultData: state.telephoneNumberManage.validateResultData,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取右侧详情信息
  getDetailInfo: effect(effects.getDetailInfo, { forceFull: true }),
  // 服务经理表格申请数据
  queryEmpAppBindingList: effect(effects.queryEmpAppBindingList, { forceFull: true }),
  // 获取新建页面的投顾
  queryAdvisorList: effect(effects.queryAdvisorList, { loading: false }),
  // 获取批量投顾
  queryBatchAdvisorList: effect(effects.queryBatchAdvisorList, { forceFull: true }),
  // 新建修改的更新接口
  updateBindingFlow: effect(effects.updateBindingFlow, { forceFull: true }),
  // 走流程接口
  doApprove: effect(effects.doApprove, { forceFull: true }),
  // 清除数据
  clearProps: effect(effects.clearProps, { forceFull: true }),
  // 请求按钮
  getButtonList: effect(effects.getButtonList, { forceFull: true }),
  // 验证提交数据
  validateData: effect(effects.validateData, { forceFull: true }),
  // 验证提交数据
  deleteBindingAdvisor: effect(effects.deleteBindingAdvisor, { loading: false }),
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
    // 获取按钮组
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 验证提交数据
    validateResultData: PropTypes.object.isRequired,
    validateData: PropTypes.func.isRequired,
    // 删除绑定的服务经理
    deleteBindingAdvisor: PropTypes.func.isRequired,
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
      detailInfo,
      getDetailInfo,
      empAppBindingList,
      advisorListData,
      queryAdvisorList,
      batchAdvisorListData,
      queryBatchAdvisorList,
      updateBindingFlowAppId,
      updateBindingFlow,
      doApprove,
      buttonList,
      getButtonList,
      validateResultData,
      validateData,
      deleteBindingAdvisor,
    } = this.props;
    if (_.isEmpty(detailInfo) || _.isEmpty(empAppBindingList)) {
      return null;
    }
    return (
      <ApplyEditForm
        detailInfo={detailInfo}
        getDetailInfo={getDetailInfo}
        empAppBindingList={empAppBindingList}
        advisorListData={advisorListData}
        queryAdvisorList={queryAdvisorList}
        batchAdvisorListData={batchAdvisorListData}
        queryBatchAdvisorList={queryBatchAdvisorList}
        updateBindingFlowAppId={updateBindingFlowAppId}
        updateBindingFlow={updateBindingFlow}
        doApprove={doApprove}
        buttonList={buttonList}
        getButtonList={getButtonList}
        validateResultData={validateResultData}
        validateData={validateData}
        deleteBindingAdvisor={deleteBindingAdvisor}
      />
    );
  }
}
