/**
 * @file /src/decorators/selfBar.js
 * @description 自定义滚动条样式
 * @author sunweibin
 */

import React, { PureComponent } from 'react';

import { getEnv, addClass, removeClass } from '../utils/helper';
import './bar.less';

const BROWSER = getEnv();

export default (ComposedComponent) => {
  class UpdateBarableComponent extends PureComponent {
    componentDidMount() {
      const browser = BROWSER.$browser;
      const body = document.querySelector('body');
      if (browser === 'Internet Explorer') {
        // 给元素添加该class修改滚动条颜色，以避免其他页面受影响
        addClass(body, 'selfScrollBarStyleIE');
      } else {
        addClass(body, 'selfScrollBarStyle');
      }
    }
    componentWillUnmount() {
      const browser = BROWSER.$browser;
      const body = document.querySelector('body');
      if (browser === 'Internet Explorer') {
        // 给元素添加该class修改滚动条颜色，以避免其他页面受影响
        removeClass(body, 'selfScrollBarStyleIE');
      } else {
        removeClass(body, 'selfScrollBarStyle');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }
  return UpdateBarableComponent;
};
