/**
 * @file /src/decorators/selfBar.js
 * @description 自定义滚动条样式
 * @author sunweibin
 */

import React, { PureComponent } from 'react';

import './bar.less';

export default (ComposedComponent) => {
  class UpdateBarableComponent extends PureComponent {
    componentDidMount() {
      // 给元素添加该class修改滚动条颜色，以避免其他页面受影响
      document.querySelector('body').classList.add('selfScrollBarStyle');
    }
    componentWillUnmount() {
      // 给元素添加该class修改滚动条颜色，以避免其他页面受影响
      document.querySelector('body').classList.remove('selfScrollBarStyle');
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }
  return UpdateBarableComponent;
};
