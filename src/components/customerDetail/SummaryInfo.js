/*
 * @Author: sunweibin
 * @Date: 2018-10-15 20:31:39
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-05 17:13:04
 * @description 客户360详情页面概要信息
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import IFWrap from '../common/biz/IfWrap';
import SummaryService from './SummaryService';
import SummaryTransaction from './SummaryTransaction';
import SummaryLabels from './SummaryLabels';

import styles from './summaryInfo.less';

export default function SummaryInfo(props) {
  const {
    data = {},
    queryAllKeyLabels,
    moreLabelInfo,
    location,
    replace,
  } = props;

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
    keyLabels,
    // 客户rowId
    custRowId,
  } = data;
  return (
    <div className={styles.summaryInfoWrap}>
      <div className={styles.leftArea}>
        <SummaryService
          openBusiness={openBusiness}
          recentServe={recentService}
          recentLoginZL={resentTenPayTime}
          replace={replace}
          location={location}
        />
      </div>
      <div className={styles.splitLine} />
      <div className={styles.middleArea}>
        <IFWrap isRender={!_.isEmpty(transactionData)}>
          <SummaryTransaction
            data={transactionData}
            custRowId={custRowId}
          />
        </IFWrap>
      </div>
      <div className={styles.splitLine} />
      <div className={styles.rightArea}>
        <SummaryLabels
          location={location}
          data={keyLabels}
          moreLabelInfo={moreLabelInfo}
          queryAllKeyLabels={queryAllKeyLabels}
        />
      </div>
    </div>
  );
}

SummaryInfo.propTypes = {
  location: PropTypes.object.isRequired,
  // 概要信息的整体数据
  data: PropTypes.object.isRequired,
  // 更多重点标签信息
  moreLabelInfo: PropTypes.object.isRequired,
  // 查询更多重点标签
  queryAllKeyLabels: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
};
