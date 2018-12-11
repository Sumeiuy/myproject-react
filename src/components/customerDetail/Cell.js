/*
 * @Author: sunweibin
 * @Date: 2018-12-05 14:04:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 11:55:03
 * @description 新版的概要信息展示组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Tooltip from '../common/Tooltip';
import IFWrap from '../common/biz/IfWrap';
import CellCompareTip from './CellCompareTip';
import { displayMoney } from '../customerDetailAccountInfo/utils';
import { calcSameTimeRate } from './utils';
import { number, data } from '../../helper';

import styles from './cell.less';

export default function Cell(props) {
  const {
    title,
    indicator,
    valueType,
    compareTip,
    titleExtra,
  } = props;

  /**
   * 1. 首先判断是否需要展示去年同期比的提示信息
   * 如果 compareTip 为 false, 则不需要展示
   * 如果 compareTip 为 true, 则需要判断计算出来的增长率是否为0以及当期值与同期值是否都为0
   *   如果增长率为 0, 则不展示
   *   如果当期值与同期值都为0, 则不展示
   */
  let showCompareTip = compareTip;
  const {
    value = 0,
    lastValue = 0,
    description = '',
  } = indicator;
  if (compareTip) {
    const isAllZero = Number(value) === 0 && Number(lastValue) === 0;
    const ascRateEqualO = Number(lastValue) !== 0
      && calcSameTimeRate(Number(value), Number(lastValue)) === 0;
    showCompareTip = !(ascRateEqualO || isAllZero);
  }
  /**
   * 2. 判断指标值是何种类型，针对不同类型进行不同的数据处理
   */
  let content = value;
  if (valueType === 'money') {
    // 处理金额
    content = displayMoney(Number(value));
  } else if (valueType === 'percent') {
    // 处理百分比
    content = number.convertRate(Number(value));
  } else if (valueType === 'permillage') {
    // 处理千分比
    content = number.convertPermillage(Number(value));
  }

  /**
   * 3. 判断需不需要展示指标说明
   */
  const showIndicatorDesc = !_.isEmpty(description);
  /**
   * 如果需要展示指标说明，
   * 因为指标说明有可能有多段文字，接口与后端约定好，需要分段显示的使用“|”分割
   */
  const descMulitSection = _.split(description, '|');
  const descNode = _.map(descMulitSection, (desc) => {
    const uuid = data.uuid();
    return (<div key={uuid} className={styles.paragraph}>{desc}</div>);
  });

  return (
    <div className={styles.item}>
      <div className={styles.title}>
        {
          showIndicatorDesc
            ? (
              <Tooltip title={descNode} placement="bottomLeft">
                {title}
              </Tooltip>
            )
            : title
        }
        {titleExtra}
      </div>
      <div className={styles.content}>
        <span>{content}</span>
        <IFWrap isRender={showCompareTip}>
          <CellCompareTip
            indicator={indicator}
            valueType={valueType}
          />
        </IFWrap>
      </div>
    </div>
  );
}

Cell.propTypes = {
  // 指标名称
  title: PropTypes.string.isRequired,
  // 指标对象
  indicator: PropTypes.object,
  // 指标值类型
  valueType: PropTypes.string,
  // 是否展示与去年同期比提示
  compareTip: PropTypes.bool,
  // 指标名称右侧多余部分
  titleExtra: PropTypes.node,
};

Cell.defaultProps = {
  compareTip: false,
  titleExtra: null,
  valueType: 'money',
  indicator: {},
};
