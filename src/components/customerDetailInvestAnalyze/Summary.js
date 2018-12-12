/*
 * @Author: zhangjun
 * @Date: 2018-12-05 10:19:25
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-11 13:25:36
 * @description 图表下方的描述文字
 */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './summary.less';

export default function Summary(props) {
  const { children } = props;
  return (
    <div className={styles.summary}>
      {children}
    </div>
  );
}

Summary.propTypes = {
  children: PropTypes.node,
};

Summary.defaultProps = {
  children: null,
};
