/**
 * @Author: sunweibin
 * @Date: 2017-12-18 17:32:50
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-19 11:00:18
 * @description 统一整理的将dva以及redux需要暴露使用的方法
 */
import { initFspMethod } from '../utils/fspGlobal';
import permission from '../permissions';

let dvaStore = null;

const dva = {
  /**
   * 将dva生成的redux的store暴露给组件
   * @param {Object} store dva生成的redux的store树
   */
  exposeStore(store) {
    // 保存store
    dvaStore = store;
    // 将store暴露给FSP
    initFspMethod(store);
    // 初始化权限配置
    permission.init(store);
  },
  /**
   * 暴露dva的store的dispatch方法
   * @param {Object} action 传递的action
   * @param {String} action.type
   * @param {Object} action.payload
   */
  dispatch({ type, payload = {} }) {
    if (dvaStore && dvaStore.dispatch) {
      dvaStore.dispatch({ type, payload });
    } else {
      console.error('未将store暴露给组件');
    }
  },
  /**
   * 获取保存的Store
   * @returns {Object} redux的store
   */
  getStore() {
    return dvaStore;
  },
};

export default dva;
