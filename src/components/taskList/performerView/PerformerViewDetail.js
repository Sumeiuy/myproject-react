/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import BasicInfo from './BasicInfo';
import ServiceImplementation from './ServiceImplementation';

import styles from './performerViewDetail.less';

export default class PerformerViewDetail extends PureComponent {

  static propTypes = {
    basicInfo: PropTypes.object.isRequired,
    isFold: PropTypes.bool.isRequired,
  }

  render() {
    const {
      basicInfo,
      isFold,
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
          {`编号${missionId || '--'} ${missionName || '--'}: ${missionStatusName || '--'}`}
          {hasSurvey ? <a className={styles.survey}>任务问卷调查</a> : null}
        </p>
        <BasicInfo
          isFold={isFold}
          {...otherProps}
        />
        <ServiceImplementation {...this.props} />
      </div>
    );
  }
}
