/*
 * @Author: zhangjun
 * @Date: 2018-09-17 10:27:33
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-17 15:38:13
 * @description 投顾空间新建表单确认
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import InfoItem from '../common/infoItem';
import styles from './confirmForm.less'

const dateFormat = 'YYYY年MM月DD日';
const EMPTY_INFO = '--';

export default class ConfirmForm  extends PureComponent {
  static propTypes = {
    formData: PropTypes.object.isRequired,
  }
  render() {
    const {
      formData: {
        orderDate,
        // 智慧前厅名称
        roomName,
        // 智慧前厅区域名称
        siteName,
        // 开始时间
        startTime,
        // 结束时间
        endTime,
        // 参与人
        participant: {
          participantCode,
          participantName,
        },
        // 是否是外部客户，false表示不是外部客户，true表示是外部客户，默认是false
        outerPersonFlag,
        // 主题
        theme,
        // 备注
        remark,
      }
    } = this.props;
    const orderTime = `${moment(orderDate).format(dateFormat)} ${startTime}-${endTime}`;
    const room = `${siteName}${roomName}`;
    const participantDate = outerPersonFlag ? participantName : `${participantName}（${participantCode}）`;
    return (
      <div className={styles.confirmForm}>
        <div className={styles.coloumn}>
          <div className={styles.label}>
            预约时间
            <span className={styles.colon}>:</span>
          </div>
          <div className={styles.value}>
            {orderTime || EMPTY_INFO}
          </div>
        </div>
        <div className={styles.coloumn}>
          <div className={styles.label}>
            智慧前厅
            <span className={styles.colon}>:</span>
          </div>
          <div className={styles.value}>
            {room || EMPTY_INFO}
          </div>
        </div>
        <div className={styles.coloumn}>
          <div className={styles.label}>
            主题
            <span className={styles.colon}>:</span>
          </div>
          <div className={styles.value}>
            {theme || EMPTY_INFO}
          </div>
        </div>
        <div className={styles.coloumn}>
          <div className={styles.label}>
            参与人
            <span className={styles.colon}>:</span>
          </div>
          <div className={styles.value}>
            {participantDate || EMPTY_INFO}
          </div>
        </div>
        <div className={styles.coloumn}>
          <div className={styles.label}>
            备注
            <span className={styles.colon}>:</span>
          </div>
          <div className={styles.value}>
            {remark || EMPTY_INFO}
          </div>
        </div>
      </div>
    )
  }
}
