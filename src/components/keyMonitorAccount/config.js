/**
 * @Author: sunweibin
 * @Date: 2018-07-02 15:56:41
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-06 13:40:38
 * @description 重点监控账户组件的配置项
 */

const config = {
  // 核查列表的Table Columns
  CHECKINFO_LIST_COLUMNS: [
    {
      title: '核查时间',
      key: 'checkDate',
      dataIndex: 'checkDate',
      width: 150,
    },
    {
      title: '资金来源',
      key: 'fundSource',
      dataIndex: 'fundSource',
      width: 150,
    },
    {
      title: '账户实际控制人',
      key: 'controllerName',
      dataIndex: 'controllerName',
      width: 150,
    },
    {
      title: '证券账户',
      key: 'stockAccount',
      dataIndex: 'stockAccount',
      width: 150,
    },
    {
      title: '实际操控人或账户操作人与账户本人的关系',
      key: 'controllerRelation',
      dataIndex: 'controllerRelation',
      width: 150,
    },
    {
      title: '是否存在关联账户',
      key: 'isExistRelatedacct',
      dataIndex: 'isExistRelatedacct',
      width: 150,
    },
    {
      title: '关联账户信息',
      key: 'relatedAccountInfo',
      dataIndex: 'relatedAccountInfo',
      width: 150,
    },
    {
      title: '核查人',
      key: 'checkEmpName',
      dataIndex: 'checkEmpName',
      width: 150,
    },
  ],
};

export default config;

export const {
  CHECKINFO_LIST_COLUMNS,
} = config;
