/**
 * @description 用于显示不用修改的项的样式,
 * 左侧固定宽度，右侧不固定宽度并且内容不固定，内容永远在右侧
 * @author sunweibin
 */

import React, { PropTypes } from 'react';

import styles from './index.less';

export default function InfoItem(props) {
  const { width, label, value } = props;
  return (
    <div className={styles.wrap}>
      <div
        className={styles.label}
        style={{
          width,
          marginRight: `-${width}`,
        }}
      >
        {label}<span className={styles.colon}>:</span>
      </div>
      <div
        className={styles.value}
        style={{
          marginLeft: width,
        }}
      >{value}</div>
    </div>
  );
}

InfoItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  width: PropTypes.string,
};
InfoItem.defaultProps = {
  label: '标题',
  value: '无内容',
  width: '160px',
};

