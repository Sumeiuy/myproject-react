/*
 * @Author: zhangjun
 * @Date: 2018-06-15 10:34:44
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-03 22:03:19
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';

import { dva } from '../../helper';
import withRouter from '../../decorators/withRouter';
import ApplyEditForm from '../../components/stockOptionEvaluation/ApplyEditForm';

const effect = dva.generateEffect;
// TODO: TESTFLOWID常量，仅用于自测（flowId 从location中获取，跳转的入口在FSP内）
const TESTFLOWID = '277F04385B7BFE45ABFD49D0EF615A63';
const effects = {
  // 右侧详情
  getDetailInfo: 'stockOptionEvaluation/getDetailInfo',
  // 附件列表
  getAttachmentList: 'stockOptionEvaluation/getAttachmentList',
  // 获取客户基本信息
  getCustInfo: 'stockOptionEvaluation/getCustInfo',
  // 获取基本信息的多个select数据
  getSelectMap: 'stockOptionEvaluation/getSelectMap',
  // 受理营业部变更
  queryAcceptOrg: 'stockOptionEvaluation/queryAcceptOrg',
  // 验证提交数据结果
  validateResult: 'stockOptionEvaluation/validateResult',
  // 编辑页面获取下一步按钮和审批人
  editButtonList: 'stockOptionEvaluation/getEditButtonList',
  // 走流程接口
  doApprove: 'stockOptionEvaluation/doApprove',
  // 新建修改的更新接口
  updateBindingFlow: 'stockOptionEvaluation/updateBindingFlow',
  // 清空数据
  clearReduxData: 'stockOptionEvaluation/clearReduxData',
};

const mapStateToProps = state => ({
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 右侧详情数据
  detailInfo: state.stockOptionEvaluation.detailInfo,
  // 附件列表
  attachmentList: state.stockOptionEvaluation.attachmentList,
  // 客户基本信息
  custInfo: state.stockOptionEvaluation.custInfo,
  // 客户类型下拉列表
  stockCustTypeList: state.stockOptionEvaluation.stockCustTypeList,
  // 申请类型下拉列表
  reqTypeList: state.stockOptionEvaluation.reqTypeList,
  // 开立期权市场类别下拉列表
  optionMarketTypeList: state.stockOptionEvaluation.optionMarketTypeList,
  // 业务受理营业部下拉列表
  busDivisionList: state.stockOptionEvaluation.busDivisionList,
  // 受理营业部变更
  acceptOrgData: state.stockOptionEvaluation.acceptOrgData,
  // 编辑页面获取下一步按钮和审批人
  editButtonListData: state.stockOptionEvaluation.editButtonListData,
  // 验证提交数据结果
  validateResultData: state.stockOptionEvaluation.validateResultData,
  // 新建修改的更新接口
  updateBindingFlowAppId: state.stockOptionEvaluation.updateBindingFlowAppId,
});

const mapDispatchToProps = {
  // 获取右侧详情信息
  getDetailInfo: effect(effects.getDetailInfo, { forceFull: true }),
  // 附件列表
  getAttachmentList: effect(effects.getAttachmentList, { forceFull: true }),
   // 获取客户基本信息
  getCustInfo: effect(effects.getCustInfo, { forceFull: true }),
  // 获取基本信息的多个select数据
  getSelectMap: effect(effects.getSelectMap, { forceFull: true }),
  // 受理营业部变更
  queryAcceptOrg: effect(effects.queryAcceptOrg, { forceFull: true }),
  // 验证提交数据结果
  validateResult: effect(effects.validateResult, { forceFull: true }),
  // 编辑页面获取下一步按钮和审批人
  getEditButtonList: effect(effects.editButtonList, { forceFull: true }),
  // 走流程接口
  doApprove: effect(effects.doApprove, { forceFull: true }),
  // 新建修改的更新接口
  updateBindingFlow: effect(effects.updateBindingFlow, { forceFull: true }),
  // 清空数据
  clearReduxData: effect(effects.clearReduxData, { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ApplyEdit extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 右侧详情数据
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 附件数据
    attachmentList: PropTypes.array,
    getAttachmentList: PropTypes.func.isRequired,
    // 客户基本信息
    custInfo: PropTypes.object.isRequired,
    getCustInfo: PropTypes.func.isRequired,
    // 客户类型下拉列表
    stockCustTypeList: PropTypes.array.isRequired,
    // 申请类型下拉列表
    reqTypeList: PropTypes.array.isRequired,
    // 开立期权市场类别下拉列表
    optionMarketTypeList: PropTypes.array.isRequired,
    // 业务受理营业部下拉列表
    busDivisionList: PropTypes.array.isRequired,
    // 获取基本信息的多个select数据
    getSelectMap: PropTypes.func.isRequired,
    // 受理营业部变更
    acceptOrgData: PropTypes.object.isRequired,
    queryAcceptOrg: PropTypes.func.isRequired,
    // 编辑页面获取下一步按钮和审批人
    editButtonListData: PropTypes.object.isRequired,
    getEditButtonList: PropTypes.func.isRequired,
    // 验证提交数据结果
    validateResultData: PropTypes.object.isRequired,
    validateResult: PropTypes.func.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
    // 新建修改的更新接口
    updateBindingFlowAppId: PropTypes.string.isRequired,
    updateBindingFlow: PropTypes.func.isRequired,
    clearReduxData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    attachmentList: [],
  }

  componentDidMount() {
    const { getDetailInfo, getSelectMap, location: { query: { flowId } } } = this.props;
    const newFolwId = (flowId && !_.isEmpty(flowId)) ? flowId : TESTFLOWID;
    getDetailInfo({ flowId: newFolwId })
      .then(() => {
        const { detailInfo, getAttachmentList } = this.props;
        const {
          attachment,
          econNum,
          custType,
        } = detailInfo;
        // 拿详情接口返回的attachmnet，调详情附件信息
        getAttachmentList({ attachment: attachment || '' });
        getSelectMap({
          econNum,
          custType,
        });
      });
  }
  render() {
    const {
      location,
      detailInfo,
      attachmentList,
      stockCustTypeList,
      optionMarketTypeList,
      reqTypeList,
      busDivisionList,
      acceptOrgData,
      queryAcceptOrg,
      editButtonListData,
      getEditButtonList,
      validateResultData,
      validateResult,
      doApprove,
      updateBindingFlowAppId,
      updateBindingFlow,
      getDetailInfo,
      clearReduxData,
    } = this.props;
    if (_.isEmpty(detailInfo)) {
      return null;
    }
    return (
      <ApplyEditForm
        location={location}
        detailInfo={detailInfo}
        attachmentList={attachmentList}
        stockCustTypeList={stockCustTypeList}
        optionMarketTypeList={optionMarketTypeList}
        reqTypeList={reqTypeList}
        busDivisionList={busDivisionList}
        acceptOrgData={acceptOrgData}
        queryAcceptOrg={queryAcceptOrg}
        editButtonListData={editButtonListData}
        getEditButtonList={getEditButtonList}
        validateResultData={validateResultData}
        validateResult={validateResult}
        doApprove={doApprove}
        updateBindingFlowAppId={updateBindingFlowAppId}
        updateBindingFlow={updateBindingFlow}
        getDetailInfo={getDetailInfo}
        clearReduxData={clearReduxData}
      />
    );
  }
}
