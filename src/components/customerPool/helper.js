/**
 * 共用的方法
 */
import _ from 'lodash';
import moment from 'moment';
import { sourceFilter, kPIDateScopeType, PER_CODE, ORG_CODE } from './config';
import { dynamicInsetQuota } from '../customerPool/list/sort/config';
import filterMark from '../../config/filterSeperator';
import { openFspTab } from '../../utils';
import { url } from '../../helper';

const DEFAULT_SORT_DIRE = 'desc';

function transformCycle(cycle) {
  const transToTime = period => ({
    cycleStartTime: moment().startOf(period).format('YYYY-MM-DD'),
    cycleEndTime: moment().endOf(period).format('YYYY-MM-DD'),
  });
  const cycleKey = _.findKey(kPIDateScopeType, ['id', cycle]);
  return transToTime(cycleKey);
}

const helper = {
  /**
   * 判断是否是瞄准镜
   * @param {*} value
   */
  isSightingScope(value) {
    return value === 'jzyx';
  },
  transformDateTypeToDate(cycle) {
    return transformCycle(cycle);
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
        const { defaultVal = {} } = filterItem;
        const filterValue = _.map(filterItem.value, (item) => {
          const currentValue = filterData[item];
          if (currentValue) {
            return currentValue;
          }
          return defaultVal[item];
        });
        return `${filterItem.filterName}${filterInsideSeperator}${filterValue.join(filterValueSeperator)}`;
      }
      return `${filterItem}${filterInsideSeperator}`;
    });
    return finalFilterList.join(filterSeperator);
  },
  getSortParam(filter) {
    const filters = url.transfromFilterValFromUrl(filter);
    const finalSortQuota = _.find(dynamicInsetQuota,
        item => _.has(filters, item.filterType));
    const { sortType = '' } = finalSortQuota || {};
    return {
      sortType,
      sortDirection: DEFAULT_SORT_DIRE,
    };
  },
  /**
   * 跳转到360服务记录页面
   * @param {*object} itemData 当前列表item数据
   * @param {*} keyword 当前输入关键字
   * @param {*} routerAction 跳转的方式：  push、replace
   */
  handleOpenFsp360TabAction({ itemData, keyword, routerAction }) {
    const { pOrO, custId, rowId, ptyId } = itemData;
    const type = (!pOrO || pOrO === PER_CODE) ? PER_CODE : ORG_CODE;
    const detailUrl = `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}&keyword=${keyword}`;
    const pathname = '/customerCenter/fspcustomerDetail';
    openFspTab({
      routerAction,
      url: detailUrl,
      query: {
        custId,
        rowId,
        ptyId,
        keyword,
      },
      pathname,
      param: {
        id: 'FSP_360VIEW_M_TAB',
        title: '客户360视图-客户信息',
        forceRefresh: true,
        activeSubTab: ['服务记录'],
        // 服务记录搜索
        serviceRecordKeyword: keyword,
        // 服务渠道
        serviceRecordChannel: encodeURIComponent('理财服务平台'),
      },
      state: {
        url: detailUrl,
      },
    });
  },
};

export default helper;
