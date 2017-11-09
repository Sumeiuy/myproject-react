/**
 * @file utils/permission.js
 *  获取权限
 * @author 汪俊俊
 */
import _ from 'lodash';

let permissionList = [];

const HTSC_RESPID = '1-46IDNZI'; // HTSC 首页指标查询
const HTSC_HQ_MAMPID = '1-FCQM-27'; // HTSC 营销活动-总部执行岗
const HTSC_BO_MAMPID = '1-FCQM-35'; // HTSC 营销活动-分中心管理岗
const HTSC_BD_MAMPID = '1-FCQM-36'; // HTSC 营销活动-营业部执行岗

const judgeAuthority = (list, id) => !!_.find(list, obj => (obj.respId === id));

const permission = {
  // 初始化
  init(list) {
    permissionList = list;
  },

  // HTSC 首页指标查询
  hasIndexViewPermission() {
    return judgeAuthority(permissionList, HTSC_RESPID);
  },

  // HTSC 营销活动-总部执行岗
  hasHqMampPermission() {
    return judgeAuthority(permissionList, HTSC_HQ_MAMPID);
  },

  // HTSC 营销活动-分中心管理岗
  hasBoMampPermission() {
    return judgeAuthority(permissionList, HTSC_BO_MAMPID);
  },

  // HTSC 营销活动-营业部执行岗
  hasBdMampPermission() {
    return judgeAuthority(permissionList, HTSC_BD_MAMPID);
  },

  // 目标客户池首页和列表页权限
  hasCustomerPoolPermission() {
    return permission.hasIndexViewPermission()
      || permission.hasHqMampPermission()
      || permission.hasBoMampPermission()
      || permission.hasBdMampPermission();
  },

  // 目标客户池创建人物权限
  hasCreateTaskPermission() {
    return permission.hasIndexViewPermission()
      || permission.hasHqMampPermission()
      || permission.hasBoMampPermission()
      || permission.hasBdMampPermission();
  },

};

export default permission;
