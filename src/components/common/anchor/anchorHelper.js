/* eslint-disable */
/** 搬运至antd/Anchor,解决导航时改变hash的问题,所以不做代码检查 */

import getScroll from 'antd/lib/_util/getScroll';
import getRequestAnimationFrame from 'antd/lib/_util/getRequestAnimationFrame';

export const reqAnimFrame = getRequestAnimationFrame();

export const easeInOutCubic = (t, b, c, d) => {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return cc / 2 * t * t * t + b;
  }
  return cc / 2 * ((t -= 2) * t * t + 2) + b;
};

export function getDefaultTarget() {
  return typeof window !== 'undefined' ?
    window : null;
}

export function getOffsetTop(element) {
  if (!element) {
    return 0;
  }

  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    const doc = element.ownerDocument;
    const docElem = doc.documentElement;
    return rect.top - docElem.clientTop;
  }

  return rect.top;
}

export function scrollTo(href, offsetTop = 0, target = getDefaultTarget, callback = () => { }) {
  const fsp = document.querySelector('#workspace-content>.wrapper');
  let scrollTopValue;
  if (fsp) {
    scrollTopValue = fsp.scrollTop;
  } else {
    scrollTopValue = getScroll(target(), true);
    console.warn('scrollTopValue', scrollTopValue);
  }
  
  const targetElement = document.getElementById(href.substring(1));
  if (!targetElement) {
    return;
  }
  const eleOffsetTop = getOffsetTop(targetElement);
  const targetScrollTop = scrollTopValue + eleOffsetTop - offsetTop;

  const startTime = Date.now();
  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    console.warn('time', time);
    // 搬了antd/Anchor判断是否在fsp中，因为fsp是自己做的滚动条
    
    if (fsp) {
      fsp.scrollTop = easeInOutCubic(time, scrollTopValue, targetScrollTop, 450);
    } else {
      window.scrollTo(window.pageXOffset, easeInOutCubic(time, scrollTopValue, targetScrollTop, 450));
    }
    
    if (time < 450) {
      reqAnimFrame(frameFunc);
    } else {
      callback();
    }
  };
  reqAnimFrame(frameFunc);
  // 搬了antd/Anchor去掉这一行
  // history.pushState(null, '', href);
}

class AnchorHelper {

  constructor() {
    this.links = [];
    this.currentAnchor = null;
    this._activeAnchor = '';
  }

  addLink(link) {
    if (this.links.indexOf(link) === -1) {
      this.links.push(link);
    }
  }

  getCurrentActiveAnchor() {
    return this.currentAnchor;
  }

  setActiveAnchor(component) {
    this.currentAnchor = component;
  }

  getCurrentAnchor(offsetTop = 0, bounds = 5) {
    let activeAnchor = '';
    if (typeof document === 'undefined') {
      return activeAnchor;
    }

    const linksPositions = (this.links
      .map(section => {
        const target = document.getElementById(section.substring(1));
        if (target && getOffsetTop(target) < offsetTop + bounds) {
          const top = getOffsetTop(target);
          if (top <= offsetTop + bounds) {
            return {
              section,
              top,
              bottom: top + target.clientHeight,
            };
          }
        }
        return null;
      })
      .filter(section => section !== null));

    if (linksPositions.length) {
      const maxSection = linksPositions.reduce((prev, curr) => curr.top > prev.top ? curr : prev);
      return maxSection.section;
    }
    return '';
  }

  scrollTo(href, offsetTop, target = getDefaultTarget, callback = () => { }) {
    scrollTo(href, offsetTop, target, callback);
  }
}

export default AnchorHelper;
