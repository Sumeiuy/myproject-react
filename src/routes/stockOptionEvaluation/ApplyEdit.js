/*
 * @Author: zhangjun
 * @Date: 2018-06-15 10:34:44
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-15 17:42:02
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
  stockCustTypeMap: state.stockOptionEvaluation.stockCustTypeMap,
  // 申请类型下拉列表
  reqTypeMap: state.stockOptionEvaluation.reqTypeMap,
  // 开立期权市场类别下拉列表
  klqqsclbMap: state.stockOptionEvaluation.klqqsclbMap,
  // 业务受理营业部下拉列表
  busDivisionMap: state.stockOptionEvaluation.busDivisionMap,
  // 受理营业部变更
  acceptOrgData: state.stockOptionEvaluation.acceptOrgData,
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
    stockCustTypeMap: PropTypes.array.isRequired,
    // 申请类型下拉列表
    reqTypeMap: PropTypes.array.isRequired,
    // 开立期权市场类别下拉列表
    klqqsclbMap: PropTypes.array.isRequired,
    // 业务受理营业部下拉列表
    busDivisionMap: PropTypes.array.isRequired,
    // 获取基本信息的多个select数据
    getSelectMap: PropTypes.func.isRequired,
    // 受理营业部变更
    acceptOrgData: PropTypes.object.isRequired,
    queryAcceptOrg: PropTypes.func.isRequired,
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
        const { attachment } = detailInfo;
        // 拿详情接口返回的attachmnet，调详情附件信息
        getAttachmentList({ attachment: attachment || '' });
      });
    getSelectMap({ flowId: newFolwId });
  }
  render() {
    const {
      location,
      detailInfo,
      attachmentList,
      stockCustTypeMap,
      reqTypeMap,
      klqqsclbMap,
      busDivisionMap,
      acceptOrgData,
      queryAcceptOrg,
    } = this.props;
    return (
      <div>
        <ApplyEditForm
          location={location}
          detailInfo={detailInfo}
          attachmentList={attachmentList}
          stockCustTypeMap={stockCustTypeMap}
          reqTypeMap={reqTypeMap}
          klqqsclbMap={klqqsclbMap}
          busDivisionMap={busDivisionMap}
          acceptOrgData={acceptOrgData}
          queryAcceptOrg={queryAcceptOrg}
        />
      </div>
    );
  }
}
