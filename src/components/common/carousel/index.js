/*
 * @Author: zhangjun
 * @Descripter: 轮播跑马灯
 * @Date: 2018-11-06 13:17:05
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-06 13:33:23
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Carousel as AntCarousel } from 'antd';

export default function Carousel(props) {
  const { className } = props;
  return (
    <AntCarousel {...props} className={className} />
  );
}

Carousel.propTypes = {
  className: PropTypes.string,
};

Carousel.defaultProps = {
  className: '',
};
