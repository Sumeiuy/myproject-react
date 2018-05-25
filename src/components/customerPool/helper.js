/**
 * 共用的方法
 */
import _ from 'lodash';
  // 设置进入客户列表页的过滤器
const sourceFilter = {
  // 来源于搜索词
  association: {
    PRODUCT: [{
      filterName: 'primaryKeyPrdts',
      value: ['labelMapping'],
    }], // (持仓产品)：持仓产品过滤器
    LABEL: [{
      filterName: 'primaryKeyLabels',
      value: ['labelMapping'],
    }],  // (普通标签)：客户标签过滤器
  },
  // 来源于开通业务: 开通业务、可开通业务过滤器
  numOfCustOpened: [{
    filterName: 'performanceForm',
    value: ['cycleSelect', 'rightType'],
  }, 'Unrights'],
  // 来源于潜在业务机会: 可开通业务过滤器
  business: ['Unrights'],
  // 来源于普通标签: 客户标签过滤器
  tag: [{
    filterName: 'primaryKeyLabels',
    value: ['labelMapping'],
  }],
  // 来源于热点标签: 客户标签，可开通业务过滤器
  sightingTelescope: [{
    filterName: 'primaryKeyLabels',
    value: ['labelMapping'],
  }, 'Unrights'],
};
const helper = {
  /**
   * 判断是否是瞄准镜
   * @param {*} value
   */
  isSightingScope(value) {
    return value === 'jzyx';
  },
  getFilter(data) {
    const {
      source,
      type = '',
    } = data;
    // 将筛选项组装成
    // type.a|category.b,c,d  形式放到url中
    let filterList = sourceFilter[source];
    filterList = _.isArray(filterList) ? filterList : filterList[type];
    const finalFilterList = _.map(filterList, (filterItem) => {
      if (_.isPlainObject(filterItem)) {
        const filterValue = _.map(filterItem.value, item => data[item]);
        return `${filterItem.filterName}.${filterValue.join(',')}`;
      }
      return `${filterItem}.`;
    });
    return finalFilterList.join('|');
  },
};

export default helper;
