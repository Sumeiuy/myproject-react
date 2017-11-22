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
    isReadOnly: PropTypes.bool.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object,
  };

  static defaultProps = {
    dict: {},
  }

  render() {
    const { isReadOnly, dict, addServeRecord } = this.props;
    return (
      <div className={styles.performerViewDetail}>
        <p className={styles.taskTitle}>
          编号123456 名称名称名称名称: 状态
        </p>
        <BasicInfo {...this.props} />
        <TargetCustomer />
        <ServiceRecord
          dict={dict}
          isReadOnly={isReadOnly}
          addServeRecord={addServeRecord}
        />
      </div>
    );
  }
}
