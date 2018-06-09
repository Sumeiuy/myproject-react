/*
 * @Description: 服务实施的头部 筛选、排序和准确查找
 * @Author: WangJunjun
 * @Date: 2018-05-22 22:49:02
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-06-09 19:07:45
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SingleFilter } from 'lego-react-filter/src';
import Sortbox from './Sortbox';
import PreciseQuery from './PreciseQuery';
import { ASSET_DESC } from './config';
import styles from './header.less';

// 状态为不限
const STATE_UNLIMITED = { key: '', value: '不限' };

export default function Header(props) {
  const {
    dict,
    handleStateChange,
    customerList,
    handleCustomerChange,
    searchCustomer,
    handleAssetSort,
    handlePreciseQueryChange,
    handlePreciseQueryEnterPress,
    parameter,
    targetCustList,
  } = props;
  const { state, assetSort, rowId, preciseInputValue } = parameter;
  const { page: { totalCount }, list } = targetCustList;
  // 客户筛选组件的自定义显示
  const getFilterLabelValue = (item) => {
    const { filterName, value } = item;
    const displayValue = !_.isEmpty(value.custId) ? `${value.custId}(${value.name})` : value.name;
    return (
      <div className={styles.customerFilterContent}>
        <span className={styles.customerFilterName}>{filterName}:</span>
        <span className={styles.customerFilterValue} title={displayValue}>{displayValue}</span>
      </div>
    );
  };
  const handleSearchCustomer = (value) => {
    if (value) {
      searchCustomer(value);
    }
  };
  const stateData = [STATE_UNLIMITED, ...dict.serveStatus];
  const currentCustomer = _.find(customerList, { rowId }) || {};
  const currentCustId = currentCustomer ? currentCustomer.custId : '';
  return (
    <div className={styles.header}>
      <SingleFilter
        filterId="state"
        filterName="服务状态"
        className={styles.filter}
        value={state}
        defaultSelectLabel="不限"
        data={stateData}
        onChange={handleStateChange}
      />
      <SingleFilter
        filterId="rowId"
        filterName="客户"
        className={styles.filter}
        value={currentCustId}
        defaultSelectLabel="不限"
        data={customerList}
        dataMap={['custId', 'name']}
        onChange={handleCustomerChange}
        onInputChange={handleSearchCustomer}
        getFilterLabelValue={getFilterLabelValue}
        showSearch
        needItemObj
      />
      <Sortbox
        name="总资产"
        sortId="assetSort"
        onChange={handleAssetSort}
        isDesc={assetSort === ASSET_DESC}
      />
      {
        !_.isEmpty(list)
        && <PreciseQuery
          value={preciseInputValue}
          maxValue={totalCount}
          handlePreciseQueryChange={handlePreciseQueryChange}
          handlePreciseQueryEnterPress={handlePreciseQueryEnterPress}
        />
      }
    </div>
  );
}

Header.propTypes = {
  dict: PropTypes.object.isRequired,
  customerList: PropTypes.array,
  handleStateChange: PropTypes.func,
  handleCustomerChange: PropTypes.func,
  searchCustomer: PropTypes.func,
  handleAssetSort: PropTypes.func,
  handlePreciseQueryChange: PropTypes.func,
  handlePreciseQueryEnterPress: PropTypes.func,
  parameter: PropTypes.object.isRequired,
  targetCustList: PropTypes.object.isRequired,
};

Header.defaultProps = {
  customerList: [],
  handleCustomerChange: _.noop,
  handleStateChange: _.noop,
  searchCustomer: _.noop,
  handleAssetSort: _.noop,
  handlePreciseQueryChange: _.noop,
  handlePreciseQueryEnterPress: _.noop,
};

