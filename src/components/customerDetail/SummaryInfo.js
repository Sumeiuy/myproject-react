/*
 * @Author: sunweibin
 * @Date: 2018-10-15 20:31:39
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 13:18:38
 * @description 客户360详情页面概要信息
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SummaryService from './SummaryService';
import SummaryTransaction from './SummaryTransaction';
import SummaryLabels from './SummaryLabels';

import styles from './summaryInfo.less';

export default function SummaryInfo(props) {
  const { data = {} } = props;
  if (_.isEmpty(data)) {
    return null;
  }
  const {
    // 可开通业务
    openBusiness,
    // 最近一次服务
    recentService,
    // 最近登录涨乐财富通时间
    resentTenPayTime,
    // 交易数据
    transactionData,
    // 重点标签
    keyLabel,
  } = data;
  return (
    <div className={styles.summaryInfoWrap}>
      <div className={styles.leftArea}>
        <SummaryService
          openBusiness={openBusiness}
          recentServe={recentService}
          recentLoginZL={resentTenPayTime}
        />
      </div>
      <div className={styles.splitLine}></div>
      <div className={styles.middleArea}>
        <SummaryTransaction data={transactionData} />
      </div>
      <div className={styles.splitLine}></div>
      <div className={styles.rightArea}>
        <SummaryLabels data={keyLabel} />
      </div>
    </div>
  );
}

SummaryInfo.propTypes = {
  // 概要信息的整体数据
  data: PropTypes.object.isRequired,
};
