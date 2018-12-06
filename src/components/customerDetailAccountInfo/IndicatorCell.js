/*
 * @Author: sunweibin
 * @Date: 2018-10-23 14:24:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-10 13:40:30
 * @description 账户概览信息展示
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Tooltip from '../common/Tooltip';
import { number, data } from '../../helper';
import { displayMoney } from './utils';

import styles from './indicatorCell.less';

export default function IndicatorCell(props) {
  const { indicator, showDesc } = props;
  if (_.isEmpty(indicator)) {
    // 如果数据为空，则不展示该指标信息
    return null;
  }

  const {
    name, description, value, valueType
  } = indicator;
  /**
   * 1. 判断指标类型,
   *   如果 valueType 为 string，表示普通字符串，则直接显示 value;
   *   如果 valueType 为 dateString, 表示时间字符串，则直接显示 value;
   *   如果 valueType 为 money, 表示数字金额，则转换成千分位，带单位
   *   如果 valueType 为 percent, 表示百分比数字，则转换成百分比字符串
   *   如果 valueType 为 permillage, 表示千分比数字，则转换成千分比字符串
   */
  let displayValue = value;
  if (valueType === 'money') {
    // 数字金额处理
    displayValue = displayMoney(Number(value));
  } else if (valueType === 'percent') {
    // 百分比数字处理
    displayValue = number.convertRate(Number(value));
  } else if (valueType === 'permillage') {
    // 千分比数字处理
    displayValue = number.convertPermillage(Number(value));
  }

  /**
   * 2. 处理指标说明信息,
   *    判断是否需要展示指标说明
   *    因为指标说明字段description
   *    含有多段文本，使用“|”分割
   */
  let showIndicatorDesc = showDesc;
  let descNode = null;
  if (showIndicatorDesc) {
    showIndicatorDesc = !_.isEmpty(description);
    const descMulitSection = _.split(description, '|');
    descNode = _.map(descMulitSection, (o) => {
      const uuid = data.uuid();
      return (<div key={uuid} className={styles.c}>{o}</div>);
    });
  }

  return (
    <div className={styles.cellWrap}>
      <div className={styles.label}>
        {
          showIndicatorDesc
            ? (<Tooltip title={descNode} placement="top">{`${name}：`}</Tooltip>)
            : `${name}：`
        }
      </div>
      <div className={styles.content}>{displayValue}</div>
    </div>
  );
}

IndicatorCell.propTypes = {
  // 指标数据
  indicator: PropTypes.object.isRequired,
  // 在存在指标说明的情况下，是否显示指标说明
  showDesc: PropTypes.bool,
};
IndicatorCell.defaultProps = {
  showDesc: true,
};
