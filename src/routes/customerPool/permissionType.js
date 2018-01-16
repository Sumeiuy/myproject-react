/**
 * 目标客户池首页和列表页权限类型
 */
import { permission } from '../../utils';

import {
  NOPERMIT,
  PERMITS1,
} from './config';

const permissionType = () => {
  // 总部-营销活动管理岗,分中心-营销活动管理岗, HTSC 首页指标查询 控制绩效数据的客户范围展示
  // 默认展示组织机构树中的第一个组织机构的数据
  const permission1 = permission.hasCustomerPoolPermission();
  // 总部-营销活动管理岗,分中心-营销活动管理岗
  const permission2 = permission.hasHqMampPermission() || permission.hasBoMampPermission();
  /**
   * 当前用户的权限类型
   * NOPERMIT 表示当前用户没有目标客户池的权限
   * PERMITS1 表示当前用户有 ‘HTSC 营销活动-总部执行岗’ 和 ‘HTSC 营销活动-分中心管理岗’ 、HTSC 首页指标查询
   */
  let permit = NOPERMIT;
  if (permission1) {
    permit = PERMITS1;
  }
  return {
    customerPoolPermit: permit,
    view360Permit: permission2,
  };
};

export default permissionType;
