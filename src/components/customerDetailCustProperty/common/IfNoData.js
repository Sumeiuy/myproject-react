/*
 * @Author: sunweibin
 * @Date: 2018-11-26 16:35:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-26 16:38:30
 * @description 是否展示信息
 */

import React from 'react';
import PropTypes from 'prop-types';

import PlaceHolder from '../../common/placeholderImage';

function IfNoData(props) {
  const { title, children, isRender } = props;
  if (isRender) {
    // 空数据，渲染展位图
    return (<PlaceHolder title={`暂无${title}`} />);
  }
  return children;
}

IfNoData.propTypes = {
  title: PropTypes.string.isRequired,
  isRender: PropTypes.bool.isRequired,
};

export default IfNoData;


