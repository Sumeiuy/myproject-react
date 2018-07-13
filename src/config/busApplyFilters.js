
export default {
  // 客户
  customer: {
    id: 'customer',
    props: {
      filterName: '客户',  // 过滤器中文名称
      filterId: 'customer', // 过滤器英文代号, 首字母小写
      type: 'singleSearch', // 过滤器类型
      dataMap: ['custNumber', 'custName'],
      handleInputChange: 'handleCustSearch',
      useLabelInValue: true,
      showSearch: true,
      needItemObj: true,
      useDefaultData: true,
    },
    filterOption: ['customer'],
  },
  // 服务经理
  serviceManager: {
    id: 'serviceManager',
    props: {
      filterName: '服务经理',  // 过滤器中文名称
      filterId: 'serviceManager', // 过滤器英文代号, 首字母小写
      type: 'singleSearch', // 过滤器类型
      dataMap: ['ptyMngId', 'ptyMngName'],
      handleInputChange: 'handleManagerSearch',
      useLabelInValue: true,
      showSearch: true,
      needItemObj: true,
      useDefaultData: true,
    },
    filterOption: ['serviceManager'],
  },
  // 操作类型
  operationType: {
    id: 'operationType',
    props: {
      filterName: '操作类型',  // 过滤器中文名称
      filterId: 'operationType', // 过滤器英文代号, 首字母小写
      type: 'single', // 过滤器类型
      dataMap: ['value', 'label'],
      needItemObj: true,
    },
    filterOption: ['operationType'],
  },
  // 子类型
  subType: {
    id: 'subType',
    props: {
      filterName: '子类型',  // 过滤器中文名称
      filterId: 'subType', // 过滤器英文代号, 首字母小写
      type: 'single', // 过滤器类型
      dataMap: ['value', 'label'],
      needItemObj: true,
    },
    filterOption: ['subType'],
  },
  // 状态
  status: {
    id: 'status',
    props: {
      filterName: '状态',  // 过滤器中文名称
      filterId: 'status', // 过滤器英文代号, 首字母小写
      type: 'single', // 过滤器类型
      dataMap: ['value', 'label'],
      filterOption: ['status'],
      needItemObj: true,
    },
  },
  // 拟稿人
  drafter: {
    id: 'drafter',
    props: {
      filterName: '拟稿人',  // 过滤器中文名称
      filterId: 'drafter', // 过滤器英文代号, 首字母小写
      type: 'singleSearch', // 过滤器类型
      dataMap: ['ptyMngId', 'ptyMngName'],
      filterOption: ['drafterId'],
      placeholder: '工号/名称',
      handleInputChange: 'handleDrafterSearch',
      useLabelInValue: true,
      showSearch: true,
      needItemObj: true,
      useDefaultData: true,
    },
  },
  // 部门
  department: {
    id: 'department',
    props: {
      filterName: '部门',  // 过滤器中文名称
      filterId: 'department', // 过滤器英文代号, 首字母小写
      key: 'orgId',
      type: 'tree', // 过滤器类型
      searchPlaceholder: '搜索',
      showSearch: true,
      treeDefaultExpandAll: true,
    },
    filterOption: ['orgId'],
  },
  // 审批人
  approver: {
    id: 'approver',
    props: {
      filterName: '审批人',  // 过滤器中文名称
      filterId: 'approver', // 过滤器英文代号, 首字母小写
      key: 'approvalId',
      type: 'singleSearch', // 过滤器类型
      dataMap: ['ptyMngId', 'ptyMngName'],
      placeholder: '工号/名称',
      handleInputChange: 'handleApproverSearch',
      useLabelInValue: true,
      showSearch: true,
      needItemObj: true,
      useDefaultData: true,
    },
    filterOption: ['approvalId', 'approvalName'],
  },
  // 申请时间
  applyTime: {
    id: 'applyTime',
    props: {
      filterName: '申请时间',  // 过滤器中文名称
      filterId: 'applyTime', // 过滤器英文代号, 首字母小写
      type: 'date', // 过滤器类型
    },
    filterOption: ['createTime', 'createTimeTo'],
  },
};
