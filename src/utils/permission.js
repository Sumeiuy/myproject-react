/**
 * @file utils/permission.js
 *  获取权限
 * @author 汪俊俊
 */
import _ from 'lodash';

let permissionList = [];

const HTSC_RESPID = '1-46IDNZI'; // HTSC 首页指标查询
const HTSC_HQ_MAMPID = '1-444BAC8'; // HTSC 总部-营销活动管理岗
const HTSC_BO_MAMPID = '1-444BAC2'; // HTSC 分公司-营销活动管理岗
const HTSC_BD_MAMPID = '1-444BAC5'; // HTSC 营业部-营销活动管理岗

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

  // HTSC 总部-营销活动管理岗
  hasHqMampPermission() {
    return judgeAuthority(permissionList, HTSC_HQ_MAMPID);
  },

  // HTSC 分公司-营销活动管理岗
  hasBoMampPermission() {
    return judgeAuthority(permissionList, HTSC_BO_MAMPID);
  },

  // HTSC 营业部-营销活动管理岗
  hasBdMampPermission() {
    return judgeAuthority(permissionList, HTSC_BD_MAMPID);
  },

};

export default permission;
