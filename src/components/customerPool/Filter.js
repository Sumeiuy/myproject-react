/**
 * @file components/customerPool/Filter.js
 *  客户池-客户列表筛选
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import _ from 'lodash';

import SingleFilter from './SingleFilter';
import MultiFilter from './MultiFilter';

// 从搜索、联想词、标签、已开通业务过来的
const SEARCH_TAG_FILTER = ['search', 'tag', 'association', 'business'];

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
          (_.includes(SEARCH_TAG_FILTER, source)) ?
            <SingleFilter
              value={CustomType || ''}
              filterLabel="客户性质"
              filter="CustomType"
              filterField={dict.custNature}
              onChange={onFilterChange}
            /> : null
        }
        {
          (_.includes(SEARCH_TAG_FILTER, source)) ?
            <SingleFilter
              value={CustClass || ''}
              filterLabel="客户类型"
              filter="CustClass"
              filterField={dict.custType}
              onChange={onFilterChange}
            /> : null
        }
        {
          (_.includes(SEARCH_TAG_FILTER, source)) ?
            <SingleFilter
              value={RiskLvl || ''}
              filterLabel="风险等级"
              filter="RiskLvl"
              filterField={dict.custRiskBearing}
              onChange={onFilterChange}
            /> : null
        }
        {
          (_.includes(SEARCH_TAG_FILTER, source)) ?
            <SingleFilter
              value={Rights || ''}
              filterLabel="已开通业务"
              filter="Rights"
              filterField={dict.custBusinessType}
              onChange={onFilterChange}
            /> : null
        }
        {
          source === 'business' ?
            <MultiFilter
              value={Rights || ''}
              filterLabel="可开通业务"
              filter="Rights22"
              filterField={dict.custBusinessType}
              onChange={onFilterChange}
            /> : null
        }
      </div>
    );
  }
}
