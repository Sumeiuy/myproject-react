/**
 * @Author: sunweibin
 * @Date: 2017-11-03 20:55:19
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-03 21:11:10
 * @description 不能使用的下拉框样式
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import styles from './disabledSelect.less';

export default function DisabledSelect(props) {
  return (
    <div className={styles.disabledSelectWrap}>
      {props.text}
      <div className={styles.disabledSelectIcon}>
        <Icon type="caret-down" />
      </div>
    </div>
  );
}

DisabledSelect.propTypes = {
  text: PropTypes.string.isRequired,
};
