/*
 * @Author: zhangjun
 * @Date: 2017-09-28 17:14:03
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-18 14:38:49
 */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './infoCell.less';

export default function InfoCell(props) {
  const { label, required, children, style, className } = props;
  return (
    <div className={`${styles.infoForm} ${className}`}>
      <div style={style} className={styles.infoFormLabel}>
        { required ? <i>*</i> : null }
        {label}
        <span className={styles.colon}>:</span>
      </div>
      <div className={styles.infoFormContent}>
        {children}
      </div>
    </div>
  );
}

InfoCell.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.element,
  ]),
  style: PropTypes.object,
  className: PropTypes.string,
};
InfoCell.defaultProps = {
  label: 'label',
  required: false,
  children: 'form内容区域',
  style: {},
  className: '',
};
