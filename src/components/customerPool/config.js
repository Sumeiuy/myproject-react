/**
 * @Descripter: 客户相关页面配置
 * @Author: k0170179
 * @Date: 2018/6/22
 */
// 周期对应Id
export const kPIDateScopeType = {
  month: {
    id: '518003',
    desc: '本月',
  },
  quarter: {
    id: '518004',
    desc: '本季',
  },
  year: {
    id: '518005',
    desc: '本年',
  },
};

const productSaleChildDefaultVal = {
  value: ['cycleSelect', 'minVal', 'maxVal'],
  defaultVal: {
    minVal: '1',
    maxVal: '',
  },
};
// 设置进入客户列表页的过滤器
export const sourceFilter = {
  // 来源于搜索词
  association: {
    PRODUCT: [{
      // primaryKeyPrdts: 持仓产品
      filterName: 'primaryKeyPrdts',
      value: ['labelMapping', 'productName'],
    }], // (持仓产品)：持仓产品过滤器
    LABEL: [{
      // primaryKeyLabels: 客户标签
      filterName: 'primaryKeyLabels',
      value: ['labelMapping'],
    }],  // (普通标签)：客户标签过滤器
    ID_NUM: [{
      // idNum: 身份证号码
      filterName: 'idNum',
      value: ['labelMapping'],
    }],
    SOR_PTY_ID: [{
      filterName: 'sorPtyId',
      value: ['labelMapping'],
    }],
    MOBILE: [{
      // mobile: 手机号码
      filterName: 'mobile',
      value: ['labelMapping'],
    }],
    NAME: [{
      // name: 姓名
      filterName: 'name',
      value: ['labelName'],
    }],
    INDUSTRY: [{
      // industry: 持仓行业
      filterName: 'primaryKeyIndustry',
      value: ['labelMapping'],
    }],
  },
  manageFsp: [{
    // 首页搜索框下钻，自定义标签（管理标签）
    filterName: 'customLabels',
    value: ['labelMapping'],
  }],
  personalFsp: [{
    // 首页搜索框下钻，自定义标签（我的标签）
    filterName: 'customLabels',
    value: ['labelMapping'],
  }],
  // 首页潜在业务客户下钻
  business: [{
    // 可开通业务
    filterName: 'unrights',
    value: ['custUnrightBusinessType'],
  }],
  // 来源于开通业务: 开通业务、可开通业务过滤器
  numOfCustOpened: [{
    // businessOpened: 开通业务
    filterName: 'businessOpened',
    value: ['cycleSelect', 'rightType'],
  }],
  // 来源于普通标签: 客户标签过滤器
  tag: [{
    filterName: 'primaryKeyLabels',
    value: ['labelMapping'],
  }],
  // 来源于热点标签: 客户标签，可开通业务过滤器
  sightingTelescope: [{
    filterName: 'primaryKeyLabels',
    value: ['labelMapping'],
  }],
  search: [{
    // searchText: 模糊搜索
    filterName: 'searchText',
    value: ['q'],
  }],
  // 新增客户模块下钻
  custIndicator: {
    // 新增有效户
    effective: [{
      // 新开有效户日期
      filterName: 'validDt',
      value: ['cycleStartTime', 'cycleEndTime'],
    }, {
      // 新开客户
      filterName: 'dateOpened',
      value: ['cycleStartTime', 'cycleEndTime'],
    }],
    // 新增高净值
    netValue: [{
      // 新增高净值
      filterName: 'gjzDt',
      value: ['cycleStartTime', 'cycleEndTime'],
    }],
    // 新增高端产品户
    highProduct: [{
      // 高端产品户认定日期
      filterName: 'highPrdtDt',
      value: ['cycleStartTime', 'cycleEndTime'],
    }],
    // 新增产品户
    productCus: [{
      // 产品客户认定日期
      filterName: 'buyProdDt',
      value: ['cycleStartTime', 'cycleEndTime'],
    }],
  },
  assetsTransactions: {
    purFinAset: [{
      // 净转入资产
      filterName: 'purFinAset',
      ...productSaleChildDefaultVal,
    }],
    gjAmt: [{
      // 股基交易量
      filterName: 'gjAmt',
      ...productSaleChildDefaultVal,
    }],
    gjPurRake: [{
      // 股基净佣金
      filterName: 'gjPurRake',
      ...productSaleChildDefaultVal,
    }],
  },
  productSale: {
    kfBuyAmt: [{
      // 公募基金
      filterName: 'kfBuyAmt',
      ...productSaleChildDefaultVal,
    }],
    smBuyAmt: [{
      // 私募基金
      filterName: 'smBuyAmt',
      ...productSaleChildDefaultVal,
    }],
    finaBuyAmt: [{
      // 紫金产品
      filterName: 'finaBuyAmt',
      ...productSaleChildDefaultVal,
    }],
    otcBuyAmt: [{
      // OTC
      filterName: 'otcBuyAmt',
      ...productSaleChildDefaultVal,
    }],
  },
  income: {
    purRake: [{
      // 净佣金
      filterName: 'purRake',
      ...productSaleChildDefaultVal,
    }],
    saleFare: [{
      // 产品净手续费
      filterName: 'saleFare',
      ...productSaleChildDefaultVal,
    }],
    netIncome: [{
      // 净利息收入
      filterName: 'netIncome',
      ...productSaleChildDefaultVal,
    }],
  },
  manageService: {
    highNetValue: [{
      // 最近一次服务
      filterName: 'lastServDt',
      value: ['cycleStartTime', 'serviced'],
      defaultVal: {
        serviced: 'unServiced',
      },
    },
    {
      // 客户类型
      filterName: 'custClass',
      value: ['custClass'],
      defaultVal: {
        custClass: 'N',
      },
    }],
  },
  serviceTarget: {
    lastServDt: [{
      // 最近一次服务
      filterName: 'lastServDt',
      value: ['cycleStartTime', 'serviced'],
      defaultVal: {
        serviced: 'unServiced',
      },
    }],
    completedRate: [{
      // 信息完备率
      filterName: 'completedRate',
      value: ['addrFlag', 'mobileFlag', 'emailFlag', 'riskFlag'],
      defaultVal: {
        mobileFlag: 'mobile',
        emailFlag: 'email',
        addrFlag: 'address',
        riskFlag: 'risklover',
      },
    }],
  },
  custAssets: {
    newOpen: [{
      // 新开客户
      filterName: 'dateOpened',
      value: ['cycleStartTime', 'cycleEndTime'],
    }],
    lastServDt: [{
      // 最近服务时间
      filterName: 'lastServDt',
      value: ['cycleStartTime', 'serviced'],
      defaultVal: {
        serviced: 'unServiced',
      },
    }],
    tgSignDate: [{
      // 签约日期
      filterName: 'tgSignDate',
      value: ['cycleStartTime', 'cycleEndTime'],
    }],
  },
  aggregationRate: [{
    // 归集率
    filterName: 'gjlRate',
    value: ['minVal', 'maxVal'],
    defaultVal: {
      minVal: '0',
      maxVal: '50',
    },
  }],
};

