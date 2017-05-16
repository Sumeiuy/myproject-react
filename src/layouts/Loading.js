/**
 * @fileOverview layouts/Loading.js
 * @author sunweibin
 */

import React, { PropTypes } from 'react';
import { Spin } from 'antd';

import styles from './Loading.less';

function Loading({
  loading,
}) {
  if (!loading) {
    return null;
  }

  return (
    <div
      className={styles.popmask}
      style={{
        height: document.documentElement.clientHeight,
      }}
    >
      <Spin tip="Loading" spinning={loading} />
    </div>
  );
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Loading;
