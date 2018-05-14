import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FilterWrapper from '../FilterWrapper';
import MultiFilterMenu from './MultiFilterMenu';

function getFilterValue(value, data, defaultLabel) {
  if (value[0] === '') {
    return defaultLabel;
  }
  return _.map(value, key => _.find(data, item => item.key === key).value);
}

export default class MultiFilter extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    filterName: PropTypes.string.isRequired,
    filterId: PropTypes.string,
    data: PropTypes.array, // Menu显示的数据源， [key:,value: }]
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function([{key, value}])
    onClose: PropTypes.func, // 点击关闭图标的回调
    isCloseable: PropTypes.bool,
    defaultLabel: PropTypes.string,
    defaultVisible: PropTypes.bool,
    disabled: PropTypes.bool,
    isReturnItems: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    value: [''],
    filterId: '',
    isReturnItems: false,
    data: [{ key: '', value: '不限' }],
    isCloseable: false,
    defaultLabel: '不限',
    onClose: () => {},
    defaultVisible: false,
    disabled: false,
  }

  onChange = (selectedItems) => {
    this.props.onChange({
      name: this.props.filterId,
      value: selectedItems,
    });
  }

  render() {
    const {
      value,
      data,
      defaultLabel,
      ...restProps
    } = this.props;

    let renderValue = value;

    if (!_.isArray(value)) {
      renderValue = [value];
    }

    const menuProps = {
      value: renderValue,
      data,
      onChange: this.onChange,
      defaultLabel,
    };

    const filterValue = getFilterValue(renderValue, data, defaultLabel);

    return (
      <FilterWrapper
        className={this.props.className}
        filterName={this.props.filterName}
        filterValue={filterValue}
        onClose={this.props.onClose}
        isCloseable={this.props.isCloseable}
        MenuComponent={MultiFilterMenu}
        MenuProps={menuProps}
        isAlwaysVisible
        {...restProps}
      />
    );
  }
}
