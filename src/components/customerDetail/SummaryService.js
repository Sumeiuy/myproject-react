/*
 * @Author: sunweibin
 * @Date: 2018-10-15 20:43:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-05 16:08:28
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
    replace,
    location,
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
  } else if (_.isEmpty(serviceRecordType)) {
    recentServeText = `${serviceDate} ${serviceRecordTitle}`;
  } else if (_.isEmpty(serviceRecordTitle)) {
    recentServeText = `${serviceDate} ${serviceRecordType}`;
  } else {
    recentServeText = `${serviceDate} ${serviceRecordTitle}-${serviceRecordType}`;
  }

  // 定位到具体的tabPane
  const navToTabPane = (options) => {
    const { query } = location;
    replace({
      query: {
        ...query,
        ...options,
      }
    });
    // 页面定位到tabPane的位置
    document.documentElement.scrollTop = 335;
  };

  // 定位到服务记录
  const handleLastServiceDateClick = () => {
    navToTabPane({
      activeTabKey: 'serviceRecord',
    });
  };

  // 定位到业务办理
  const handleOpendServiceDetailClick = () => {
    navToTabPane({
      activeTabKey: 'businessProcessing',
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.serviceCell}>
        <div className={styles.header}>
          <span className={styles.title}>可开通业务</span>
          <span className={styles.detail} onClick={handleOpendServiceDetailClick}>详情</span>
        </div>
        <div className={styles.content} title={openBusiness || '暂无'}>{openBusiness || '暂无'}</div>
      </div>
      <div className={styles.serviceCell}>
        <div className={styles.header}>
          <span className={styles.title}>最近一次服务</span>
          <span className={styles.detail} onClick={handleLastServiceDateClick}>详情</span>
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
  replace: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};
SummaryService.defaultProps = {
  openBusiness: '',
  recentServe: {},
  recentLoginZL: '',
};
