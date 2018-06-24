/**
 * 共用的方法
 */
import _ from 'lodash';
import moment from 'moment';
import { sourceFilter, kPIDateScopeType } from './config';
import filterMark from '../../config/filterSeperator';

function transformCycle(cycle) {
  const cycleStartTime = moment().format('L');
  const transToEndTime = (period, several) => moment().subtract(several, period).format('L');
  const cycleEndTimeMap = {
    month: transToEndTime('month', 1),
    season: transToEndTime('month', 3),
    year: transToEndTime('year', 1),
  };
  const cycleKey = _.findKey(kPIDateScopeType, ['id', cycle]);
  return {
    cycleStartTime,
    cycleEndTime: cycleEndTimeMap[cycleKey],
  };
}

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
    let filterList = sourceFilter[source];
    if (filterList === undefined) {
      return '';
    }
    // 当存在周期时，需要统一转换成该周期的开始时间，结束时间
    let filterData = data;
    if (filterData.cycleSelect) {
      filterData = {
        ...filterData,
        ...transformCycle(filterData.cycleSelect),
      };
    }
    filterList = _.isArray(filterList) ? filterList : filterList[type];
    const finalFilterList = _.map(filterList, (filterItem) => {
      if (_.isPlainObject(filterItem)) {
        const { defaultVal } = filterItem;
        const filterValue = _.map(filterItem.value, (item) => {
          const currentValue = filterData[item];
          if (currentValue) {
            return decodeURIComponent(currentValue);
          }
          return defaultVal[item];
        });
        return `${filterItem.filterName}${filterInsideSeperator}${filterValue.join(filterValueSeperator)}`;
      }
      return `${filterItem}${filterInsideSeperator}`;
    });
    return finalFilterList.join(filterSeperator);
  },
};

export default helper;
