/**
 * @Descripter: 客户列表按指标排序相关
 * @Author: K0170179
 * @Date: 2018/7/18
 */

// 排序指标固定条件
export const sortQuotaConfig = [
  {
    sortType: 'totAset',
    name: '总资产',
  },
  {
    sortType: 'openDt',
    name: '激活日期',
  },
  {
    sortType: 'minFee',
    name: '佣金率',
  },
  {
    sortType: 'outMktval',
    name: '外部市值',
  },
];

// 下钻特显与动态插入的排序条件
export const dynamicInsetQuota = [
  {
    filterType: 'kfBuyAmt',
    sortType: 'kfBuyAmt',
    name: '公募基金购买金额',
  },
  {
    filterType: 'smBuyAmt',
    sortType: 'smBuyAmt',
    name: '私募基金购买金额',
  },
  {
    filterType: 'finaBuyAmt',
    sortType: 'finaBuyAmt',
    name: '紫金产品购买金额',
  },
  {
    filterType: 'otcBuyAmt',
    sortType: 'otcBuyAmt',
    name: 'OTC购买金额',
  },
  {
    filterType: 'gjAmt',
    sortType: 'gjAmt',
    name: '基础股基交易量',
  },
  {
    filterType: 'gjPurRake',
    sortType: 'gjPurRake',
    name: '股基净佣金',
  },
  {
    filterType: 'netIncome',
    sortType: 'netIncome',
    name: '净利息额',
  },
  {
    filterType: 'purRake',
    sortType: 'purRake',
    name: '净佣金额',
  },
  {
    filterType: 'saleFare',
    sortType: 'saleFare',
    name: '产品净手续费',
  },
  {
    filterType: 'purFinAset',
    sortType: 'purFinAset',
    name: '净转入资产',
  },
  {
    filterType: 'gjlRate',
    sortType: 'outMktval',
    name: '外部市值',
  },
];

