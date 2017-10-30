/**
 * @file common/mouseWheel.js
 *  添加滚动轴时间监听，解决内部滚动问题
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { addWheelEvent, removeWheelEvent } from '../../utils/helper';

export default (options = {}) => (ComposedComponent) => {
  const { container = '.react-app', eventDom = '' } = options;

  class HOCComponent extends PureComponent {

    componentDidMount() {
      this.bindMousewheel();
    }

    componentDidUpdate() {
      this.bindMousewheel();
    }

    componentWillUnmount() {
      this.unbindMousewheel();
    }

    bindMousewheel() {
      const app = document.querySelector(container);
      addWheelEvent(app, this.handleMousewheel);
    }

    @autobind
    handleMousewheel() {
      const dropDown = document.querySelector(eventDom);
      if (!dropDown) {
        return;
      }
      this.addDropDownMouseWheel();
      // const evt = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
      // ie11 不支持直接 new MouseEvent
      const evt = document.createEvent('MouseEvent');
      evt.initEvent('mousedown', true, true);
      document.querySelector(container).dispatchEvent(evt);
    }

    @autobind
    handleDropDownMousewheel(e = window.event) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
    }

    @autobind
    addDropDownMouseWheel() {
      const elem = document.querySelector(eventDom);
      if (elem) {
        addWheelEvent(elem, this.handleDropDownMousewheel);
      }
    }

    unbindMousewheel() {
      const elem = document.querySelector(eventDom);
      const app = document.querySelector(container);
      if (elem) {
        removeWheelEvent(elem, this.handleDropDownMousewheel);
      }
      if (app) {
        removeWheelEvent(app, this.handleMousewheel);
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  return HOCComponent;
};
