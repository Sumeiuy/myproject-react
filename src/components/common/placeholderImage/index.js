/*
 * @Author: sunweibin
 * @Date: 2018-11-23 09:07:18
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 11:18:12
 * @description 无数据的占位图
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './index.less';

function PlaceHolderImage(props) {
  const {
    title, isRender, size, style
  } = props;
  if (!isRender) {
    return null;
  }
  const imageSize = styles[size];
  const imageCls = cx({
    [styles.placeholderImage]: true,
    [imageSize]: true,
  });

  return (
    <div className={styles.placeholderContainer} style={style}>
      <div className={imageCls} />
      <div className={styles.placeholderTitle}>{title}</div>
    </div>
  );
}

PlaceHolderImage.propTypes = {
  // 是否展示
  isRender: PropTypes.bool,
  // 标题，默认为暂无数据
  title: PropTypes.string,
  // 展位图大小, small|normal|large=>30|60|100
  size: PropTypes.string,
  // 辅助的styles
  style: PropTypes.object,
};
PlaceHolderImage.defaultProps = {
  title: '暂无数据',
  size: 'normal',
  style: {},
  isRender: true,
};

export default PlaceHolderImage;
