/*
 * @Author: yuanhaojie
 * @Date: 2018-11-22 09:54:56
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-22 15:41:48
 * @Description: 表格无数据的占位显示
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const IfTableWrap = props => {
  const {
    isRender,
    text,
    iconStyle,
    noDataStyle,
  } = props;
  if (!isRender) {
    return (
      <div className={styles.noDataWrap} style={noDataStyle}>
        <div className={styles.noDataIcon} style={iconStyle} />
        <div className={styles.noDataText}>
          {text}
        </div>
      </div>
    );
  }
  return props.children;
};

IfTableWrap.propTypes = {
  // 是否渲染
  isRender: PropTypes.bool.isRequired,
  text: PropTypes.node,
  iconStyle: PropTypes.object,
  noDataStyle: PropTypes.object,
};

export default IfTableWrap;
