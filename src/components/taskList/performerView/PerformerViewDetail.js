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

// 客户任务所处待处理和处理中时服务记录可编辑
// 处理中 106110
// 待处理  106112
// 此处code码待修改
const EDITABLE = ['106110', '106112'];

export default class PerformerViewDetail extends PureComponent {

  static propTypes = {
    currentId: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
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
    queryTargetCustDetail: PropTypes.func.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    serviceTypeCode: PropTypes.string.isRequired,
    serviceTypeName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    dict: {},
    isFold: false,
    serviceRecordData: {},
    custIncomeReqState: false,
  };

  render() {
    const {
      currentId,
      location,
      replace,
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
    // 获取当前选中的数据的custId
    const currentCustId = targetCustId || (list[0] || {}).custId;

    const { missionStatusCode } = targetCustDetail;

    // 处理中 和 待处理 时表单可编辑
    const isReadOnly = !_.includes(EDITABLE, missionStatusCode);
    const {
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
      serviceTypeCode,
      serviceTypeName,
    };
    return (
      <div className={styles.performerViewDetail}>
        <p className={styles.taskTitle}>
          {`编号${missionId} ${missionName}: ${missionStatusName}`}
          {hasSurvey ? <a className={styles.survey}>任务问卷调查</a> : null}
        </p>
        <BasicInfo
          isFold={isFold}
          {...otherProps}
        />
        <TargetCustomer
          currentId={currentId}
          isFold={isFold}
          location={location}
          replace={replace}
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
        />
        <ServiceRecordForm
          dict={dict}
          addServeRecord={addServeRecord}
          isReadOnly={isReadOnly}
          isEntranceFromPerformerView
          formData={{}}
          isFold={isFold}
          serviceReocrd={serviceReocrd}
        />
      </div>
    );
  }
}
