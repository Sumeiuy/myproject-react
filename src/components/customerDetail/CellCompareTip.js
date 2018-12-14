/*
 * @Author: sunweibin
 * @Date: 2018-12-05 14:15:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 19:32:01
 * @description 概要信息与去年同期比的提示信息组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { logCommon } from '../../decorators/logable';
import Tooltip from '../common/Tooltip';
import Icon from '../common/Icon';
import { getRateTip } from './utils';

import styles from './cell.less';

function CellCompareTip(props) {
  const {
    indicator: {
      value = 0,
      lastValue = 0,
    },
    indicatorName,
    valueType,
  } = props;

  function logClick() {
    logCommon({
      type: 'Click',
      payload: { name: `${indicatorName}指标-提示图标` }
    });
  }

  const { isAsc, rateText, tip } = getRateTip(lastValue, value, valueType === 'money');
  const ascCls = cx({
    [styles.asc]: isAsc,
    [styles.desc]: !isAsc,
  });
  // 增长还是下跌的图标
  const iconType = isAsc ? 'zhang' : 'die';

  return (
    <span>
      <span><Icon type={iconType} className={ascCls} /></span>
      <span className={ascCls}>{rateText}</span>
      <span>
        <Tooltip
          trigger="click"
          placement="top"
          content={tip}
        >
          <Icon className={styles.tishi} type="tishi" onClick={logClick} />
        </Tooltip>
      </span>
    </span>
  );
}

CellCompareTip.propTypes = {
  // 指标数据
  indicator: PropTypes.object.isRequired,
  // 指标值类型
  valueType: PropTypes.string.isRequired,
  // 指标名称
  indicatorName: PropTypes.string.isRequired,
};

export default CellCompareTip;
