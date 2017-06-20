/**
 * @fileOverview layouts/Loading.js
 * @author sunweibin
 */

import React, { PropTypes } from 'react';
import { Spin } from 'antd';
import { getCssStyle } from '../utils/helper';
import styles from './Loading.less';

// 首先判断wrap存在与否
const contentWrapper = document.getElementById('workspace-content');

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
        top: contentWrapper ? '55px' : '0',
        left: contentWrapper ? getCssStyle(contentWrapper, 'left') : '0',
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
