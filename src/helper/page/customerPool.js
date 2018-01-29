/**
 * @Author: wangjunjun
 * @description 目标客户池
 */

import _ from 'lodash';

const customerPool = {
  getCustomerListFilters(filtersArray = [], labels = [], filters = []) {
    const newFilters = [...filters];
    let newLabels = [...labels];
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
      if (!_.includes(['Unrights', 'Rights', 'RiskLvl', 'CustClass', 'CustomType'], name) && value) {
        const itemList = value.split(',');
        newLabels = [
          ...newLabels,
          ...itemList,
        ];
      }
    });
    return {
      filters: newFilters,
      labels: newLabels,
    };
  },
};

export default customerPool;
