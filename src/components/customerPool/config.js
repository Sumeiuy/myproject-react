/**
 * @Descripter: 客户相关页面配置
 * @Author: k0170179
 * @Date: 2018/6/22
 */
// 首页周期map

// 设置进入客户列表页的过滤器
const sourceFilter = {
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
      value: [],
    }],
  },
};

// 新增客户相关ID
const addCustomer = ['effective', 'netValue', 'highProduct', 'productCus'];


export default { sourceFilter, addCustomer };
