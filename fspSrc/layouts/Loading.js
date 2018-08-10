/**
 * @file layouts/loading.js
 * 新框架下的loading
 * @author zhufeiyang
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import styles from './loading_.less';

function Loading({ loading, forceFull }) {
  if (loading <= 0 || !loading) {
    return null;
  }
  let top = '98px';
  let left = '0';
  // 新增判断如果forceFull有值，则需要判断是Y或者N，
  // 无值则按默认的方式处理
  if (forceFull) {
    // 强制全屏
    top = '0';
    left = '0';
  }

  return (
    <div
      className={styles.popmask}
      style={{ top, left }}
    >
      <Spin tip="Loading" spinning={loading > 0 || loading} />
    </div>
  );
}

Loading.propTypes = {
  loading: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
  forceFull: PropTypes.bool,
};

Loading.defaultProps = {
  forceFull: false,
};

export default Loading;
