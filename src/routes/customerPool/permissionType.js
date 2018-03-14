/**
 * 目标客户池首页和列表页权限类型
 */
import { permission } from '../../helper';

import {
  NOPERMIT,
  PERMITS1,
  // 任务管理岗
  PERMITS2,
  // 首页指标查看
  PERMITS3,
} from './config';

const permissionType = () => {
  // 首页指标查询或者任务管理岗职责
  const permission0 = permission.hasCustomerPoolPermission();
  // 总部-营销活动管理岗,分中心-营销活动管理岗
  const permission1 = permission.hasHqMampPermission() || permission.hasBoMampPermission();
  // HTSC任务管理岗 控制绩效数据的客户范围展示
  // 默认展示组织机构树中的第一个组织机构的数据
  const permission2 = permission.hasTkMampPermission();
  // 首页指标查询职责
  const permission3 = permission.hasIndexViewPermission();
  /**
   * 当前用户的权限类型
   * NOPERMIT 表示当前用户没有目标客户池的权限
   * PERMITS1 表示当前用户有‘HTSC 任务管理岗’或者‘首页指标查询权限’
   */
  let permit = NOPERMIT;
  if (permission0) {
    permit = PERMITS1;
  }

  // 任务管理岗，2
  let permit2 = NOPERMIT;
  if (permission2) {
    permit2 = PERMITS2;
  }

  // 首页指标查询，3
  let permit3 = NOPERMIT;
  if (permission3) {
    permit3 = PERMITS3;
  }

  return {
    customerPoolPermit: permit,
    view360Permit: permission1,
    customerPoolPermit2: permit2,
    customerPoolPermit3: permit3,
  };
};

export default permissionType;
