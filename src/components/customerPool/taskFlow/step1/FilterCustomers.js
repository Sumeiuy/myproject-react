/**
 * @file components/customerPool/taskFlow/FilterCustomers.js
 *  瞄准镜筛查客户弹窗-客户筛选
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import { SingleFilter, MultiFilter } from '../../../common/filter';

// 数据转化
// [{itemCode: '1', itemDesc: 'fg'}] => [{key: '1', value: 'fg'}]
const transformData = list => _.map(list, o => (
  {
    key: o.itemCode,
    value: o.itemDesc,
  }
));

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
    if (source !== 'jzyx' ||
      _.isEmpty(sightingTelescopeFilters) || _.isEmpty(sightingTelescopeFilters.filterList)) {
      return null;
    }
    return _.map(sightingTelescopeFilters.filterList, (obj) => {
      let backfillValue = '';
      _.forEach(currentItems, (item) => {
        const [name, value] = item.split('.');
        if (name === obj.filterCode) {
          backfillValue = value;
        }
      });
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
    let CustomType = '';
    let CustClass = '';
    let RiskLvl = '';
    let Rights = '';
    _.forEach(currentItems, (item) => {
      const [name, value] = item.split('.');
      if (name === 'CustomType') {
        CustomType = value;
      }
      if (name === 'CustClass') {
        CustClass = value;
      }
      if (name === 'RiskLvl') {
        RiskLvl = value;
      }
      if (name === 'Rights') {
        Rights = value;
      }
    });
    return (
      <div className="filter">
        {this.renderSightingTelescopeFilter()}
        <SingleFilter
          value={CustomType || ''}
          filterLabel="客户性质"
          filter="CustomType"
          filterField={dict.custNature}
          onChange={onFilterChange}
        />
        <SingleFilter
          value={CustClass || ''}
          filterLabel="客户类型"
          filter="CustClass"
          filterField={dict.custType}
          onChange={onFilterChange}
        />
        <SingleFilter
          value={RiskLvl || ''}
          filterLabel="风险等级"
          filter="RiskLvl"
          filterField={dict.custRiskBearing}
          onChange={onFilterChange}
        />
        <MultiFilter
          value={Rights || ''}
          filterLabel="已开通业务"
          filter="Rights"
          filterField={dict.custBusinessType}
          onChange={onFilterChange}
        />
      </div>
    );
  }
}