// 首页各模块中不同类别的标识
export const homeModelType = {
  // 新增客户相关类别
  custIndicator: ['effective', 'netValue', 'highProduct', 'productCus'],
  // 产品销售相关类别:公募基金购买额、私募基金购买额、紫金基金购买额、OTC购买额
  productSale: ['kfBuyAmt', 'smBuyAmt', 'finaBuyAmt', 'otcBuyAmt'],
  // 净创收：股基净佣金、产品净手续费、净利息收入
  income: ['purRake', 'saleFare', 'netIncome'],
  // 服务指标（投顾绩效） 一个模块中不需要下钻的指标名直接设置为null：、最近一次服务、、信息完备率
  serviceTarget: [null, 'lastServDt', null, 'completedRate'],
  // 客户及资产（投顾绩效）：新开客户、最近一次服务、签约日期
  custAssets: [{
    key: 'newOpen',
    desc: '新开客户数',
    id: 'newCustNum',
  }, {
    key: 'tgSignDate',
    desc: '签约客户数',
    id: 'currSignCustNum',
  }],
};

// 搜索搜索框中点击的且在客户列表没有筛选器的集合
export const basicInfoList = [
  { labelName: '搜索的关键词', filterField: 'searchText' },
  { labelName: '身份证号码', filterField: 'idNum' },
  { labelName: '联系电话', filterField: 'mobile' },
  { labelName: '经济客户号', filterField: 'sorPtyId' },
];

