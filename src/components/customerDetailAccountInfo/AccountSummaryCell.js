/*
 * @Author: sunweibin
 * @Date: 2018-10-23 14:24:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-23 16:34:39
 * @description 账户概览信息展示
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { displayMoney } from './utils';

import styles from './accountSummaryCell.less';

export default function AccountSummaryCell(props) {
  const { label, content, type } = props;
  // 如果 content 为 空或者null的时候，整个不显示
  if (!_.isNumber(content) && _.isEmpty(content)) {
    // 因为数字的情况下，_.isEmpty()方法返回的也是true
    return null;
  }
  let value = content;
  // 因为返回过来的值有的是数字金额，时间字符串、普通字符串、百分比小数，所以需要根据返回的类型来修正展示的内容
  if (type === 'MONEY') {
    // 数字金额，转化成两位小数，带单位，千分位显示
    value = displayMoney(content);
  } else if (type === 'RATE') {
    value = `${content * 100}%`;
  }
  return (
    <div className={styles.cellWrap}>
      <div className={styles.label}>{`${label}：`}</div>
      <div className={styles.content}>{value}</div>
    </div>
  );
}

AccountSummaryCell.propTypes = {
  // 展示标签
  label: PropTypes.string.isRequired,
  // 展示的内容
  content: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
  // 展示内容的类型
  type: PropTypes.oneOf(['DATE','MONEY', 'RATE', 'STRING']),
};

AccountSummaryCell.defaultProps = {
  content: '',
  type: 'MONEY',
};
