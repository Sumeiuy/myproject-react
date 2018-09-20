import React from 'react';
import PropTypes from 'prop-types';
import HtFilter from 'lego-react-filter/src';
import _ from 'lodash';
import AmountSelectMenu from './AmountSelectMenu';
import './index.less';

function getFilterValue({ value, unit, defaultLabel }) {
  if (!value[1] && !value[2]) {
    return defaultLabel;
  } else if (!value[1]) {
    return `< ${value[2]}${unit}`;
  } else if (!value[2]) {
    return `≥ ${value[1]}${unit}`;
  } else if (value[1] === value[2]) {
    return `= ${value[1]}${unit}`;
  }

  return `${value[1]}${unit} - ${value[2]}${unit}`;
}

const data = {
  dateType: [
    { key: '518003', value: '本月' },
    { key: '518004', value: '本季' },
    { key: '518005', value: '本年' },
  ],
};

function getAmountSelectFilterLabel(obj) {
  const findDateType = _.find(obj.data.dateType,
    item => item.key === obj.value[0]);
  const rangeValue = getFilterValue(obj);

  const prefix = findDateType ? findDateType.value : '';
  return (
    <span
      className="lego-formFilterValue"
      title={rangeValue}
    >
      <span className="lego-prefixValue">{`${prefix}${obj.filterName}:`}</span>
      <span className="lego-postfixValue">{`${rangeValue}`}</span>
    </span>
  );
}

export default function AmountSelectFilter(props) {
  const restProps = _.omit(props, ['type', 'onChange']);

  const onChange = (obj) => {
    props.onChange({
      ...obj,
      filterName: props.filterName,
    });
  };

  return (
    <HtFilter
      {...restProps}
      onChange={onChange}
      type="form"
      menuComponent={AmountSelectMenu}
      data={data}
      dropdownStyle={{
        maxHeight: 324,
        overflowY: 'auto',
        width: 278,
      }}
      menuProps={{
        unit: props.unit,
        unitStyle: props.unitStyle,
      }}
      getFilterLabelValue={getAmountSelectFilterLabel}
    />
  );
}

AmountSelectFilter.propTypes = {
  unit: PropTypes.string,
  unitStyle: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  filterName: PropTypes.string,
};

AmountSelectFilter.defaultProps = {
  filterName: '',
  unit: '元',
  unitStyle: {
    right: 8,
  },
};

