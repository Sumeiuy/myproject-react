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
 *  type可选值为 primary dashed danger或者不设
 *  size可选值为 small large 或者不设
 *  loading设置按钮载入状态
 *  variant:不必要，按钮有特殊需求的时候通过variant传一个参数过来
 * @author honggaungqing
 */
import React, { PropTypes } from 'react';
import { Button as AntButton } from 'antd';

import './index.less';

export default function Button(props) {
  const { variant } = props;
  return (
    <div className="commonBtn">
      <AntButton {...props} className={`btn-${variant}`.trim()} />
    </div>
  );
}
Button.propTypes = {
  variant: PropTypes.string,
};

Button.defaultProps = {
  variant: '',
};
