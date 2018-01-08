/**
 * @file components/customerPool/taskFlow/FilterCustomers.js
 *  瞄准镜筛查客户弹窗-客户筛选
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { SingleFilter, MultiFilter } from '../../../common/filter';

export default class FilterCustomers extends PureComponent {
  static propTypes = {
    dict: PropTypes.object.isRequired,
    currentItems: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func,
  }

  static defaultProps = {
    onFilterChange: () => { },
  }

  render() {
    const { dict, currentItems, onFilterChange } = this.props;
    const {
      CustomType,
      CustClass,
      RiskLvl,
      Rights,
    } = currentItems;
    return (
      <div className="filter">
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
