import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FilterWrapper from '../FilterWrapper';
import RangeFilterMenu from './RangeFilterMenu';

function getFilterValue({ value, unit, defaultLabel }) {
  if (!value[0] && !value[1]) {
    return defaultLabel;
  } else if (!value[0]) {
    return `≤ ${value[1]}${unit}`;
  } else if (!value[1]) {
    return `≥ ${value[0]}${unit}`;
  } else if (value[0] === value[1]) {
    return `= ${value[0]}${unit}`;
  }

  return `${value[0]}${unit} - ${value[1]}${unit}`;
}

export default class RangeFilter extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    unit: PropTypes.string,
    unitStyle: PropTypes.object,
    filterName: PropTypes.string.isRequired,
    filterId: PropTypes.string,
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function({label, value})
    onClose: PropTypes.func, // 点击关闭图标的回调
    isCloseable: PropTypes.bool,
    defaultLabel: PropTypes.string,
    dropdownStyle: PropTypes.object,
    defaultVisible: PropTypes.bool,
    disabled: PropTypes.bool,
    isReturnItems: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    isCloseable: false,
    isReturnItems: false,
    defaultLabel: '不限',
    defaultVisible: false,
    disabled: false,
    filterId: '',
    value: [],
    unit: '‰',
    unitStyle: {},
    onClose: () => {},
    dropdownStyle: {
      width: '276px',
    },
  }

  onChange = (value) => {
    this.props.onChange({
      name: this.props.filterId,
      value: [value.min, value.max],
    });
  }

  render() {
    const {
      value,
      unit,
      unitStyle,
      ...restProps
    } = this.props;

    let renderValue = value;

    if (!_.isArray(value)) {
      renderValue = [value];
    }

    const menuProps = {
      value: renderValue,
      onChange: this.onChange,
      unit,
      unitStyle,
    };

    const filterValue = getFilterValue(this.props);

    return (
      <FilterWrapper
        className={this.props.className}
        filterName={this.props.filterName}
        filterValue={filterValue}
        onClose={this.props.onClose}
        isCloseable={this.props.isCloseable}
        MenuComponent={RangeFilterMenu}
        MenuProps={menuProps}
        dropdownStyle={this.props.dropdownStyle}
        isAlwaysVisible
        {...restProps}
      />
    );
  }
}
