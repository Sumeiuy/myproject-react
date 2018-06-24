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
  season: {
    id: '518004',
    desc: '本季',
  },
  year: {
    id: '518005',
    desc: '本年',
  },
};

// 设置进入客户列表页的过滤器
export const sourceFilter = {
  // 来源于搜索词
  association: {
    PRODUCT: [{
      filterName: 'primaryKeyPrdts',
      value: ['labelMapping', 'productName'],
    }], // (持仓产品)：持仓产品过滤器
    LABEL: [{
      filterName: 'primaryKeyLabels',
      value: ['labelMapping'],
    }],  // (普通标签)：客户标签过滤器
    ID_NUM: [{
      filterName: 'idNum',
      value: ['labelMapping'],
    }],
    SOR_PTY_ID: [{
      filterName: 'sorPtyId',
      value: ['labelMapping'],
    }],
    MOBILE: [{
      filterName: 'mobile',
      value: ['labelMapping'],
    }],
  },
  // 来源于开通业务: 开通业务、可开通业务过滤器
  numOfCustOpened: [{
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
    filterName: 'searchText',
    value: ['q'],
  }],
  // 新增客户模块下钻
  custIndicator: {
    // 新增有效户
    effective: [{
      filterName: 'validDt',
      value: ['cycleEndTime', 'cycleStartTime'],
    }],
    // 新增高净值
    netValue: [{
      filterName: 'gjzDt',
      value: ['cycleEndTime', 'cycleStartTime'],
    }],
    // 新增高端产品户
    highProduct: [{
      filterName: 'highPrdtDt',
      value: ['cycleEndTime', 'cycleStartTime'],
    }],
    // 新增产品户
    productCus: [{
      filterName: 'buyProdDt',
      value: ['cycleEndTime', 'cycleStartTime'],
    }],
  },
  assetsTransactions: {
    purFinAset: [{
      filterName: 'purFinAset',
      value: ['cycleSelect', 'minVal', 'maxVal'],
      defaultVal: {
        minVal: '0',
        maxVal: '',
      },
    }],
    gjAmt: [{
      filterName: 'gjAmt',
      value: ['cycleSelect', 'minVal', 'maxVal'],
      defaultVal: {
        minVal: '0',
        maxVal: '',
      },
    }],
    gjPurRake: [{
      filterName: 'gjPurRake',
      value: ['cycleSelect', 'minVal', 'maxVal'],
      defaultVal: {
        minVal: '0',
        maxVal: '',
      },
    }],
  },
};

// 新增客户相关ID
export const addCustomer = ['effective', 'netValue', 'highProduct', 'productCus'];
