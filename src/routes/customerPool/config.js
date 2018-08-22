// 目标客户池的一些常量配置

/**
 * NOPERMIT = 0 表示当前用户没有目标客户池的权限
 * PERMITS1 = 1 表示当前用户有 ‘HTSC任务管理岗’，‘HTSC 首页指标查询’
 */
const NOPERMIT = 0;
const PERMITS1 = 1;

/**
 * 根据权限判断传给后端的custType的值
 */
// 客户经理
const CUST_MANAGER = '1';
// 组织机构
const ORG = '3';

// 主服务经理id，用于url和custrange组件中，不传给后端
const MAIN_MAGEGER_ID = 'msm';
// 列表页主服务经理组件中下拉列表 ‘所有’ 选项的id
const ALL_DEPARTMENT_ID = 'all';

// 根据不同的url中source的值，传给后端enterType值不同
const ENTER_TYPE = {
  search: 'searchCustPool',
  tag: 'searchCustPool',
  association: 'searchCustPool',
  // 订购组合
  orderCombination: 'searchCustPool',
  // 证券产品
  securitiesProducts: 'searchCustPool',
  business: 'businessCustPool',
  custIndicator: 'performanceCustPool',
  numOfCustOpened: 'performanceCustPool',
  sightingTelescope: 'labelSearchCustPool',
  // 非理财平台
  external: 'searchCustPool',
  // 产品潜在目标客户，产品中心外部跳转
  productPotentialTargetCust: 'labelSearchCustPool',
  assetsTransactions: 'searchCustPool',
};
// 与后端约定默认的enterType
const DEFAULT_ENTER_TYPE = 'searchCustPool';

// 首页指标查询权限作用 或者 任务管理岗权限作用的入口列表
const ENTERLIST_LEFTMENU = ['leftMenu'];

// 全量的source集合
const FULL_ENTERLIST = ['search', 'tag', 'sightingTelescope', 'business', 'association', 'external',
  'orderCombination', 'securitiesProducts', 'productPotentialTargetCust', 'custIndicator', 'numOfCustOpened'];

// 任务管理岗权限作用的首页入口列表
// 新增一个产品潜在目标客户，用的HTSC 任务管理岗职责
const ENTERLIST_PERMISSION_TASK_MANAGE = ['search', 'tag', 'sightingTelescope', 'association', 'external',
  'orderCombination', 'securitiesProducts', 'productPotentialTargetCust'];

// 首页指标查询权限作用的首页入口列表
const ENTERLIST_PERMISSION_INDEX_QUERY = ['custIndicator', 'numOfCustOpened', 'assetsTransactions', 'productSale',
  'income', 'manageService', 'serviceTarget', 'custAssets', 'aggregationRate'];

// 是否需要展示客户列表瞄准镜筛选条件source集合
// 是否需要请求瞄准镜filterList的source集合
const ENTERLIST_PERMISSION_SIGHTINGLABEL = ['sightingTelescope', 'productPotentialTargetCust'];

// 是否需要展示可开通业务source集合
const ENTERLIST_PERMISSION_OPENED_BUSINESS = ['numOfCustOpened', 'business', 'sightingTelescope'];

const exported = {
  NOPERMIT,
  PERMITS1,
  CUST_MANAGER,
  ORG,
  MAIN_MAGEGER_ID,
  DEFAULT_ENTER_TYPE,
  ENTER_TYPE,
  ENTERLIST_LEFTMENU,
  ALL_DEPARTMENT_ID,
  FULL_ENTERLIST,
  ENTERLIST_PERMISSION_TASK_MANAGE,
  ENTERLIST_PERMISSION_INDEX_QUERY,
  ENTERLIST_PERMISSION_SIGHTINGLABEL,
  ENTERLIST_PERMISSION_OPENED_BUSINESS,
};

export default exported;
export {
  NOPERMIT,
  PERMITS1,
  CUST_MANAGER,
  ORG,
  MAIN_MAGEGER_ID,
  DEFAULT_ENTER_TYPE,
  ENTER_TYPE,
  ENTERLIST_LEFTMENU,
  ALL_DEPARTMENT_ID,
  FULL_ENTERLIST,
  ENTERLIST_PERMISSION_TASK_MANAGE,
  ENTERLIST_PERMISSION_INDEX_QUERY,
  ENTERLIST_PERMISSION_SIGHTINGLABEL,
  ENTERLIST_PERMISSION_OPENED_BUSINESS,
};