// 普通的筛选组件（包括单选和多选）
export const commonFilterList = [
  { labelName: '已开通业务', filterField: 'rights', dictField: 'custBusinessType' },
  { labelName: '可开通业务', filterField: 'unrights', dictField: 'custUnrightBusinessType' },
  { labelName: '客户性质', filterField: 'customType', dictField: 'custNature' },
  { labelName: '客户类型', filterField: 'custClass', dictField: 'custType' },
  { labelName: '风险等级', filterField: 'riskLevels', dictField: 'custRiskBearing' },
  { labelName: '客户等级', filterField: 'customerLevel', dictField: 'custLevelList' },
  { labelName: '未完备信息', filterField: 'completedRate', dictField: 'completenessRateList' },
  { labelName: '账户状态', filterField: 'accountStatus', dictField: 'accountStatusList' },
  { labelName: '持仓行业', filterField: 'primaryKeyIndustry', dictField: 'industryList' },
];

// 带搜索的筛选组件集合
export const singleWithSearchFilterList = [
  { labelName: '介绍人', filterField: 'devMngId' },
  { labelName: '订购组合', filterField: 'primaryKeyJxgrps' },
];

// 最近一次服务的服务类型code。name对应
export const serviceCustomerState = {
  unServiced: '未服务的客户',
  serviced: '服务过的客户',
};

// 日期范围组件集合
export const dateRangeFilterList = [
  { labelName: '高端产品户认定日期', filterField: 'highPrdtDt' },
  { labelName: '产品户认定日期', filterField: 'buyProdDt' },
  { labelName: '签约日期', filterField: 'tgSignDate' },
  { labelName: '高净值户认定日期', filterField: 'gjzDt' },
  { labelName: '有效户生效日期', filterField: 'validDt' },
  { labelName: '开户日期', filterField: 'dateOpened' },
];

// 购买金额范围加时间周期组件集合
export const buyAmtFilterList = [
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
export const capitalFilterList = [
  { labelName: '总资产', filterField: 'totAset' },
  { labelName: '资金余额（含信用）', filterField: 'cashAmt' },
  { labelName: '普通可用资金', filterField: 'avlAmt' },
  { labelName: '信用可用资金', filterField: 'avlAmtCrdt' },
  { labelName: '总市值（含信用）', filterField: 'totMktVal' },
  { labelName: '归集率', filterField: 'gjlRate' },
  { labelName: '外部市值', filterField: 'outMktVal' },
];

// 个人对应的code码
export const PER_CODE = 'per';
// 一般机构对应的code码
export const ORG_CODE = 'org';

// 产品中心不同产品类型对应的tab标题和tab的id
// 产品类型：[PA100000: 私募基金]、[PA050000: 公募基金]、[PA070000: 紫金理财]、[PA090000: 收益凭证]
export const CONFIG_TAB_PRODUCTCENTER = {
  PA100000: {
    title: '私募产品',
    id: 'FSP_PRIVATE_PRD_TAB',
  },
  PA050000: {
    title: '公募产品',
    id: 'FSP_PUBLIC_FUND_TAB',
  },
  PA070000: {
    title: '紫金产品',
    id: 'FSP_PRD_PURPLE_GOLD_PROD',
  },
  PA090000: {
    title: '收益凭证',
    id: 'FSP_PRD_REVENCE_VOUCHER',
  },
};
