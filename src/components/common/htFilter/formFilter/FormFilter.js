import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FilterWrapper from '../FilterWrapper';

function getFilterValue(props) {
  const valueStringify = props.value.join(',');
  return `${props.filterName}：${valueStringify}`;
}
export default class FormFilter extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    filterName: PropTypes.string.isRequired,
    filterId: PropTypes.string,
    defaultLabel: PropTypes.string, // 默认情况下展示在按钮上的中文字段
    data: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]), // form元素取的英文代号值
    onChange: PropTypes.func, // 选中某项的回调， function({label, value})
    onClose: PropTypes.func, // 点击关闭图标的回调
    menuProps: PropTypes.object,
    menuComponent: PropTypes.func.isRequired,
    getFilterValue: PropTypes.func,
    isCloseable: PropTypes.bool,
    dropdownStyle: PropTypes.object,
    defaultVisible: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    isCloseable: false,
    defaultLabel: '不限',
    defaultVisible: false,
    disabled: false,
    filterId: '',
    value: ['', ''],
    data: [],
    onClose: () => {},
    onChange: () => {},
    getFilterValue,
    menuProps: {},
    dropdownStyle: {
      width: '276px',
    },
  }

  onChange = (value) => {
    this.props.onChange({
      name: this.props.filterId,
      value,
    });
  }

  render() {
    const {
      value,
      data,
      ...restProps
    } = this.props;

    let renderValue = value;

    if (!_.isArray(value)) {
      renderValue = [value]; // 表单元素的取值以数组的方式抛出，也需要以这种方式提供
    }

    const menuProps = {
      value: renderValue,
      onChange: this.onChange,
      data,
      ...this.props.menuProps,
    };

    const filterValue = this.props.getFilterValue(this.props);

    return (
      <FilterWrapper
        className={this.props.className}
        filterName={this.props.filterName}
        filterValue={filterValue}
        onClose={this.props.onClose}
        isCloseable={this.props.isCloseable}
        MenuComponent={this.props.menuComponent}
        MenuProps={menuProps}
        dropdownStyle={this.props.dropdownStyle}
        isAlwaysVisible
        isFormFilter
        {...restProps}
      />
    );
  }
}
