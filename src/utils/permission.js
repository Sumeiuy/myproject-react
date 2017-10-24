/**
 * @file utils/permission.js
 *  获取权限
 * @author 汪俊俊
 */
import _ from 'lodash';

let permissionList = [];

const HTSC_RESPID = '1-46IDNZI'; // 首页指标查询匹配值

const permission = {
  // 初始化
  init(list) {
    permissionList = list;
  },

  // HTSC 首页指标查询 权限
  hasIndexViewPermission() {
    const index = _.findIndex(permissionList, item => (item.respId === HTSC_RESPID));
    return index >= 0;
  },

};

export default permission;
