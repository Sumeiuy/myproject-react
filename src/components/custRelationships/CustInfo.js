/**
 * @Author: sunweibin
 * @Date: 2018-06-11 15:31:11
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-14 16:26:20
 * @description 客户信息展示区域
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './custInfo.less';

export default function CustInfo(props) {
  const { cust, isCreate } = props;
  const wrapCls = cx({
    [styles.custInfoWrap]: true,
    [styles.isUpdate]: !isCreate,
  });
  return (
    <div className={wrapCls}>
      <div className={styles.custType}>
        <span className={styles.label}>客户类型：</span>
        <span className={styles.value}>{cust.custTypeLabel}</span>
      </div>
      <div className={styles.certType}>
        <span className={styles.label}>证件类型：</span>
        <span className={styles.value}>{cust.custIDTypeLabel}</span>
      </div>
      <div className={styles.certNo}>
        <span className={styles.label}>证件号码：</span>
        <span className={styles.value}>{cust.custIDNum}</span>
      </div>
    </div>
  );
}

CustInfo.propTypes = {
  cust: PropTypes.object.isRequired,
  isCreate: PropTypes.bool.isRequired,
};
