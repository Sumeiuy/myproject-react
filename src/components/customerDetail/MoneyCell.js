/*
 * @Author: sunweibin
 * @Date: 2018-10-16 08:39:24
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 08:42:36
 * @description 新版客户360详情交易数据中金额的展示Cell
 */
import React from 'react';
import PropTypes from 'prop-types';

import styles from './cell.less';

export default function MoneyCell(props) {
  const { title, content } = props;
  return (
    <div className={styles.item}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>{content}</div>
    </div>
  );
}

MoneyCell.propTypes = {
  // 标题
  title: PropTypes.string.isRequired,
  // 展示内容
  content: PropTypes.string,
};

MoneyCell.defaultProps = {
  content: '',
};
