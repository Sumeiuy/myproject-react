/*
 * @Author: sunweibin
 * @Date: 2018-10-16 08:50:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-18 17:52:12
 * @description 新版客户360详情交易数据中比例展示Cell
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Popover } from 'antd';

import Icon from '../common/Icon';
import { displayMoney } from '../customerDetailAccountInfo/utils';
import { calcSameTimeRate } from './utils';
import { number } from '../../helper';

import styles from './cell.less';

export default function RateCell(props) {
  const { title, current, last, isMoney } = props;
  // 年收益率显示的百分比，所以在数据处理上需要做区分
  let newCurrentText = current;
  if (isMoney) {
    newCurrentText = displayMoney(current);
  } else {
    newCurrentText = number.convertRate(current);
  }
  // 1.首先判断什么时候显示 Tip
  let disPlayTip = true;
  if (last !== 0 && calcSameTimeRate(current, last) === 0) {
    // 当前去年同期值不等于 0 ，以及计算出来的增长率为0的时候，不显示提示
    disPlayTip = false;
  }
  // 2. 展示的比率提示信息
  let rateText = '';
  let isAsc = true;
  let tip = '';
  if (last === 0 && current >= 0) {
    rateText = '>999%';
    isAsc = true;
    tip = `去年同期0元，同比${rateText}`;
  } else if (last ===0 && current < 0) {
    rateText = '<-999%';
    isAsc = false;
    tip = `去年同期0元，同比${rateText}`;
  } else if (last ===0 && current === 0) {
    rateText = '0%';
    isAsc = false;
    tip = `去年同期0元，同比${rateText}`;
  } else {
    // 针对超大数据进行特殊处理
    const rate = calcSameTimeRate(current, last);
    const lastText = displayMoney(last);
    let actionText = '';
    if (rate > 10) {
      rateText = '>999%';
      isAsc = true;
      actionText = '增长';
    } else if (rate < -10) {
      rateText = '<-999%';
      isAsc = false;
      actionText = '下跌';
    } else {
      rateText = number.convertRate(rate);
      isAsc = rate >= 0;
      actionText = isAsc ? '增长' : '下跌';
    }
    tip = `去年同期${lastText}元，同比${actionText}${rateText}`;
  }
  const ascCls = cx({
    [styles.asc]: isAsc,
    [styles.desc]: !isAsc,
  });

  return (
    <div className={styles.item}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>
        <span>{newCurrentText}</span>
        {
          !disPlayTip
            ? null
            : (
              <span>
                <span>{ isAsc ? (<Icon type="zhang" className={ascCls} />) : (<Icon type="die" className={ascCls} />) }</span>
                <span className={ascCls}>{rateText}</span>
                <span>
                  <Popover overlayClassName={styles.labelPopover} content={tip} trigger="click">
                    <Icon className={styles.tishi} type="tishi"/>
                  </Popover>
                </span>
              </span>
            )

        }
      </div>
    </div>
  );
}

RateCell.propTypes = {
  // 标题
  title: PropTypes.string.isRequired,
  // 当前值
  current: PropTypes.number,
  // 去年同期值
  last: PropTypes.number,
  // 判断显示的值是金额还是百分比
  isMoney: PropTypes.bool,
};

RateCell.defaultProps = {
  current: 0,
  rate: 0,
  isMoney: true,
};
