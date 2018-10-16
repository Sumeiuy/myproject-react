/*
 * @Author: sunweibin
 * @Date: 2018-10-16 08:50:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 13:34:43
 * @description 新版客户360详情交易数据中比例展示Cell
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from '../common/Icon';

import styles from './cell.less';

export default function RateCell(props) {
  const { title, content, rate } = props;
  const isAsc = rate >=0;
  const ascCls = cx({
    [styles.asc]: isAsc,
    [styles.desc]: !isAsc,
  });

  return (
    <div className={styles.item}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>
        <span>{content}</span>
        <span>{ isAsc ? (<Icon type="zhang" className={ascCls} />) : (<Icon type="die" className={ascCls} />) }</span>
        <span className={ascCls}>{rate}</span>
      </div>
    </div>
  );
}

RateCell.propTypes = {
  // 标题
  title: PropTypes.string.isRequired,
  // 展示内容
  content: PropTypes.string,
  // 同期增长或者下跌的比率
  rate: PropTypes.string,
};

RateCell.defaultProps = {
  content: '',
  rate: '0%',
};
