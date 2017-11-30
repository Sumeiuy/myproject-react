/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BasicInfo from './BasicInfo';
import TargetCustomer from './TargetCustomer';
import ServiceRecordForm from './ServiceRecordForm';

import styles from './performerViewDetail.less';

// 客户任务所处未开始和处理中时服务记录可编辑
// 处理中 20
// 未开始  10
// 此处code码待修改
const EDITABLE = ['10', '20'];

export default class PerformerViewDetail extends PureComponent {

  static propTypes = {
    currentId: PropTypes.string.isRequired,
    basicInfo: PropTypes.object.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object,
    isFold: PropTypes.bool,
    targetCustList: PropTypes.object.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool,
    targetCustDetail: PropTypes.object.isRequired,
    parameter: PropTypes.object.isRequired,
    changeParameter: PropTypes.func.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    serviceTypeCode: PropTypes.string.isRequired,
    serviceTypeName: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
  }

  static defaultProps = {
    dict: {},
    isFold: false,
    serviceRecordData: {},
    custIncomeReqState: false,
    filesList: [],
  };

  render() {
    const {
      currentId,
      basicInfo,
      dict,
      addServeRecord,
      isFold,
      targetCustList,
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      getCustIncome,
      monthlyProfits,
      custIncomeReqState,
      targetCustDetail,
      changeParameter,
      parameter,
      parameter: { targetCustId = '' },
      queryTargetCust,
      queryCustUuid,
      custUuid,
      getCustDetail,
      serviceTypeCode,
      serviceTypeName,
      ceFileDelete,
      getCeFileList,
      filesList,
    } = this.props;
    if (_.isEmpty(dict) || _.isEmpty(basicInfo) || _.isEmpty(targetCustList)) {
      return null;
    }
    const {
      missionId,
      missionName,
      missionStatusName,
      hasSurvey,
      ...otherProps
    } = basicInfo;
    const { list = [] } = targetCustList;
    if (_.isEmpty(list)) {
      return null;
    }
    // 获取当前选中的数据的custId
    const currentCustId = targetCustId || (list[0] || {}).custId;

    const currentCustomer = _.find(list, o => o.custId === currentCustId);

    let serviceStatusName = '';
    let serviceStatusCode = '';
    let missionFlowId = '';
    if (currentCustomer) {
      serviceStatusName = currentCustomer.missionStatusCode;
      serviceStatusCode = currentCustomer.missionStatusValue;
      missionFlowId = currentCustomer.missionFlowId;
    }

    const { missionStatusCode } = targetCustDetail;

    // 处理中 和 未开始 时表单可编辑
    const isReadOnly = !_.includes(EDITABLE, missionStatusCode);
    const {
      serviceTips,
      serviceWayName,
      serviceWayCode,
      serviceDate,
      serviceRecord,
      customerFeedback,
      feedbackDate,
      attachmentRecord,
      custId,
    } = targetCustDetail;
    // 服务记录的props
    const serviceReocrd = {
      serviceTips,
      serviceWayName,
      serviceWayCode,
      serviceStatusName,
      serviceStatusCode,
      serviceDate,
      serviceRecord,
      customerFeedback,
      feedbackDate,
      attachmentRecord,
      custId,
      custUuid,
      missionFlowId,
      serviceTypeCode,
      serviceTypeName,
    };

    return (
      <div className={styles.performerViewDetail}>
        <p className={styles.taskTitle}>
          {`编号${missionId || '--'} ${missionName || '--'}: ${missionStatusName || '--'}`}
          {hasSurvey ? <a className={styles.survey}>任务问卷调查</a> : null}
        </p>
        <BasicInfo
          isFold={isFold}
          {...otherProps}
        />
        <TargetCustomer
          currentId={currentId}
          isFold={isFold}
          currentCustId={currentCustId}
          handleCollapseClick={handleCollapseClick}
          dict={dict}
          getServiceRecord={getServiceRecord}
          serviceRecordData={serviceRecordData}
          getCustIncome={getCustIncome}
          custIncomeReqState={custIncomeReqState}
          monthlyProfits={monthlyProfits}
          targetCustDetail={targetCustDetail}
          changeParameter={changeParameter}
          parameter={parameter}
          queryTargetCust={queryTargetCust}
          queryCustUuid={queryCustUuid}
          getCustDetail={getCustDetail}
          {...targetCustList}
          getCeFileList={getCeFileList}
          filesList={filesList}
        />
        <ServiceRecordForm
          dict={dict}
          addServeRecord={addServeRecord}
          isReadOnly={isReadOnly}
          isEntranceFromPerformerView
          isFold={isFold}
          queryCustUuid={queryCustUuid}
          custUuid={custUuid}
          formData={serviceReocrd}
          ceFileDelete={ceFileDelete}
        />
      </div>
    );
  }
}
