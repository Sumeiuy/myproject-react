/*
 * @Author: sunweibin
 * @Date: 2018-10-12 17:25:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-15 12:33:10
 * @description 负债详情每一项数据
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './debtDetail.less';

export default function DebtDetailItem(props) {
  const { title, content } = props;
  if (_.isEmpty(content)) {
    return null;
  }
  return (
    <div className={styles.item}>
      <span className={styles.label}>{`${title}:`}</span>
      <span className={styles.value}>{content}</span>
    </div>
  );
}

DebtDetailItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
};

DebtDetailItem.defaultProps = {
  content: '',
};
