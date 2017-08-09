/**
 * @file common/mouseWheel.js
 *  添加滚动轴时间监听，解决内部滚动问题
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

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
      app.addEventListener('mousewheel', this.handleMousewheel, false);
      app.addEventListener('DOMMouseScroll', this.handleMousewheel, false);
      app.addEventListener('wheel', this.handleMousewheel, false);
    }

    @autobind
    handleMousewheel() {
      const dropDown = document.querySelector(eventDom);
      if (!dropDown) {
        return;
      }
      this.addDropDownMouseWheel();
      const evt = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
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
        elem.addEventListener('mousewheel', this.handleDropDownMousewheel, false);
        elem.addEventListener('DOMMouseScroll', this.handleDropDownMousewheel, false);
        elem.addEventListener('wheel', this.handleDropDownMousewheel, false);
      }
    }

    unbindMousewheel() {
      const elem = document.querySelector(eventDom);
      const app = document.querySelector(container);
      if (elem) {
        elem.removeEventListener(
          'mousewheel',
          this.handleDropDownMousewheel,
          false,
        );
        elem.removeEventListener(
          'DOMMouseScroll',
          this.handleDropDownMousewheel,
          false,
        );
        elem.removeEventListener(
          'wheel',
          this.handleDropDownMousewheel,
          false,
        );
      }
      if (app) {
        elem.removeEventListener(
          'mousewheel',
          this.handleMousewheel,
          false,
        );
        elem.removeEventListener(
          'DOMMouseScroll',
          this.handleMousewheel,
          false,
        );
        elem.removeEventListener(
          'wheel',
          this.handleMousewheel,
          false,
        );
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
