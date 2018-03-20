/*
 * @Description: 为组件设置全屏的高度，并在卸载时取消高度
 * @Author: LiuJianShu
 * @Date: 2018-01-08 13:50:37
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2018-01-08 14:37:59
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

import { dom, env } from '../helper';

const config = {
  container: '#container', // 需要设置高度的容器
  content: '#content', // 需要设置高度的容器
  utb: '#UTBContent',
};

const fspPatch = (...arg) => (ComposedComponent) => {
  /*
   * arg 可以传 'width'\'height' 等属性
   * 目前默认设置 height、margin，无需传入
   * 需要其他设置时，传入相应参数，并在 setContentStyle 中做相应更改
   */
  class FspPatchComponent extends PureComponent {

    componentDidMount() {
      // 初始化当前系统
      this.UTBContentElem = document.querySelector(config.utb);
      // 监听window.onResize事件
      window.addEventListener('resize', this.onResizeChange, false);
      this.setContentStyle(true);
    }

    componentWillUnmount() {
      // 取消监听 window.onResize 事件
      window.removeEventListener('resize', this.onResizeChange);
      this.setContentStyle(false);
    }

    // Resize事件
    @autobind
    onResizeChange() {
      this.setContentStyle(true);
    }

    // 设置 fsp content 样式
    @autobind
    setContentStyle(flag) {
      // 传入的参数
      console.log('传入的参数 arg', arg);
      // 次变量用来判断是否在FSP系统中
      let viewHeight = document.documentElement.clientHeight;
      if (env.isIE()) {
        viewHeight -= 10;
      }
      // 因为页面在开发过程中并不存在于FSP系统中，而在生产环境下是需要将本页面嵌入到FSP系统中
      // 需要给改容器设置高度，以防止页面出现滚动
      // FSP头部Tab的高度
      const fspTabHeight = 55;
      // FSP UTBContent 的 margin 值
      const UTBContentMargin = '10px 30px 10px 25px';
      // 设置新的 FSP UTBContent 的 margin 值
      const newUTBContentMargin = '0 0 0 25px';
      // 设置系统容器高度
      let pch = viewHeight;
      if (env.isInFsp()) {
        pch = viewHeight - fspTabHeight;
      }
      const pageContainer = document.querySelector(config.container);
      const pageContent = document.querySelector(config.content);
      const childDiv = pageContent.querySelector('div');
      dom.setStyle(pageContainer, 'height', flag ? `${pch}px` : 'auto');
      dom.setStyle(pageContent, 'height', flag ? '100%' : 'auto');
      dom.setStyle(childDiv, 'height', flag ? '100%' : 'auto');
      dom.setStyle(this.UTBContentElem, 'margin', flag ? newUTBContentMargin : UTBContentMargin);
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }
  return FspPatchComponent;
};
export default fspPatch;
