/**
 * 目标客户池首页和列表页权限类型
 */
import { permission } from '../../utils';

import {
  NOPERMIT,
  PERMITS1,
  PERMITS2,
} from './config';

const permissionType = () => {
  // 总部-营销活动管理岗,分公司-营销活动管理岗,控制绩效数据的客户范围展示
  // 默认展示组织机构树中的第一个组织机构的数据
  const permission1 = permission.hasCustomerPoolPermission();
  // HTSC 首页指标查询， HTSC 营销活动-营业部执行岗,控制绩效数据的客户范围展示
  // 默认展示 '我的客户' 的数据
  const permission2 = permission.hasIndexViewPermission() || permission.hasBdMampPermission();
  /**
   * 当前用户的权限类型
   * NOPERMIT 表示当前用户没有目标客户池的权限
   * PERMITS1 表示当前用户有 ‘HTSC 营销活动-总部执行岗’ 和 ‘HTSC 营销活动-分中心管理岗’
   * PERMITS2 表示当前用户有 ‘HTSC 首页指标查询’ 和 ‘HTSC 营销活动-营业部执行岗’
   * 默认没有权限
   * 先判断是否有‘HTSC 首页指标查询’ 和 ‘HTSC 营销活动-营业部执行岗’权限
   * 再判断有‘HTSC 营销活动-总部执行岗’ 和 ‘HTSC 营销活动-分中心管理岗’权限
   */
  let permit = NOPERMIT;
  if (permission2) {
    permit = PERMITS2;
  }
  if (permission1) {
    permit = PERMITS1;
  }
  return permit;
};

export default permissionType;
