/**
 * 共用的方法
 */
import _ from 'lodash';
import moment from 'moment';
import { sourceFilter, kPIDateScopeType, PER_CODE, ORG_CODE, CONFIG_TAB_PRODUCTCENTER } from './config';
import { dynamicInsertQuota } from '../customerPool/list/sort/config';
import filterMark from '../../config/filterSeperator';
import { openFspTab, openFspIframeTab } from '../../utils';
import { url as urlHelper, dva } from '../../helper';
import { logCommon } from '../../decorators/logable';

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

  /**
   * 首页下钻到客户列表需要的过滤器参数
   * @param data
   * @returns {string}
   */
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
    let filterData = data;
    // 添加可开通业务字典数据
    let { app: { dict: { custUnrightBusinessType } } } = dva.getStore().getState();
    custUnrightBusinessType = _.map(custUnrightBusinessType, item => item.key);
    custUnrightBusinessType = _.compact(custUnrightBusinessType);
    filterData = {
      ...filterData,
      custUnrightBusinessType,
    };
    // 当存在周期时，需要统一转换成该周期的开始时间，结束时间
    if (filterData.cycleSelect) {
      filterData = {
        ...filterData,
        ...transformCycle(filterData.cycleSelect),
      };
    }
    // 根据配置（业务需求）获取需要打开的过滤器列表
    filterList = _.isArray(filterList) ? filterList : filterList[type];
    // 按照首页下钻与客户列表约定的param 格式进行值得格式化
    const finalFilterList = _.map(filterList, (filterItem) => {
      if (_.isPlainObject(filterItem)) {
        const { defaultVal = {} } = filterItem;
        // 根据配置中每个过滤器的value（入参的key），在入参中取值（因为每个过滤器的值无特定规律，直接根据入参和配置确定）
        // 如果下钻时该过滤器的值固定，则直接在defaultVal中配置
        let filterValue = _.map(filterItem.value, (item) => {
          const currentValue = filterData[item];
          if (currentValue) {
            return currentValue;
          }
          return defaultVal[item];
        });
        filterValue = _.flattenDeep(filterValue);
        // 下钻param格式化(与客户列表约定)
        return `${filterItem.filterName}${filterInsideSeperator}${filterValue.join(filterValueSeperator)}`;
      }
      // 下钻params格式化（与客户列表约定）
      return `${filterItem}${filterInsideSeperator}`;
    });
    // 下钻param格式化（与客户列表约定）
    return finalFilterList.join(filterSeperator);
  },

  /**
   * 首页下钻到客户列表需要添加的排序params
   * @param filter
   * @returns {{sortType: string, sortDirection: string}}
   */
  getSortParam(filter) {
    const filters = urlHelper.transfromFilterValFromUrl(filter);
    const finalSortQuota = _.find(
      dynamicInsertQuota,
      item => _.has(filters, item.filterType),
    );
    const { sortType = '' } = finalSortQuota || {};
    return {
      sortType,
      sortDirection: sortType ? DEFAULT_SORT_DIRE : '',
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
    const url = `/customerCenter/360/${type}/main?id=${custId}&rowId=${rowId}&ptyId=${ptyId}&keyword=${keyword}`;
    const pathname = '/customerCenter/fspcustomerDetail';
    openFspTab({
      routerAction,
      url,
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
        url,
      },
    });
  },

  /**
   * 跳转到产品详情tab页面
   * @param {*} param0
   *    data: 持仓产品信息
   *    routerAction: 路由的变化方式
   */
  openProductDetailPage({ data, routerAction }) {
    // upPrdtTypeId：产品所属类型id, code：产品代码
    const { upPrdtTypeId, code, name } = data;
    const param = CONFIG_TAB_PRODUCTCENTER[upPrdtTypeId];
    const pathname = '/htsc-product-base/htsc-prdt-web/index.html/?_#/productDetailPage';
    const query = { prdtId: code };
    const url = `${pathname}?${urlHelper.stringify(query)}`;
    openFspIframeTab({
      routerAction,
      url,
      query,
      pathname,
      param,
    });
    // 神策日志
    logCommon({
      type: 'Click',
      payload: {
        name: `客户列表${name}下钻到产品中心`,
        value: code,
      },
    });
  },
};

export default helper;
