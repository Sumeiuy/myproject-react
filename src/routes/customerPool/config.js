// 目标客户池的一些常量配置

/**
 * NOPERMIT = 0 表示当前用户没有目标客户池的权限
 * PERMITS1 = 1 表示当前用户有 ‘HTSC 营销活动-总部执行岗’ 和 ‘HTSC 营销活动-分中心管理岗’
 * PERMITS2 = 2 表示当前用户有 ‘HTSC 首页指标查询’ 和 ‘HTSC 营销活动-营业部执行岗’
 */
const NOPERMIT = 0;
const PERMITS1 = 1;
const PERMITS2 = 2;

/**
 * 根据权限判断传给后端的custType的值
 */
// 客户经理
const CUST_MANAGER = '1';
// 组织机构
const ORG = '3';

// 主服务经理id，用于url和custrange组件中，不传给后端
const MAIN_MAGEGER_ID = 'msm';

// 根据不同的url中source的值，传给后端enterType值不同
const ENTER_TYPE = {
  search: 'searchCustPool',
  tag: 'searchCustPool',
  association: 'searchCustPool',
  business: 'businessCustPool',
  custIndicator: 'performanceCustPool',
  numOfCustOpened: 'performanceCustPool',
};

export default {
  NOPERMIT,
  PERMITS1,
  PERMITS2,
  CUST_MANAGER,
  ORG,
  MAIN_MAGEGER_ID,
  ENTER_TYPE,
};
