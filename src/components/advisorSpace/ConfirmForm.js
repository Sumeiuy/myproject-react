/*
 * @Author: zhangjun
 * @Date: 2018-09-17 10:27:33
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-19 18:30:05
 * @description 投顾空间新建表单确认
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import InfoCell from './InfoCell';
import styles from './confirmForm.less';

const dateFormat = 'YYYY年MM月DD日';
const EMPTY_INFO = '--';

export default function ConfirmForm(props) {
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
  } = props;
    // 预约时间
  const orderTime = `${moment(orderDate).format(dateFormat)} ${startTime}-${endTime}`;
  // 智慧前厅
  const room = `${siteName}${roomName}`;
  // 参与人
  const participantDate = outerPersonFlag ? participantName : `${participantName}（${participantCode}）`;
  return (
    <div className={styles.confirmForm}>
      <InfoCell label="预约时间">
        <div className={styles.value}>
          {orderTime || EMPTY_INFO}
        </div>
      </InfoCell>
      <InfoCell label="智慧前厅">
        <div className={styles.value}>
          {room || EMPTY_INFO}
        </div>
      </InfoCell>
      <InfoCell label="主题">
        <div className={styles.value}>
          {theme || EMPTY_INFO}
        </div>
      </InfoCell>
      <InfoCell label="参与人">
        <div className={styles.value}>
          {participantDate || EMPTY_INFO}
        </div>
      </InfoCell>
      <InfoCell label="备注">
        <div className={styles.value}>
          {remark || EMPTY_INFO}
        </div>
      </InfoCell>
    </div>
  );
}
ConfirmForm.defaultProps = {
  formData: PropTypes.object.isRequired,
};
