
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
