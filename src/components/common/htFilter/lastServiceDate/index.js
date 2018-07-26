import React from 'react';
import _ from 'lodash';
import HtFilter from 'lego-react-filter/src';
import LastServiceDateMenu from './LastServiceDateMenu';

function getFilterValue(value) {
  let preFix = '';
  let postFix = '';

  if (!value || (!value[0] && !value[1])) {
    return (<span>最近一次服务时间:<span style={{ marginLeft: 8 }}>不限</span></span>);
  }

  if (value[0]) {
    const dateArray = value[0].split('-');
    preFix = `${dateArray[0]}年${dateArray[1]}月${dateArray[2]}日后`;
  }

  if (value[1] === 'serviced') {
    postFix = '服务过的客户';
  }

  if (value[1] === 'unServiced') {
    postFix = '未服务的客户';
  }

  return `${preFix}${postFix}`;
}

function getDateSelectFilterLabel(obj) {
  const dateFilterValue = getFilterValue(obj.value);
  return (
    <span className="lego-dateFilterValue">{dateFilterValue}</span>
  );
}

export default function LastServiceDateFilter(props) {
  const restProps = _.omit(props, ['type', 'data']);
  return (
    <HtFilter
      {...restProps}
      type="form"
      menuComponent={LastServiceDateMenu}
      dropdownStyle={{
        maxHeight: 324,
        width: 256,
        position: 'static',
      }}
      getFilterLabelValue={getDateSelectFilterLabel}
    />
  );
}

