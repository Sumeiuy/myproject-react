/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-06 10:36:58
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-19 13:37:14
 * 恢复页面跳转之后的scrollTop
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import hoistStatics from 'hoist-non-react-statics';
import { fspContainer } from '../config';

const HOCComponent = (ComposedComponent) => {
  class C extends PureComponent {
    static propTypes = {
      wrappedComponentRef: PropTypes.func,
    };

    static defaultProps = {
      wrappedComponentRef: () => {},
    };

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
      return <ComposedComponent {...this.props} ref={this.props.wrappedComponentRef} />;
    }
  }

  return hoistStatics(C, ComposedComponent);
};

export default HOCComponent;

