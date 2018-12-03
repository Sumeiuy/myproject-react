/*
 * @Author: sunweibin
 * @Date: 2018-11-15 13:20:28
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-15 13:24:10
 * @description 判断是否渲染子组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import loadingEnd from '../../../decorators/loadingEnd';

@loadingEnd
export default class IfWrap extends PureComponent {
  static propTypes = {
    // 是否渲染
    isRender: PropTypes.bool.isRequired,
  }
  render() {
    const { isRender, children } = this.props;
    if (!isRender) {
      return null;
    }
    return children;
  }
}


