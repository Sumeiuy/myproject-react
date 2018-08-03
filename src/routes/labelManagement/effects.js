const effects = {
  getCustList: 'customerPool/getGroupCustomerList',
  getHotPossibleWds: 'customerPool/getCustomerHotPossibleWds',
  operateGroup: 'customerPool/operateGroup',
  deleteGroup: 'customerPool/deleteGroup',
  deleteCustomerFromGroup: 'customerPool/deleteCustomerFromGroup',
  queryBatchCustList: 'customerPool/queryBatchCustList',
  clearCreateTaskData: 'customerPool/clearCreateTaskData',

  // 获取标签列表
  queryLabelList: 'labelManagement/queryLabelList',
  // 删除单条标签
  deleteLabel: 'labelManagement/deleteLabel',
};

export default effects;
