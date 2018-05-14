import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FilterWrapper from '../FilterWrapper';
import SingleFilterMenu from './SingleFilterMenu';

export default class SingleFilter extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
    filterName: PropTypes.string.isRequired,
    filterId: PropTypes.string,
    data: PropTypes.array, // Menu显示的数据源， [{label:,value: }]
    optionList: PropTypes.array,
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function({label, value})
    onClose: PropTypes.func, // 点击关闭图标的回调
    isCloseable: PropTypes.bool,
    showSearch: PropTypes.bool,
    onPressEnter: PropTypes.func,
    onInputChange: PropTypes.func,
    placeholder: PropTypes.string,
    defaultVisible: PropTypes.bool,
    disabled: PropTypes.bool,
    isReturnItems: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    value: '',
    filterId: '',
    isCloseable: false,
    showSearch: false,
    disabled: false,
    isReturnItems: false,
    placeholder: '搜索',
    data: [{ key: '', value: '不限' }],
    onClose: () => {},
    onPressEnter: () => {},
    onInputChange: () => {},
    defaultVisible: false,
    optionList: [],
  }

  onChange = (item) => {
    if (this.props.isReturnItems) {
      this.props.onChange({
        name: this.props.filterId,
        value: item,
      });
    } else {
      this.props.onChange({
        name: this.props.filterId,
        value: item.key,
      });
    }
  }

  getFilterValue = key => this.props.data.filter(item => item.key === key)[0].value;


  render() {
    const {
      value,
      data,
      showSearch,
      onPressEnter,
      onInputChange,
      placeholder,
      optionList,
      ...restProps
    } = this.props;

    const filterValue =
      this.props.showSearch ? (this.props.value[1] || '不限') : this.getFilterValue(this.props.value);

    const menuProps = {
      value,
      data,
      showSearch,
      onChange: this.onChange,
      onPressEnter,
      onInputChange,
      placeholder,
      optionList,
    };

    return (
      <FilterWrapper
        className={this.props.className}
        filterName={this.props.filterName}
        filterValue={filterValue}
        onClose={this.props.onClose}
        isCloseable={this.props.isCloseable}
        MenuComponent={SingleFilterMenu}
        MenuProps={menuProps}
        isAlwaysVisible
        {...restProps}
      />
    );
  }
}
