/**
   * 初始化暴露给fsp的方法
   * @param  {object} store app.store
   */

import { env, os } from '../helper';
import { fspRoutes } from '../config';

function findRoute(url) {
  return os.findBestMatch(url, fspRoutes, 'url');
}

function initFspMethod({ store, push }) {
  window.dispatch = (action) => {
    store.dispatch(action);
  };

  // 这里传递的url必须是react能识别的路由
  window.navTo = (url) => {
    const state = store.getState();
    const tmpLocation = state.routing.locationBeforeTransitions;
    if (tmpLocation
      && tmpLocation.pathname === url
      // && _.isEqual(tmpLocation.query, query)
    ) {
      return;
    }
    push(url);
  };

  // 如果当前环境不是fsp框架，就执行下面的重写操作
  if (!env.isInFsp()) {
    // 重写call之前，先将原来的call保存，暴露给juery插件
    const call = window.eb.component.SmartTab.call;
    $.fn.EBSmartTab = function (param1, param2) {
      return call($(this), param1, param2);
    };

    // 直接将原来控制tab的call方法置为空
    window.eb.component.SmartTab.call = function () { };

    // 重写所有的页面tab跳转组件
    window.eb.app = {
      // 加载fsp页面
      loadPageInTab: {
        run(url) {
          const { path } = findRoute(url);
          push({
            pathname: path,
            state: {
              url,
            },
          });
        },
      },
      loadExternSystemPage: {
        run() { },
      },
      loadPageInTabnavTo: {
        run(url) {
          push(url);
        },
      },
      loadGrayPage: {
        run(url, actionParam) {
          let finalUrl = url;
          const flag = actionParam.grayFlag;
          let method = 'loadPageInTab';
          if (flag && window[flag]) {
            method = 'loadPageInTabnavTo';
            finalUrl = actionParam.grayURL;
          }
          window.eb.app[method].run(finalUrl);
        },
      },
      loadPageInIframeTab: {
        run() { },
      },
    };
  }
}
export default initFspMethod;
