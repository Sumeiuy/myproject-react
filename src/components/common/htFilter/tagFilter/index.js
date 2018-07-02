import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FilterWrapper } from 'lego-react-filter/src';
import TagFilterMenu from './TagFilterMenu';


function getOptionValue(list, key, value, defaultLabel) {
  const currentValue = _.find(value, item => item.key === key);
  const optionItem = _.find(list, item => item.itemCode === currentValue.optionKey);
  return optionItem ? optionItem.itemDesc : defaultLabel;
}

function getValue(value, data, defaultLabel) {
  if (_.isEmpty(value)) {
    return defaultLabel;
  }
  const selectItems = _.map(value, obj => _.find(data, item => item.filterId === obj.key));

  const selectValue = _.map(selectItems, obj => ({
    value: obj.filterDesc,
    optionValue: getOptionValue(obj.items, obj.filterId, value, defaultLabel),
  }));

  return selectValue;
}

function getToolTipValue(value, data, defaultLabel) {
  const valueList = getValue(value, data, defaultLabel);
  if (_.isArray(valueList)) {
    return _.map(valueList, item => ({
      title: item.value,
      value: item.optionValue,
    }));
  }

  return valueList;
}

function getFilterValue(value, data, defaultLabel) {
  const valueList = getValue(value, data, defaultLabel);

  let returnValue = '';

  if (_.isArray(valueList)) {
    _.each(valueList, (item) => {
      if (returnValue) {
        returnValue = `${returnValue}且${item.value}:${item.optionValue}`;
      } else {
        returnValue = `${item.value}:${item.optionValue}`;
      }
    });
  } else {
    returnValue = valueList;
  }

  return returnValue;
}

export default class TagFilter extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.array,
    data: PropTypes.array.isRequired,
    filterName: PropTypes.string,
    filterId: PropTypes.string,
    onChange: PropTypes.func, // 选中某项的回调， function({label, value})
    onClose: PropTypes.func, // 点击关闭图标的回调
    defaultLabel: PropTypes.string,
    dropdownStyle: PropTypes.object,
    defaultVisible: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    filterName: '阻止',
    onChange: () => {},
    value: [],
    defaultLabel: '不限',
    defaultVisible: false,
    disabled: false,
    filterId: '',
    onClose: () => { },
    dropdownStyle: {
      width: '296px',
    },
  }

  onChange = (value) => {
    this.props.onChange({
      id: this.props.filterId,
      name: this.props.filterName,
      value,
    });
  }

  render() {
    const {
      value,
      data,
      defaultLabel,
      ...restProps
    } = this.props;

    const menuProps = {
      value,
      onChange: this.onChange,
      data,
    };

    const filterValue = getFilterValue(value, data, defaultLabel);

    const tooltipValue = getToolTipValue(value, data, defaultLabel);

    return (
      <FilterWrapper
        className={this.props.className}
        filterName={this.props.filterName}
        filterValue={filterValue}
        onClose={this.props.onClose}
        MenuComponent={TagFilterMenu}
        MenuProps={menuProps}
        dropdownStyle={this.props.dropdownStyle}
        isAlwaysVisible
        tooltipValue={tooltipValue}
        usetoolTip
        isCloseable
        {...restProps}
      />
    );
  }
}
