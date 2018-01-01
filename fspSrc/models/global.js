/**
 * @file models/app.js
 *  全局模型管理
 * @author maoquan(maoquan@htsc.com)
 */

export default {
  namespace: 'global',
  state: {
    // 是否阻塞tabpane的关闭，因为需要这个状态在关闭tabPane前执行一些其他操作
    isBlockRemovePane: false,
  },
  reducers: {
    handleBlockRemovePane(state) {
      return {
        ...state,
        isBlockRemovePane: !state.isBlockRemovePane,
      };
    },
  },
};
