/*
 * @Author: wangyikai
 * @Date: 2018-11-06 17:08:51
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-12 00:13:38
 */
const config = {
  // 服务团队表格数据
  serviceTeamColumns: [
    {
      title: '主要',
      dataIndex: 'main',
      key: 'main',
      className: 'firstStyle',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      className: 'leftStyle',
    },
    {
      title: '是否入岗',
      dataIndex: 'enterPost',
      key: 'enterPost',
      className: 'leftStyle',
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
      className: 'leftStyle',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      className: 'leftStyle',
    },
    {
      title: '手机',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      className: 'leftStyle',
    },
    {
      title: '办公电话',
      dataIndex: 'officePhone',
      key: 'officePhone',
      className: 'lastStyle',
    },
  ],
  // 介绍信息的表格数据
  introduceColumns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      className: 'firstStyle',
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
      className: 'leftStyle',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      className: 'leftStyle',
    },
    {
      title: '手机',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      className: 'leftStyle',
    },
    {
      title: '办公电话',
      dataIndex: 'officePhone',
      key: 'officePhone',
      className: 'leftStyle',
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      className: 'leftStyle',
    },
    {
      title: '认定时间 ',
      dataIndex: 'cognizanceTime',
      key: 'cognizanceTime',
      className: 'leftStyle',
    },
  ],
  // 服务历史的表格数据
  serviceHistoryColumns: [
    {
      title: '操作者工号 ',
      dataIndex: 'operatorNumber',
      key: 'operatorNumber',
      className: 'leftStyle',
    },
    {
      title: '操作者姓名 ',
      dataIndex: 'operatorName',
      key: 'operatorName',
      className: 'leftStyle',
    },
    {
      title: '原服务经理工号 ',
      dataIndex: 'managerNumber',
      key: 'managerNumber',
      className: 'leftStyle',
    },
    {
      title: '原服务经理姓名 ',
      dataIndex: 'managerName',
      key: 'managerName',
      className: 'leftStyle',
    },
    {
      title: '新服务经理工号 ',
      dataIndex: 'newManagerNumber',
      key: 'newManagerNumber',
      className: 'leftStyle',
    },
    {
      title: '新服务经理姓名 ',
      dataIndex: 'newManagerName',
      key: 'newManagerName',
      className: 'leftStyle',
    },
    {
      title: '操作日期 ',
      dataIndex: 'operationDate',
      key: 'operationDate',
      className: 'leftStyle',
    },
    {
      title: '来源 ',
      dataIndex: 'source',
      key: 'source',
      className: 'lastStyle',
    },
  ]
};
export default config;
export const {
  serviceTeamColumns,
  introduceColumns,
  serviceHistoryColumns
} = config;
