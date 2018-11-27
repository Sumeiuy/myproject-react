/*
 * @Author: sunweibin
 * @Date: 2018-11-27 11:19:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 11:22:56
 * @description 渲染无数据图片展位图
 */
import React from 'react';
import PropTypes from 'prop-types';

import PlaceHolderImage from './index';

function PlaceHolder(props) {
  const { isRender, children, ...restProps } = props;
  if (isRender) {
    return (<PlaceHolderImage {...restProps} isRender />);
  }
  return children;
}

PlaceHolder.propTypes = {
  isRender: PropTypes.bool,
};
PlaceHolder.defaultProps = {
  isRender: true,
};

export default PlaceHolder;


