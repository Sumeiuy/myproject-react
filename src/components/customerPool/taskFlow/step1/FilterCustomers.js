/**
 * @file components/customerPool/taskFlow/FilterCustomers.js
 *  瞄准镜筛查客户弹窗-客户筛选
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { isSightingScope } from '../../helper';
import { SingleFilter, MultiFilter } from '../../../common/filter';

// 数据转化
// [{itemCode: '1', itemDesc: 'fg'}] => [{key: '1', value: 'fg'}]
const transformData = list => _.map(list, item => _.mapKeys(item, (value, key) => {
  if (key === 'itemCode') {
    return 'key';
  }
  if (key === 'itemDesc') {
    return 'value';
  }
  return key;
}));

export default class Filter extends PureComponent {
  static propTypes = {
    dict: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    source: PropTypes.string.isRequired,
    currentItems: PropTypes.array.isRequired,
  }

  // 瞄准镜筛选
  @autobind
  renderSightingTelescopeFilter() {
    const {
      sightingTelescopeFilters,
      onFilterChange,
      source,
      currentItems,
    } = this.props;
    // debugger
    if (!isSightingScope(source) ||
      _.isEmpty(sightingTelescopeFilters) || _.isEmpty(sightingTelescopeFilters.filterList)) {
      return null;
    }
    return _.map(sightingTelescopeFilters.filterList, (obj) => {
      const target = _.find(currentItems, (item) => {
        const [name] = item.split('.');
        return name === obj.filterCode;
      });
      const backfillValue = (target || '').split('.')[1];
      return (<MultiFilter
        key={obj.filterCode}
        value={backfillValue}
        filterLabel={obj.filterDesc}
        filter={obj.filterCode}
        filterField={transformData(obj.items)}
        onChange={onFilterChange}
      />);
    });
  }

  render() {
    const { dict, onFilterChange, currentItems } = this.props;
    const currentValue = _.reduce(currentItems, (result, value) => {
      const [name, code] = value.split('.');
      result[name] = code; // eslint-disable-line
      return result;
    }, {});
    return (
      <div className="filter">
        {this.renderSightingTelescopeFilter()}
        <SingleFilter
          value={currentValue.CustomType || ''}
          filterLabel="客户性质"
          filter="CustomType"
          filterField={dict.custNature}
          onChange={onFilterChange}
        />
        <SingleFilter
          value={currentValue.CustClass || ''}
          filterLabel="客户类型"
          filter="CustClass"
          filterField={dict.custType}
          onChange={onFilterChange}
        />
        <SingleFilter
          value={currentValue.RiskLvl || ''}
          filterLabel="风险等级"
          filter="RiskLvl"
          filterField={dict.custRiskBearing}
          onChange={onFilterChange}
        />
        <MultiFilter
          value={currentValue.Rights || ''}
          filterLabel="已开通业务"
          filter="Rights"
          filterField={dict.custBusinessType}
          onChange={onFilterChange}
        />
      </div>
    );
  }
}
