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
import ServiceRecord from './ServiceRecord';

import styles from './performerViewDetail.less';

export default class PerformerViewDetail extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    basicInfo: PropTypes.object.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
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
  }

  static defaultProps = {
    dict: {},
    isFold: false,
    serviceRecordData: {},
    custIncomeReqState: false,
  };

  render() {
    const {
      location,
      replace,
      basicInfo,
      dict,
      addServeRecord,
      isReadOnly,
      isFold,
      targetCustList,
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      getCustIncome,
      monthlyProfits,
      custIncomeReqState,
    } = this.props;
    if (_.isEmpty(dict) || _.isEmpty(basicInfo) || _.isEmpty(targetCustList)) {
      return null;
    }
    console.log(this.props);
    const {
      missionId,
      missionName,
      missionStatusName,
      hasSurvey,
      ...otherProps
    } = basicInfo;
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
          isFold={isFold}
          location={location}
          replace={replace}
          handleCollapseClick={handleCollapseClick}
          dict={dict}
          getServiceRecord={getServiceRecord}
          serviceRecordData={serviceRecordData}
          getCustIncome={getCustIncome}
          custIncomeReqState={custIncomeReqState}
          monthlyProfits={monthlyProfits}
          {...targetCustList}
        />
        <ServiceRecord
          dict={dict}
          addServeRecord={addServeRecord}
          isReadOnly={isReadOnly}
        />
      </div>
    );
  }
}
