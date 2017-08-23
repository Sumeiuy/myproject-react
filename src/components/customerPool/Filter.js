/**
 * @file components/customerPool/Filter.js
 *  客户池-客户列表筛选
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import _ from 'lodash';

import SingleFilter from './SingleFilter';

export default class Filter extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  }

  render() {
    const { dict, location, onFilterChange } = this.props;
    const {
      CustomType,
      CustClass,
      RiskLvl,
      Rights,
      source,
    } = location.query;
    return (
      <div className="filter">
        {
          (_.includes(['search', 'tag', 'association', 'business'], source)) ?
            <SingleFilter
              value={CustomType || ''}
              filterLabel="客户性质"
              filter="CustomType"
              filterField={dict.custNature}
              onChange={onFilterChange}
            /> : null
        }
        {
          (_.includes(['search', 'tag', 'association', 'business'], source)) ?
            <SingleFilter
              value={CustClass || ''}
              filterLabel="客户类型"
              filter="CustClass"
              filterField={dict.custType}
              onChange={onFilterChange}
            /> : null
        }
        {
          (_.includes(['search', 'tag', 'association', 'business'], source)) ?
            <SingleFilter
              value={RiskLvl || ''}
              filterLabel="风险等级"
              filter="RiskLvl"
              filterField={dict.custRiskBearing}
              onChange={onFilterChange}
            /> : null
        }
        {
          (_.includes(['search', 'tag', 'association', 'business'], source)) ?
            <SingleFilter
              value={Rights || ''}
              filterLabel="已开通业务"
              filter="Rights"
              filterField={dict.custBusinessType}
              onChange={onFilterChange}
            /> : null
        }
      </div>
    );
  }
}
