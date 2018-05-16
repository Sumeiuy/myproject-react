/**
 * @Descripter: 公用方法
 * @Author: K0170179
 * @Date: 2018/5/14
 */
import _ from 'lodash';
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
      value: ['labelMapping', 'labelName'],
    }],  // (普通标签)：客户标签过滤器
  },
  // 来源于开通业务: 开通业务、可开通业务过滤器
  numOfCustOpened: [{
    filterName: 'businessOpened',
    value: ['cycleSelect', 'rightType'],
  }, 'Unrights'],
  // 来源于潜在业务机会: 可开通业务过滤器
  business: ['unrights'],
  // 来源于普通标签: 客户标签过滤器
  tag: [{
    filterName: 'primaryKeyLabels',
    value: ['labelMapping', 'labelName'],
  }],
  // 来源于热点标签: 客户标签，可开通业务过滤器
  sightingTelescope: [{
    filterName: 'primaryKeyLabels',
    value: ['labelMapping', 'labelName'],
  }, 'unrights'],
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
    // type.a|category.b,c,d
    let filterList = sourceFilter[source];
    if (filterList === undefined) {
      return '';
    }
    filterList = _.isArray(filterList) ? filterList : filterList[type];
    const finalFilterList = _.map(filterList, (filterItem) => {
      if (_.isPlainObject(filterItem)) {
        const filterValue = _.map(filterItem.value, item => data[item]);
        return `${decodeURIComponent(filterItem.filterName)}.${decodeURIComponent(filterValue.join(','))}`;
      }
      return `${decodeURIComponent(filterItem)}.`;
    });
    return finalFilterList.join('|');
  },
  // 将url上面的filter编码解析为对象
  transfromFilterValFromUrl(filters) {
    // 处理由‘|’分隔的多个过滤器
    const filtersArray = filters ? filters.split('|') : [];

    return _.reduce(filtersArray, (result, value) => {
      const [name, code] = value.split('.');
      let filterValue = code;

      // 如果是多选，需要继续处理','分割的多选值
      if (code.indexOf(',') > -1) {
        filterValue = code.split(',');
      }

      if (name === 'minFee' || name === 'totAset') {
        const minVal = filterValue[0] && filterValue[0].replace('!', '.');
        const maxVal = filterValue[1] && filterValue[1].replace('!', '.');
        filterValue = [minVal, maxVal];
      }

      // 如果对应的过滤器是普通股基佣金率
      result[name] = filterValue; // eslint-disable-line
      return result;
    }, {});
  },
};

export default helper;
