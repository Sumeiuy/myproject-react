/*
 * @Author: zhufeiyang
 * @Date: 2018-12-04 10:36:58
 * @Last Modified by: zhufeiyang
 * 根据effects里面的loading状态判断是否展示组件
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import hoistStatics from 'hoist-non-react-statics';

const loadingEnd = (Component) => {
  const mapStateToProps = state => ({
    interfaceState: state.loading.effects,
  });

  @connect(mapStateToProps)
  class C extends PureComponent {
    static propTypes = {
      effect: PropTypes.string,
      wrappedComponentRef: PropTypes.func,
      interfaceState: PropTypes.object.isRequired,
    }

    static defaultProps = {
      wrappedComponentRef: () => { },
      effect: '',
    }

    constructor(props) {
      super(props);
      this.isFirstRequest = true;
    }

    render() {
      const {
        effect,
        interfaceState,
        wrappedComponentRef,
        ...remainingProps
      } = this.props;

      let shouldRenderComponent = false;

      // 没有需要监听的请求，直接渲染占位图组件
      if (_.isEmpty(effect)) {
        shouldRenderComponent = true;
      }

      // 如果不是第一次请求，直接渲染占位图组件
      if (!this.isFirstRequest) {
        shouldRenderComponent = true;
      }

      // 当请求回来的时候设置不是第一次请求，shouldRenderComponent设置为true
      if (interfaceState[effect] === false) {
        this.isFirstRequest = false;
        shouldRenderComponent = true;
      }

      return (
        shouldRenderComponent
          ? (
            <Component
              {...remainingProps}
              ref={wrappedComponentRef}
            />
          )
          : (<div />)
      );
    }
  }

  return hoistStatics(C, Component);
};

export default loadingEnd;
