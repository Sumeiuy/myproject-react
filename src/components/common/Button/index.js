/**
 * Button/index.js Button组件，封装antd-mobile提供的button
 * Usage:
 * import Button from 'xx/Button';
 * <Button
    type="primary"
    size="default"
    loading
    variant="xxx"
   >
    完成
   </Button>
 *  type,shape,size,loading,disabled等，与antd的Button组件用法相同
 *  variant:不必要，按钮有特殊需求的时候通过variant传一个参数过来
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
