/*
 * @Author: sunweibin
 * @Date: 2018-11-20 16:20:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-23 11:23:16
 * @description 基本信息封装的原地编辑组件
 */
import React from 'react';
import PropTypes from 'prop-types';

import OmniComplexEditor from '../../common/omniComplexEditor';

import styles from './basicEditorCell.less';

export default function BasiceEditorCell(props) {
  const { className, label, width, children, ...restProps  } = props;
  return (
    <div className={`${styles.wrap} ${className}`}>
      <div
        className={styles.label}
        style={{
          width,
          marginRight: `-${width}`
        }}
        >
        {label}<span className={styles.colon}>:</span>
      </div>
      <div
        style={{
          marginLeft: width,
          width: `calc(100% - ${width})`,
          height: '32px',
        }}
      >
        <OmniComplexEditor {...restProps} editorName={label} />
      </div>
    </div>
  );
}

BasiceEditorCell.propTypes = {
  // 标签Label的宽度
  width: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  // label名称
  label: PropTypes.string.isRequired,
};
