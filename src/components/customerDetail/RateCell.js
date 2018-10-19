/*
 * @Author: sunweibin
 * @Date: 2018-10-16 08:50:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-19 14:10:57
 * @description 新版客户360详情交易数据中比例展示Cell
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Popover } from 'antd';

import Icon from '../common/Icon';
import { displayMoney } from '../customerDetailAccountInfo/utils';
import { calcSameTimeRate, getRateTipWhenLastEqual0, getRateTip } from './utils';
import { number } from '../../helper';

import styles from './cell.less';

export default function RateCell(props) {
  const { title, current, last, isMoney } = props;
  // 年收益率显示的百分比，所以在数据处理上需要做区分
  const newCurrentText = isMoney ? displayMoney(current) : number.convertRate(current);
  // 1.首先判断什么时候显示 Tip
  // 当前去年同期值不等于 0 ，以及计算出来的增长率为0的时候，不显示提示
  const ascRateEqualO = last !== 0 && calcSameTimeRate(current, last) === 0;
  // 当去年同期值和当前值都等于 0的时候也不显示
  const isAllZero = last === 0 && current === 0;
  const notDisPlayTip = ascRateEqualO || isAllZero;
  // 2. 展示的比率提示信息
  const tips = last === 0 ? getRateTipWhenLastEqual0(current) : getRateTip(last, current);
  const ascCls = cx({
    [styles.asc]: tips.isAsc,
    [styles.desc]: !tips.isAsc,
  });

  return (
    <div className={styles.item}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>
        <span>{newCurrentText}</span>
        {
          notDisPlayTip
            ? null
            : (
              <span>
                <span>{ tips.isAsc ? (<Icon type="zhang" className={ascCls} />) : (<Icon type="die" className={ascCls} />) }</span>
                <span className={ascCls}>{tips.rateText}</span>
                <span>
                  <Popover overlayClassName={styles.labelPopover} content={tips.tip} trigger="click">
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
