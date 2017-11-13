/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-06 10:36:58
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-06 10:37:44
 * 恢复页面跳转之后的scrollTop
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { fspContainer } from '../../../config';

export default (ComposedComponent) => {
  class HOCComponent extends PureComponent {
    componentDidMount() {
      // 恢复scrollTop
      const fsp = document.querySelector(fspContainer.container);
      if (fsp) {
        fsp.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
    }

    /**
     * 获得被包裹的组件
     */
    @autobind
    getWrappedInstance() {
      return this.wrappedInstance;
    }

    @autobind
    setWrappedInstance(ref) {
      this.wrappedInstance = ref;
    }

    render() {
      return (
        <ComposedComponent {...this.props} ref={this.setWrappedInstance} />
      );
    }
  }

  return HOCComponent;
};
