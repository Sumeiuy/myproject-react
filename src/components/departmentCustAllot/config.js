/**
 * @Description: 分公司客户分配配置项
 * @Author: Liujianshu
 * @Date: 2018-05-23 17:03:23
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-07-23 15:02:39
 */
const config = {
    // 分公司客户分配
  custAllot: {
    pageName: '分公司客户分配',
    pageType: '07', // 查询列表接口中的type值
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '处理中',
        value: '01',
      },
      {
        show: true,
        label: '完成',
        value: '02',
      },
      {
        show: true,
        label: '终止',
        value: '03',
      },
      {
        show: true,
        label: '失败',
        value: '05',
      },
    ],
  },
  // 子类型 type
  subType: '0704',
  allotType: 'department',
  // 清除数据类型
  clearDataArray: ['clearSearchData', 'clearAllData', 'clearAddedCustData'],
  // 分配规则
  // allotRule
  ruleTypeArray: [
    {
      show: true,
      label: '平均客户数',
      value: '0',
    },
    {
      show: true,
      label: '平均客户净资产',
      value: '1',
    },
  ],
  // 职位类型
  positionTypeArray: [
    {
      key: '0',
      value: '不限',
    },
    {
      key: '1',
      value: '个人职位',
    },
    {
      key: '2',
      value: '营业部超岗',
    },
  ],
  titleList: {
    // 新建弹窗中显示的客户列表标题
    // 新建弹窗--点击添加弹窗中的客户列表标题
    cust: [
      {
        dataIndex: 'custName',
        key: 'custName',
        title: '客户',
      },
      {
        dataIndex: 'status',
        key: 'status',
        title: '状态',
      },
      {
        dataIndex: 'oldEmpName',
        key: 'oldEmpName',
        title: '原服务经理',
      },
      {
        dataIndex: 'touGu',
        key: 'touGu',
        title: '是否入岗投顾',
      },
      {
        dataIndex: 'dmName',
        key: 'dmName',
        title: '介绍人',
      },
    ],
    // 新建弹窗中显示的服务经理列表标题
    // 新建弹窗--点击添加弹窗中的服务经理列表标题
    manage: [
      {
        dataIndex: 'empName',
        key: 'empName',
        title: '服务经理',
      },
      {
        dataIndex: 'isDepTgFlag',
        key: 'isDepTgFlag',
        title: '是否入岗投顾',
      },
    ],
    approvalColumns: [
      {
        title: '工号',
        dataIndex: 'login',
        key: 'login',
      }, {
        title: '姓名',
        dataIndex: 'empName',
        key: 'empName',
      }, {
        title: '所属营业部',
        dataIndex: 'occupation',
        key: 'occupation',
      },
    ],
    // 详情以及审批页面客户列表标题
    detailCust: [
      {
        dataIndex: 'custName',
        key: 'custName',
        title: '客户',
        width: 170,
      },
      {
        dataIndex: 'status',
        key: 'status',
        title: '状态',
        width: 100,
      },
      {
        dataIndex: 'oldEmpName',
        key: 'oldEmpName',
        title: '原服务经理',
        width: 180,
      },
      {
        dataIndex: 'dmName',
        key: 'dmName',
        title: '介绍人',
        width: 160,
      },
      {
        dataIndex: 'newEmpName',
        key: 'newEmpName',
        title: '新服务经理',
        width: 180,
      },
    ],
    // 提醒页面客户列表标题
    notifiCust: [
      {
        dataIndex: 'custName',
        key: 'custName',
        title: '客户',
      },
      {
        dataIndex: 'newOrgName',
        key: 'newOrgName',
        title: '新服务营业部',
      },
      {
        dataIndex: 'positionType',
        key: 'positionType',
        title: '新服务经理职位类型',
      },
    ],
  },
  errorArray: ['validateError', 'otherError'],
  tips: {
    validateError: '该申请单数据导入失败，请点击下载报错信息查看报错信息，如有需要，请重新发起流程。',
    otherError: '该申请单流程提交失败，如有需要，请重新发起流程或联系运维人员核查处理。',
  },
};

export default config;
