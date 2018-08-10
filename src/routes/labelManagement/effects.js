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
  // 检查标签是否重名
  checkDuplicationName: 'labelManagement/checkDuplicationName',
  // 查询分组列表数据
  queryCustGroupList: 'labelManagement/queryCustGroupList',
  // 查询分组下的客户
  queryGroupCustList: 'labelManagement/queryGroupCustList',
  // 通过关键词联想标签
  queryPossibleLabels: 'labelManagement/queryPossibleLabels',
  // 清空联想标签数据
  clearPossibleLabels: 'labelManagement/clearPossibleLabels',
  // 分组转标签
  group2Label: 'labelManagement/group2Label',
  // 查询标签下的客户
  queryLabelCust: 'labelManagement/queryLabelCust',
  // 新建编辑标签信息
  operateLabel: 'labelManagement/operateLabel',
  // 删除标签下的客户
  deleteLabelCust: 'labelManagement/deleteLabelCust',
  // 验证是否名下客户
  isSendCustsServedByEmp: 'labelManagement/isSendCustsServedByEmp',
};

export default effects;
