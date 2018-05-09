/**
 * @Author: sunweibin
 * @Date: 2018-05-08 19:36:19
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-09 15:25:01
 * @description 营业部非投顾签约客户分配的配置项
 */

export const config = {};

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
