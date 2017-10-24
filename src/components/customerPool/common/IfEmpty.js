/**
 * @file components/customerPool/common/IfEmpty.js
 *  暂无数据组件
 * @author zhangjunli
 */
import React, { PropTypes } from 'react';

import styles from './ifEmpty.less';

function IfEmpty(props) {
  const { isEmpty, children } = props;
  if (isEmpty) {
    return <div className={styles.empty}>暂无数据</div>;
  }
  return children;
}

IfEmpty.propTypes = {
  isEmpty: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
};

export default IfEmpty;
