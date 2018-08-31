/**
 * @Author: sunweibin
 * @Date: 2018-06-11 14:56:51
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-31 10:02:37
 * @description 线上销户表单项
 */
import React from 'react';
import PropTypes from 'prop-types';

import styles from './infoCell.less';

export default function InfoCell(props) {
  const { children, label, labelWidth, required } = props;
  return (
    <div className={styles.custSelectLine}>
      <div className={styles.requiredSelectItem} style={{ width: labelWidth }}>
        {required ? (<span className={styles.required}>*</span>) : null}
        <span className={styles.label}>{`${label}：`}</span>
      </div>
      {children}
    </div>
  );
}

InfoCell.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  labelWidth: PropTypes.number,
  required: PropTypes.bool,
};

InfoCell.defaultProps = {
  labelWidth: 124,
  required: true,
  children: null,
};
