/*
 * @Description: 服务实施的头部 筛选、排序和准确查找
 * @Author: WangJunjun
 * @Date: 2018-05-22 22:49:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-12 13:46:44
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SingleFilter, MultiFilter } from 'lego-react-filter/src';
import Sortbox from './Sortbox';
import PreciseQuery from './PreciseQuery';
import { ASSET_DESC } from './config';
import styles from './header.less';

// 状态为不限
const STATE_UNLIMITED = {
  key: '',
  value: '不限'
};

// 筛选列表的浮层父节点id
const popupContainer = '#performerViewDetail';

// 服务状态下拉列表样式
const dropdownStyle = {
  maxHeight: '324px',
  overflowY: 'auto',
  zIndex: 1,
  minWidth: '177px',
};

export default function Header(props) {
  const {
    dict,
    handleStateChange,
    customerList,
    handleCustomerChange,
    handleAssetSort,
    handlePreciseQueryChange,
    handlePreciseQueryEnterPress,
    parameter,
    targetCustList,
    queryCustomer,
    basicInfo: { missionId },
  } = props;
  const {
    state, assetSort, rowId, preciseInputValue
  } = parameter;
  const { page: { totalCount }, list } = targetCustList;
  // 客户筛选组件的自定义显示
  const getFilterLabelValue = (item) => {
    const { filterName, value } = item;
    const displayValue = !_.isEmpty(value.custId) ? `${value.name}(${value.custId})` : value.name;
    return (
      <div className={styles.customerFilterContent}>
        <span className={styles.customerFilterName}>
          {filterName}
:
        </span>
        <span className={styles.customerFilterValue} title={displayValue}>{displayValue}</span>
      </div>
    );
  };
  const handleSearchCustomer = (value) => {
    if (value) {
      queryCustomer({
        keyWord: value,
        missionId
      });
    }
  };
  const stateData = [STATE_UNLIMITED, ...dict.serveStatus];
  const { custId = '' } = _.find(customerList, { rowId }) || {};

  return (
    <div className={styles.header}>
      <MultiFilter
        filterId="state"
        filterName="服务状态"
        className={styles.filter}
        value={state}
        data={stateData}
        onChange={handleStateChange}
        menuContainer={popupContainer}
        dropdownStyle={dropdownStyle}
      />
      <SingleFilter
        filterId="rowId"
        filterName="客户"
        className={styles.filter}
        value={custId}
        data={customerList}
        dataMap={['custId', 'name']}
        onChange={handleCustomerChange}
        onInputChange={handleSearchCustomer}
        getFilterLabelValue={getFilterLabelValue}
        menuContainer={popupContainer}
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
        && (
        <PreciseQuery
          value={preciseInputValue}
          maxValue={totalCount}
          handlePreciseQueryChange={handlePreciseQueryChange}
          handlePreciseQueryEnterPress={handlePreciseQueryEnterPress}
        />
        )
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
  currentTask: PropTypes.object.isRequired,
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
