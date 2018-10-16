/*
 * @Author: sunweibin
 * @Date: 2018-10-16 08:50:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 18:11:01
 * @description 新版客户360详情交易数据中比例展示Cell
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Popover } from 'antd';

import Icon from '../common/Icon';

import styles from './cell.less';

export default function RateCell(props) {
  const { title, content, rate } = props;
  // 如果是小于0的值显示绿色，如果是大于等于0的值显示红色
  const isAsc = rate >= 0;
  const ascCls = cx({
    [styles.asc]: isAsc,
    [styles.desc]: !isAsc,
  });
  // 提示信息
  const tips = isAsc ? `与去年同期相比增长${rate}` : `与去年同期相比下降${rate}`;
  return (
    <div className={styles.item}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>
        <span>{content}</span>
        <span>{ isAsc ? (<Icon type="zhang" className={ascCls} />) : (<Icon type="die" className={ascCls} />) }</span>
        <span className={ascCls}>{rate}</span>
        <span>
          <Popover overlayClassName={styles.labelPopover} content={tips} trigger="click">
            <Icon className={styles.tishi} type="tishi"/>
          </Popover>
        </span>
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
