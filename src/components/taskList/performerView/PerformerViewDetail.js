/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PropTypes, PureComponent } from 'react';

import BasicInfo from './BasicInfo';
import TargetCustomer from './TargetCustomer';
import ServiceRecord from './ServiceRecord';

import styles from './performerViewDetail.less';

export default class PerformerViewDetail extends PureComponent {

  static propTypes = {
    basicInfo: PropTypes.object.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object,
  }

  static defaultProps = {
    dict: {},
  };

  render() {
    const {
      basicInfo,
      dict,
      addServeRecord,
      isReadOnly,
    } = this.props;

    const {
      taskId,
      taskName,
      taskStatusName,
      hasSurvey,
      ...otherProps
    } = basicInfo;
    return (
      <div className={styles.performerViewDetail}>
        <p className={styles.taskTitle}>
          {`编号${taskId} ${taskName}: ${taskStatusName}`}
          {hasSurvey ? <a className={styles.survey}>任务问卷调查</a> : null}
        </p>
        <BasicInfo {...otherProps} />
        <TargetCustomer />
        <ServiceRecord
          dict={dict}
          addServeRecord={addServeRecord}
          isReadOnly={isReadOnly}
        />
      </div>
    );
  }
}
