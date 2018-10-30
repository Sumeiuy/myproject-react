/*
 * @Author: sunweibin
 * @Date: 2018-10-23 17:37:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-30 13:45:53
 * @description 账户详情的配置项
 */

// 资金账户的配置项
export const FUND_ACCOUNT_TABLE_COLUMNS = [
  {
    title: '主账户',
    dataIndex: 'majarFlag',
    key: 'majarFlag',
  },
  {
    title: '资金账户',
    dataIndex: 'accountNumber',
    key: 'accountNumber',
  },
  {
    title: '托管银行',
    dataIndex: 'bankName',
    key: 'bankName',
  },
  {
    title: '银行卡号',
    dataIndex: 'bankCardNumber',
    key: 'bankCardNumber',
  },
  {
    title: '账户状态',
    dataIndex: 'accountStatus',
    key: 'accountStatus',
  },
  {
    title: '开户时间',
    dataIndex: 'openTime',
    key: 'openTime',
  },
  {
    title: '销户时间',
    dataIndex: 'closeTime',
    key: 'closeTime',
  },
];

// 证券账号表格Columns
export const STOCK_ACCOUNT_TABLE_COLUMNS = [
  {
    title: '账户类型',
    dataIndex: 'accountType',
    key: 'accountType',
  },
  {
    title: '证劵账户',
    dataIndex: 'stockAccount',
    key: 'stockAccount',
  },
  {
    title: '资金账户',
    dataIndex: 'fundAccount',
    key: 'fundAccount',
  },
  {
    title: '账户状态',
    dataIndex: 'accountStatus',
    key: 'accountStatus',
  },
  {
    title: '账户市值(元)',
    dataIndex: 'accountValue',
    key: 'accountValue',
  },
  {
    title: '开户时间',
    dataIndex: 'openAccountTime',
    key: 'openAccountTime',
  },
  {
    title: '一码通账户',
    dataIndex: 'oneAccount',
    key: 'oneAccount',
  },
  {
    title: '开户机构',
    dataIndex: 'openAccountOrg',
    key: 'openAccountOrg',
  },
  {
    title: '交易市场',
    dataIndex: 'tradeMarket',
    key: 'tradeMarket',
  },
];
