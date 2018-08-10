export default {};

// 服务经理维度
export const EMP_MANAGER_SCOPE = 'empManager';
// 营业部维度
export const EMP_DEPARTMENT_SCOPE = 'empDepartment';
// 分公司维度
export const EMP_COMPANY_SCOPE = 'empCompany';

export const EMP_MANAGER_SCOPE_ITEM = {
  key: 'empManager',
  value: '按服务经理',
};

export const EMP_COMPANY_ITEM = {
  key: 'empCompany',
  value: '按分公司',
};

export const EMP_DEPARTMENT_ITEM = {
  key: 'empDepartment',
  value: '按营业部',
};

// 所属营业部列，给表格最后两列用
export const EMP_DEPARTMENT_COLUMN_FOR_LAST = {
  key: 'empDepartmentName',
  value: '所属营业部',
};

// 所属分公司列，给表格最后两列用
export const EMP_COMPANY_COLUMN_FOR_LAST = {
  key: 'empCompanyName',
  value: '所属分公司',
};

// 营业部列，给表格第一列用
export const EMP_DEPARTMENT_COLUMN_FOR_FIRST = {
  key: 'empDepartmentName',
  value: '营业部',
};

// 分公司列，给表格第一列用
export const EMP_COMPANY_COLUMN_FOR_FIRST = {
  key: 'empCompanyName',
  value: '分公司',
};

// 所有维度下拉列表信息
export const ALL_EMP_SCOPE_ITEM = [
  EMP_COMPANY_ITEM,
  EMP_MANAGER_SCOPE_ITEM,
  EMP_DEPARTMENT_ITEM,
];

export const missionImplementation = {
  // 已服务
  IS_SERVED: 'IS_SERVED',
  // 已完成
  IS_DONE: 'IS_DONE',
  // 结果达标
  IS_UP_TO_STANDARD: 'IS_UP_TO_STANDARD',
  // 进度完成
  COMPLETED_PROGRESS_FLAG: 'Y',
  // log日志配置项
  logInfo: {
    entryFromProgressDetail: {
      name: '总体进度',
    },
    entryFromPie: {
      name: '已服务客户反馈',
    },
    entryFromCustTotal: {
      name: '明细进度',
    },
    logElementFromCustTotal: '客户总数',
    logElementFromServedCustomer: '已服务客户',
    logElementFromUnservedCustomer: '未服务客户',
    logElementFromCompletedCustomer: '已完成客户',
    logElementFromUncompletedCustomer: '未完成客户',
    logElementFromUpToStandardCustomer: '结果达标客户',
    logElementFromNotUpToStandardCustomer: '结果未达标客户',
  },
};
