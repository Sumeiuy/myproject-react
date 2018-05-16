import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FilterWrapper from '../FilterWrapper';
import SingleFilterMenu from './SingleFilterMenu';

export default class SingleFilter extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    emptyName: PropTypes.string,
    filterName: PropTypes.string.isRequired,
    filterId: PropTypes.string,
    optionList: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    isCloseable: PropTypes.bool,
    showSearch: PropTypes.bool,
    onPressEnter: PropTypes.func,
    onInputChange: PropTypes.func,
    placeholder: PropTypes.string,
    defaultVisible: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    emptyName: '所有人',
    value: '',
    filterId: '',
    isCloseable: false,
    showSearch: false,
    disabled: false,
    placeholder: '搜索',
    onClose: () => {},
    onPressEnter: () => {},
    onInputChange: () => {},
    defaultVisible: false,
    optionList: [],
  }

  onChange = (item) => {
    this.props.onChange(item);
  }

  render() {
    const {
      value,
      showSearch,
      onPressEnter,
      onInputChange,
      placeholder,
      optionList,
      emptyName,
      ...restProps
    } = this.props;

    const filterValue = _.isEmpty(value) ? emptyName : value.aliasName;

    const menuProps = {
      value,
      showSearch,
      onChange: this.onChange,
      onPressEnter,
      onInputChange,
      placeholder,
      optionList,
      emptyName,
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
