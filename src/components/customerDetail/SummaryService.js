/*
 * @Author: sunweibin
 * @Date: 2018-10-15 20:43:07
 * @Last Modified by: zhangmei
 * @Last Modified time: 2018-10-19 14:34:16
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
  const {
    serviceDate,
    serviceRecordTitle,
    serviceRecordType,
  } = recentServe;
  let recentServeText = '暂无';
  if (_.isEmpty(serviceDate)) {
    recentServeText = '暂无';
  } else if ( _.isEmpty(serviceRecordType)) {
    recentServeText = `${serviceDate} ${serviceRecordTitle}`;
  } else if (_.isEmpty(serviceRecordTitle)) {
    recentServeText = `${serviceDate} ${serviceRecordType}`;
  } else {
    recentServeText = `${serviceDate} ${serviceRecordTitle}-${serviceRecordType}`;
  }
  return (
    <div className={styles.wrap}>
      <div className={styles.serviceCell}>
        <div className={styles.header}>
          <span className={styles.title}>可开通业务</span>
          <span className={styles.detail}>详情</span>
        </div>
        <div className={styles.content} title={openBusiness || '暂无'}>{openBusiness || '暂无'}</div>
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
        <div className={styles.content}>{recentLoginZL || '暂无'}</div>
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
