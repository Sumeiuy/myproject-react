/**
 * @Description: 分公司客户分配配置项
 * @Author: Liujianshu
 * @Date: 2018-05-23 17:03:23
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-03 16:23:19
 */
import busApplyFilters from '../../config/busApplyFilters';

const { status, drafter, department, approver, applyTime } = busApplyFilters;
const config = {
  limit: {
    // 勾选条数限制为 500
    count: 500,
    // 所有条数限制为 2000
    allCount: 2000,
  },
  errorMessage: {
    count: '添加失败，一次勾选的客户数超过500条，请分多次添加。',
    allCount: '添加失败，申请单客户列表客户数超过最大数量2000条。',
  },
    // 分公司客户分配
  custAllot: {
    pageName: '分公司客户分配',
    pageType: '07', // 查询列表接口中的type值
    status: [
      {
        show: true,
        label: '不限',
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
  // 更新客户或者服务经理时的方法类型
  operateType: ['add', 'delete', 'clear'],
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
      {
        dataIndex: 'totalAsset',
        key: 'totalAsset',
        title: '总资产(元)',
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
        dataIndex: 'tgFlag',
        key: 'tgFlag',
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
        title: '所属部门',
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
      {
        dataIndex: 'totalAsset',
        key: 'totalAsset',
        title: '总资产(元)',
        width: 120,
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
  basicFilters: [
    status,
    drafter,
    department,
    applyTime,
  ],
  moreFilters: [
    approver,
  ],
  moreFilterData: [
    { value: '审批人', key: 'approvalId' },
  ],
};

export default config;
