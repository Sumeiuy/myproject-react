/**
 * @file components/commissionAdjustment/ApprovalRecordBoard.js
 * @description 佣金调整详情页面审批记录弹出层
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import InfoTitle from '../common/InfoTitle';
import ApprovalRecord from './ApprovalRecord';
import styles from './approvalRecordBoard.less';

export default class ApprovalRecordBoard extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    cust: PropTypes.object,
    record: PropTypes.array,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    cust: {},
    record: [],
    onClose: () => {},
  }

  @autobind
  closeModal() {
    this.props.onClose();
  }

  render() {
    const { visible, cust, record } = this.props;
    if (_.isEmpty(cust) || _.isEmpty(record)) {
      return null;
    }
    const basicInfo = `${cust.custName}(${cust.econNum})-${cust.custLevel}`;
    const orgInfo = cust.openAccDept;
    const statusInfo = cust.status;
    const infoCls = classnames({
      [styles.text]: true,
      [styles.textbox]: true,
    });
    return (
      <CommonModal
        title="审批记录"
        needBtn={false}
        maskClosable={false}
        size="normal"
        visible={visible}
        closeModal={this.closeModal}
      >
        <div className={styles.approvalBox}>
          <div className={styles.custInfo}>
            <span className={infoCls}>{basicInfo}</span>
            <span className={infoCls}>{orgInfo}</span>
            <span className={infoCls}>
              <span className={styles.statusLabel}>状态: </span>{statusInfo}
            </span>
          </div>
          <InfoTitle head="审批记录" />
          <div className={styles.recordBox}>
            {
              record.map(item => (<ApprovalRecord record={item} />))
            }
          </div>
        </div>
      </CommonModal>
    );
  }
}
