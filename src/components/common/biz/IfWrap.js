/*
 * @Author: sunweibin
 * @Date: 2018-11-15 13:20:28
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-15 13:24:10
 * @description 判断是否渲染子组件
 */

import PropTypes from 'prop-types';

const IfWrap = props => {
  const { isRender } = props;
  if (!isRender) {
    return null;
  }
  return props.children;
};

IfWrap.propTypes = {
  // 是否渲染
  isRender: PropTypes.bool.isRequired,
};

export default IfWrap;
