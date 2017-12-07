/*
 * @Description: 分公司客户划转 model
 * @Author: XuWenKang
 * @Date: 2017-12-06 15:13:30
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-06 15:13:30
 */
// import { contract as api, seibel as seibelApi } from '../api';
// import { emp } from '../helper';

// const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default {
  namespace: 'filialeCustTransfer',
  state: {
    custList: EMPTY_LIST, // 客户列表列表
    oldManagerList: EMPTY_LIST, // 原服务经理列表
    newManagerList: EMPTY_LIST, // 新服务经理列表
  },
  reducers: {},
  effects: {},
  subscriptions: {},
};
