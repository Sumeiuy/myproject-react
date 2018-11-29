/*
 * @Author: yuanhaojie
 * @Date: 2018-11-23 09:51:00
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-29 10:09:36
 * @Description: 服务订单流水详情-审批
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import styles from './orderApproval.less';

const DATE_FORMAT_STR = 'YYYY/MM/DD';
const DEFAULT_SHOW_VALUE = '--';
// 当值为空时，设置默认显示
function ensureShow(item) {
  return item === null || item === undefined ? DEFAULT_SHOW_VALUE : item;
}

export default function OrderApproval(props) {
  const {
    approvalInfo: {
      currStep,
      currHandlerName,
      approveMessages,
    }
  } = props;

  return (
    <div className={styles.orderApprovalWrap}>
      <div className={styles.current}>
        <span className={styles.hint}>当前步骤：</span>
        <span>{ensureShow(currStep)}</span>
        <span className={styles.hint}>当前审批人：</span>
        <span>{ensureShow(currHandlerName)}</span>
      </div>
      <div className={styles.approvalList}>
        {
          _.map(approveMessages, (item, index) => {
            const {
              handlerName,
              handleTime,
              stepName,
              comments,
            } = item;
            const timeStr = moment(handleTime).format(DATE_FORMAT_STR);
            const basicInfo = `审批人：${handlerName}于${timeStr}，步骤名称：${stepName}`;
            return (
              <div className={styles.approval} key={`${stepName}${index}`}>
                <div className={styles.basicInfo}>
                  {basicInfo}
                </div>
                <div>
                  {ensureShow(comments)}
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

OrderApproval.propTypes = {
  approvalInfo: PropTypes.object.isRequired,
};
