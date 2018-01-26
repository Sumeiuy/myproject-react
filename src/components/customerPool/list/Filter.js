/**
 * @file components/customerPool/Filter.js
 *  客户池-客户列表筛选
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { SingleFilter, MultiFilter } from '../../common/filter';

// 从搜索、联想词、标签、已开通业务过来的
const SEARCH_TAG_FILTER = ['search', 'tag', 'association', 'business', 'custIndicator', 'numOfCustOpened'];

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
      unright_type: unrightType,
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
            <MultiFilter
              value={Rights || ''}
              filterLabel="已开通业务"
              filter="Rights"
              filterField={dict.custBusinessType}
              onChange={onFilterChange}
            /> : null
        }
        {
          _.includes(['numOfCustOpened', 'business'], source) ?
            <MultiFilter
              value={unrightType || ''}
              filterLabel="可开通业务"
              filter="unright_type"
              filterField={dict.custUnrightBusinessType}
              onChange={onFilterChange}
            /> : null
        }
      </div>
    );
  }
}
