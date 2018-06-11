/**
 * @Author: sunweibin
 * @Date: 2018-06-11 14:56:51
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-11 17:34:17
 * @description 融资类业务客户关联关系表单项
 */
import React from 'react';
import PropTypes from 'prop-types';

import styles from './formItem.less';

export default function FormItem(props) {
  const { children, label, labelWidth } = props;
  return (
    <div className={styles.custSelectLine}>
      <div className={styles.requiredSelectItem} style={{ width: labelWidth }}>
        <span className={styles.required}>*</span>
        <span className={styles.label}>{`${label}：`}</span>
      </div>
      {children}
    </div>
  );
}

FormItem.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  labelWidth: PropTypes.number,
};

FormItem.defaultProps = {
  labelWidth: 124,
};
