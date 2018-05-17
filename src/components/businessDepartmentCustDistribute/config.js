/**
 * @Author: sunweibin
 * @Date: 2018-05-08 19:36:19
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-17 16:27:30
 * @description 营业部非投顾签约客户分配的配置项
 */

// 客户列表的最大边界值,目前暂定 400
export const CUST_LIST_BOUNDARY_VALUE = 400;
// 客户分配的申请查询审批人的Btn 值
export const CUST_DISTRIBUTE_BTN = '1000000';

export const detailTableColumns = [
  {
    dataIndex: 'customer',
    key: 'customer',
    title: '客户',
  },
  {
    dataIndex: 'status',
    key: 'status',
    title: '状态',
    width: '60px',
  },
  {
    dataIndex: 'preManager',
    key: 'preManager',
    title: '原服务经理',
  },
  {
    dataIndex: 'developManager',
    key: 'developManager',
    title: '开发经理',
  },
  {
    dataIndex: 'newManager',
    key: 'newManager',
    title: '新服务经理',
  },
];

export const custTableColumns = [
  {
    dataIndex: 'customer',
    key: 'customer',
    title: '客户',
  },
  {
    dataIndex: 'statusText',
    key: 'statusText',
    title: '状态',
  },
  {
    dataIndex: 'prevManager',
    key: 'prevManager',
    title: '原服务经理',
  },
  {
    dataIndex: 'isTg',
    key: 'isTg',
    title: '是否入岗投顾',
    render(text) {
      return text ? '是' : '否';
    },
  },
  {
    dataIndex: 'devManager',
    key: 'devManager',
    title: '开发经理',
  },
];

export const managerTableColumns = [
  {
    dataIndex: 'emp',
    key: 'emp',
    title: '服务经理',
  },
  {
    dataIndex: 'isTg',
    key: 'isTg',
    title: '是否入岗投顾',
    render(text) {
      return text ? '是' : '否';
    },
  },
];

export const empAddTableColumns = [
  {
    dataIndex: 'empName',
    key: 'empName',
    title: '姓名',
  },
  {
    dataIndex: 'empId',
    key: 'empId',
    title: '工号',
  },
  {
    dataIndex: 'isTg',
    key: 'isTg',
    title: '是否入岗投顾',
    render(text) {
      return text ? '是' : '否';
    },
  },
];

export const approvalColumns = [
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
];

export const tableCommonPagination = {
  pageSize: 10,
  showTotal(total) {
    return `共${total}条`;
  },
};
