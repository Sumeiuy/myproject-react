/**
 * 共用的方法
 */
import _ from 'lodash';
import sourceFilter from './config';
import filterMark from '../../config/filterSeperator';

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
    const { filterSeperator, filterInsideSeperator, filterValueSeperator } = filterMark;
    // 将筛选项组装成
    // type.a|category.b,c,d
    let filterList = sourceFilter[source];
    if (filterList === undefined) {
      return '';
    }
    filterList = _.isArray(filterList) ? filterList : filterList[type];
    const finalFilterList = _.map(filterList, (filterItem) => {
      if (_.isPlainObject(filterItem)) {
        const filterValue = _.map(filterItem.value, item => decodeURIComponent(data[item]));
        return `${filterItem.filterName}${filterInsideSeperator}${filterValue.join(filterValueSeperator)}`;
      }
      return `${filterItem}${filterInsideSeperator}`;
    });
    return finalFilterList.join(filterSeperator);
  },
};

export default helper;
