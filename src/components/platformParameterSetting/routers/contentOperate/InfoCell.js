/**
 * @Author: zhangjun
 * @Date: 2018-06-11 14:56:51
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-09 10:22:55
 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './infoCell.less';

export default function InfoCell(props) {
  const { children, label, labelWidth, required, className } = props;
  const infoCellStyles = classnames([styles.infoCell, className]);
  return (
    <div className={infoCellStyles}>
      <div className={styles.requiredSelectItem} style={{ width: labelWidth }}>
        {required ? (<span className={styles.required}>*</span>) : null}
        <span className={styles.label}>{`${label}：`}</span>
      </div>
      {children}
    </div>
  );
}

InfoCell.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  labelWidth: PropTypes.number,
  required: PropTypes.bool,
  className: PropTypes.string,
};

InfoCell.defaultProps = {
  labelWidth: 96,
  required: false,
  className: '',
};
