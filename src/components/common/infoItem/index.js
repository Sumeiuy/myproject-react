/**
 * @description 用于显示不用修改的项的样式,
 * 左侧固定宽度，右侧不固定宽度并且内容不固定，内容永远在右侧
 * @author sunweibin
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './index.less';

export default function InfoItem(props) {
  const {
    width,
    label,
    value,
    valueColor,
    className,
    isNeedValueTitle,
    isNeedOverFlowEllipsis,
  } = props;
  const valueClassNames = classnames({
    [styles.value]: true,
    [styles.textOverFlow]: isNeedOverFlowEllipsis,
  });
  return (
    <div className={`${styles.wrap} ${className}`}>
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
        className={valueClassNames}
        style={{
          marginLeft: width,
          color: valueColor,
          width: `calc(100% - ${width})`,
        }}
        title={isNeedValueTitle ? value : ''}
      >{value}</div>
    </div>
  );
}

InfoItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  width: PropTypes.string,
  valueColor: PropTypes.string,
  className: PropTypes.string,
  // value字段是否需要展示title
  isNeedValueTitle: PropTypes.bool,
  // 是否需要value字段超出宽度打点
  isNeedOverFlowEllipsis: PropTypes.bool,
};
InfoItem.defaultProps = {
  label: '标题',
  value: '无内容',
  width: '160px',
  valueColor: '#333',
  className: '',
  isNeedValueTitle: false,
  isNeedOverFlowEllipsis: false,
};

