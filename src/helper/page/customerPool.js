/**
 * @Author: wangjunjun
 * @description 目标客户池
 */

import _ from 'lodash';
import store from 'store';

const customerPool = {
  getCustomerListFilters(filtersArray = [], labelId = '', filters = []) {
    const newFilters = [...filters];
    let newLabels = labelId ? [labelId] : [];
    _.forEach(filtersArray, (item) => {
      const [name, value] = item.split('.');
      // 可开通
      if (name === 'Unrights' && value) {
        newFilters.push({
          filterType: name,
          filterContentList: value.split(','),
        });
      }
      // 已开通
      if (name === 'Rights' && value) {
        newFilters.push({
          filterType: name,
          filterContentList: value.split(','),
        });
      }
      // 风险等级
      if (name === 'RiskLvl' && value) {
        newFilters.push({
          filterType: name,
          filterContentList: value.split(','),
        });
      }
      // 客户类型
      if (name === 'CustClass' && value) {
        newFilters.push({
          filterType: name,
          filterContentList: value.split(','),
        });
      }
      // 客户性质
      if (name === 'CustomType' && value) {
        newFilters.push({
          filterType: name,
          filterContentList: value.split(','),
        });
      }
      // 瞄准镜的动态筛选
      if (!_.includes(['Unrights', 'Rights', 'RiskLvl', 'CustClass', 'CustomType'], name) && value !== undefined) {
        const itemList = value.split(',');
        newLabels = [
          ...newLabels,
          ...itemList,
        ];
      }
    });
    return {
      filters: newFilters,
      labels: _.filter(newLabels, item => item !== ''),
    };
  },

  // 获取存储在本地的标签的信息
  getLabelInfo(id = '') {
    const label = store.get(`${id}-labelDesc`);
    return label || {};
  },
};

export default customerPool;

export const {
  getCustomerListFilters,
  getLabelInfo,
} = customerPool;
