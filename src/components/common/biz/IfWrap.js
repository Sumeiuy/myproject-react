/*
 * @Author: sunweibin
 * @Date: 2018-11-15 13:20:28
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-10 11:06:50
 * @description 判断是否渲染子组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import PlaceHolderImage from '../placeholderImage';

const IfWrap = (props) => {
  const {
    isRender,
    isUsePlaceholderImage,
    title,
    size,
    style,
  } = props;
  if (!isRender) {
    if (isUsePlaceholderImage) {
      return (
        <PlaceHolderImage
          title={title}
          size={size}
          style={style}
        />
      );
    }
    return null;
  }
  return props.children;
};

IfWrap.propTypes = {
  // 是否渲染
  isRender: PropTypes.bool.isRequired,
  // 是否使用暂无数据图片，默认是false
  isUsePlaceholderImage: PropTypes.bool,
  // 标题，默认为暂无数据
  title: PropTypes.string,
  // 展位图大小, small|normal|large=>30|60|100
  size: PropTypes.string,
  // 辅助的styles
  style: PropTypes.object,
};

IfWrap.defaultProps = {
  isUsePlaceholderImage: false,
  title: '暂无数据',
  size: 'normal',
  style: {},
};

export default IfWrap;
