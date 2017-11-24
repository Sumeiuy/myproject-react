/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
  }

  static defaultProps = {
    dict: {},
    isFold: false,
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
    } = this.props;

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
          location={location}
          replace={replace}
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
