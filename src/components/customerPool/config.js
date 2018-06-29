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
  },
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
    lastServDt: [{
      // 最近一次服务
      filterName: 'lastServDt',
      value: ['cycleStartTime', 'serviced'],
      defaultVal: {
        serviced: 'unServiced',
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
      minVal: '50',
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
  custAssets: ['newOpen', 'lastServDt', 'tgSignDate'],
};
