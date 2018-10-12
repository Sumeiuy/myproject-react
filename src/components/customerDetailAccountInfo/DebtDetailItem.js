/*
 * @Author: sunweibin
 * @Date: 2018-10-12 17:25:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-12 17:31:01
 * @description 负债详情每一项数据
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './debtDetail.less';

export default function DebtDetailItem(props) {
  const { title, value } = props;
  if (_.isEmpty(value)) {
    return null;
  }
  return (
    <div className={styles.item}>
      <span className={styles.label}>{`${title}:`}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

DebtDetailItem.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

DebtDetailItem.defaultProps = {
  value: '',
};
