/**
 * 共用的方法
 */
import _ from 'lodash';
import moment from 'moment';
import { sourceFilter, kPIDateScopeType, PER_CODE, ORG_CODE } from './config';
import filterMark from '../../config/filterSeperator';
import { openFspTab } from '../../utils';

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
   * 持仓行业的详情按钮是否可见
   * @param {*} param0
   *   hasNPCTIQPermission  是否有HTSC 交易信息查询权限（非私密客户）
   *   hasPCTIQPermission  是否有HTSC 交易信息查询权限（含私密客户）
   *   empInfo  登录用户的信息
   *   customerData  当前客户的信息
   */
  getDetailBtnVisible({ hasNPCTIQPermission, hasPCTIQPermission, empInfo, customerData }) {
    const { isPrivateCustomer, empId } = customerData;
    // 默认不展示查看详情的按钮
    let isShowDetailBtn = false;
    // 有“HTSC 交易信息查询权限（含私密客户）”可以看所有客户的持仓行业信息
    // 主服务经理 可以看名下所有客户的持仓信息
    // 有“HTSC 交易信息查询权限（非私密客户）”可以看非私密客户的持仓行业信息
    if (
      hasPCTIQPermission
      || empInfo.rowId === empId
      || (hasNPCTIQPermission && !isPrivateCustomer)
    ) {
      isShowDetailBtn = true;
    }
    return isShowDetailBtn;
  },
};

export default helper;
