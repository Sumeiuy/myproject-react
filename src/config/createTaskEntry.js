export default {};

// returnTaskFromToDoList是待办，审批驳回之后，编辑自建任务信息界面
export const RETURN_TASK_FROM_TODOLIST = 'returnTaskFromToDoList';

// returnTaskFromTaskList是创建者视图，审批驳回之后，编辑自建任务信息界面
export const RETURN_TASK_FROM_TASKLIST = 'returnTaskFromTaskList';

// custGroupList是客户分组
export const CUST_GROUP_LIST = 'custGroupList';

// pieEntry是管理者视图的饼图
export const PIE_ENTRY = 'pieEntry';

// progressEntry是管理者视图的进度条
export const PROGRESS_ENTRY = 'progressEntry';

// business从首页潜在目标客户下钻进来
export const BUSINESS_ENTRY = 'business';

// search从首页搜索进来
export const SEARCH_ENTRY = 'search';

// productPotentialTargetCust从外部入口，产品潜在客户下钻，带过来瞄准镜标签
export const PRODUCT_POTENTIAL_TARGET_CUST_ENTRY = 'productPotentialTargetCust';

// securitiesProducts从精选组合的证券产品产品中心进来
export const SECURITIES_PRODUCTS_ENTRY = 'securitiesProducts';

// orderCombination从精选组合的证券产品订购组合进来
export const ORDER_COMBINATION_ENTRY = 'orderCombination';

// external从外部入口进来，非理财平台，不是瞄准镜标签
export const EXTERNAL_ENTRY = 'external';

// association从首页搜索下拉列表进来
export const ASSOCIATION_ENTRY = 'association';

// tag从首页热点标签进来
export const TAG_ENTRY = 'tag';

// custIndicator从绩效目标客户池进来
export const CUSTINDICATOR_ENTRY = 'custIndicator';

// numOfCustOpened从绩效目标客户池进来
export const NUMOFCUSTOPENED_ENTRY = 'numOfCustOpened';

// sightingTelescope从首页搜索，搜索一个瞄准镜标签或者从热点标签，这个标签是瞄准镜的标签
export const SIGHTINGTELESCOPE_ENTRY = 'sightingTelescope';

// 管理者视图下服务经理维度下钻客户，发起任务入口
export const TASK_CUST_SCOPE_ENTRY = 'taskCustScopeEntry';

// 所有可以发起任务的入口集合
export const createTaskEntrySource = [
  RETURN_TASK_FROM_TODOLIST,
  RETURN_TASK_FROM_TASKLIST,
  CUST_GROUP_LIST,
  PIE_ENTRY,
  PROGRESS_ENTRY,
  BUSINESS_ENTRY,
  SEARCH_ENTRY,
  PRODUCT_POTENTIAL_TARGET_CUST_ENTRY,
  SECURITIES_PRODUCTS_ENTRY,
  ORDER_COMBINATION_ENTRY,
  EXTERNAL_ENTRY,
  ASSOCIATION_ENTRY,
  TAG_ENTRY,
  CUSTINDICATOR_ENTRY,
  NUMOFCUSTOPENED_ENTRY,
  SIGHTINGTELESCOPE_ENTRY,
  TASK_CUST_SCOPE_ENTRY,
];

// 驳回修改任务入口集合，包含从待办任务发起驳回修改和从任务管理列表发起驳回修改
export const returnTaskEntrySource = [
  RETURN_TASK_FROM_TODOLIST,
  RETURN_TASK_FROM_TASKLIST,
];

// 标签来源，热点标签，普通标签，搜索标签
export const labelSource = [
  TAG_ENTRY, ASSOCIATION_ENTRY, SIGHTINGTELESCOPE_ENTRY,
];

// 代表瞄准镜标签发起任务入口集合
export const sightingLabelSource = [
  SIGHTINGTELESCOPE_ENTRY,
  PRODUCT_POTENTIAL_TARGET_CUST_ENTRY,
];
