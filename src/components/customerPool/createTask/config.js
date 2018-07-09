
// 持仓产品发起任务的参数
const PRODUCT_ARGUMENTS = [
  '产品销售日期',
  '产品到期日期',
  '申购开始日期',
];

// 搜索搜索框中点击的且在客户列表没有筛选器的集合
const basicInfoList = [
  { labelName: '搜索的关键词', filterField: 'searchText' },
  { labelName: '身份证号码', filterField: 'idNum' },
  { labelName: '联系电话', filterField: 'mobile' },
  { labelName: '经济客户号', filterField: 'sorPtyId' },
];

// 普通的筛选组件（包括单选和多选）
const commonFilterList = [
  { labelName: '已开通业务', filterField: 'rights', dictField: 'custBusinessType' },
  { labelName: '可开通业务', filterField: 'unrights', dictField: 'custUnrightBusinessType' },
  { labelName: '客户性质', filterField: 'customType', dictField: 'custNature' },
  { labelName: '客户类型', filterField: 'custClass', dictField: 'custType' },
  { labelName: '风险等级', filterField: 'riskLevels', dictField: 'custRiskBearing' },
  { labelName: '客户等级', filterField: 'customerLevel', dictField: 'custLevelList' },
  { labelName: '未完备信息', filterField: 'completedRate', dictField: 'completenessRateList' },
  { labelName: '账户状态', filterField: 'accountStatus', dictField: 'accountStatusList' },
  { labelName: '持仓行业', filterField: 'holdingIndustry', dictField: 'industryList' },
];

// 带搜索的筛选组件集合
const singleWithSearchFilterList = [
  { labelName: '介绍人', filterField: 'devMngId' },
  { labelName: '订购组合', filterField: 'primaryKeyJxgrps' },
];

// 最近一次服务的服务类型code。name对应
const serviceCustomerState = {
  unServiced: '未服务的客户',
  serviced: '服务过的客户',
};

// 日期范围组件集合
const dateRangeFilterList = [
  { labelName: '高端产品户认定日期', filterField: 'highPrdtDt' },
  { labelName: '产品户认定日期', filterField: 'buyProdDt' },
  { labelName: '签约日期', filterField: 'tgSignDate' },
  { labelName: '高净值户认定日期', filterField: 'gjzDt' },
  { labelName: '有效户生效日期', filterField: 'validDt' },
  { labelName: '开户日期', filterField: 'dateOpened' },
];

// 购买金额范围加时间周期组件集合
const buyAmtFilterList = [
  { labelName: '公募基金购买金额', filterField: 'kfBuyAmt' },
  { labelName: '私募基金购买金额', filterField: 'smBuyAmt' },
  { labelName: '紫金产品购买金额', filterField: 'finaBuyAmt' },
  { labelName: 'OTC购买金额', filterField: 'otcBuyAmt' },
  { labelName: '基础股基交易量', filterField: 'gjAmt' },
  { labelName: '股基净佣金', filterField: 'gjPurRake' },
  { labelName: '净利息额', filterField: 'netIncome' },
  { labelName: '净佣金额', filterField: 'purRake' },
  { labelName: '产品净手续费', filterField: 'saleFare' },
  { labelName: '净转入资产', filterField: 'purFinAset' },
];

// 资金范围的组件集合
const capitalFilterList = [
  { labelName: '总资产', filterField: 'totAset' },
  { labelName: '资金余额（含信用）', filterField: 'cashAmt' },
  { labelName: '普通可用资金', filterField: 'avlAmt' },
  { labelName: '信用可用资金', filterField: 'avlAmtCrdt' },
  { labelName: '总市值（含信用）', filterField: 'totMktVal' },
  { labelName: '归集率', filterField: 'gjlRate' },
  { labelName: '外部市值', filterField: 'outMktVal' },
  { labelName: '总资产', filterField: 'totAset' },
];

export default {
  PRODUCT_ARGUMENTS,
  basicInfoList,
  commonFilterList,
  singleWithSearchFilterList,
  serviceCustomerState,
  dateRangeFilterList,
  buyAmtFilterList,
  capitalFilterList,
};
