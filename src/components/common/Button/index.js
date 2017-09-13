/**
 * Button/Button.js 图标组件，封装antd-mobile提供的button样式
 * @author honggaungqing
 */
import React, { PropTypes } from 'react';
import { Button as AntButton } from 'antd';

import './index.less';

export default function Button(props) {
  const { variant } = props;
  return (
    <AntButton {...props} className={`btn-${variant}`.trim()} />
  );
}
Button.propTypes = {
  variant: PropTypes.string,
};

Button.defaultProps = {
  variant: '',
};
