/*
 * @Author: sunweibin
 * @Date: 2018-10-15 20:43:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 10:55:50
 * @description 客户360详情左侧服务记录信息
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './summaryService.less';

export default function SummaryService(props) {
  const {
    openBusiness,
    recentServe,
    recentLoginZL,
  } = props;
  // 最近一次服务的文本
  const recentServeText = _.isEmpty(recentServe)
    ? ''
    : `${recentServe.serviceDate} ${recentServe.serviceRecordType}-${recentServe.serviceRecordTitle}`;
  return (
    <div className={styles.wrap}>
      <div className={styles.serviceCell}>
        <div className={styles.header}>
          <span className={styles.title}>可开通业务</span>
          <span className={styles.detail}>详情</span>
        </div>
        <div className={styles.content}>{openBusiness}</div>
      </div>
      <div className={styles.serviceCell}>
        <div className={styles.header}>
          <span className={styles.title}>最近一次服务</span>
          <span className={styles.detail}>详情</span>
        </div>
        <div className={styles.content}>{recentServeText}</div>
      </div>
      <div className={styles.serviceCell}>
        <div className={styles.header}>
          <span className={styles.title}>最近登录涨乐财富通</span>
        </div>
        <div className={styles.content}>{recentLoginZL}</div>
      </div>
    </div>
  );
}

SummaryService.propTypes = {
  openBusiness: PropTypes.string,
  recentServe: PropTypes.object,
  recentLoginZL: PropTypes.string,
};
SummaryService.defaultProps = {
  openBusiness: '',
  recentServe: {},
  recentLoginZL: '',
};
