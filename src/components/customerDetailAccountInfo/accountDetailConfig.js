/*
 * @Author: sunweibin
 * @Date: 2018-10-23 17:37:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 14:15:36
 * @description 账户详情的配置项
 */

// 资金账户的配置项
export const FUND_ACCOUNT_TABLE_COLUMNS = [
  {
    title: '主账户',
    dataIndex: 'majarFlag',
    key: 'majarFlag',
    width: 80,
  },
  {
    title: '资金账户',
    dataIndex: 'accountNumber',
    key: 'accountNumber',
    width: 300,
  },
  {
    title: '托管银行',
    dataIndex: 'bankName',
    key: 'bankName',
    width: 200,
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
    width: 100,
  },
  {
    title: '开户时间',
    dataIndex: 'openTime',
    key: 'openTime',
    width: 140,
  },
  {
    title: '销户时间',
    dataIndex: 'closeTime',
    key: 'closeTime',
    width: 140,
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
    align: 'right',
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

// 账户变动表格Columns
export const ACCOUNT_CHANGE_TABLE_COLUMNS = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    width: '16%',
  },
  {
    title: '资金账户',
    dataIndex: 'assetAccount',
    key: 'assetAccount',
    width: '16%',
  },
  {
    title: '股东账户',
    dataIndex: 'shareholderAccount',
    key: 'shareholderAccount',
    width: '16%',
  },
  {
    title: '业务类别',
    dataIndex: 'bussinessType',
    key: 'bussinessType',
    width: '16%',
  },
  {
    title: '办理机构',
    dataIndex: 'agency',
    key: 'agency',
    width: '16%',
  },
  {
    title: '办理时间',
    dataIndex: 'handleTime',
    key: 'handleTime',
    width: '16%',
  },
  {
    title: '单费收入(元)',
    dataIndex: 'singleFeeIncome',
    key: 'singleFeeIncome',
    align: 'right',
    width: '16%',
  },
];
