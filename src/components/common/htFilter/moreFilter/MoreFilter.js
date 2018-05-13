import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FilterWrapper from '../FilterWrapper';
import MoreFilterMenu from './MoreFilterMenu';

export default class MoreFilter extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.array.isRequired, // Menu显示的数据源， [{label:,value: }]
    onChange: PropTypes.func, // 选中某项的回调， function({label, value})
    selectedKeys: PropTypes.array, // 默认带进来选中的Item数组
    defaultOpenKeys: PropTypes.array,
    insideMenuProps: PropTypes.object,
    menuStyle: PropTypes.object,
  }

  static defaultProps = {
    className: '',
    selectedKeys: [],
    onChange: () => {},
    defaultOpenKeys: [],
    insideMenuProps: {},
    menuStyle: {},
  }


  render() {
    const {
      data,
      onChange,
      defaultOpenKeys,
      selectedKeys,
      insideMenuProps,
      menuStyle,
      ...restProps
    } = this.props;

    const menuProps = {
      data,
      onChange,
      defaultOpenKeys,
      selectedKeys,
      insideMenuProps,
      menuStyle,
    };

    const filterValue = '';

    return (
      <FilterWrapper
        className={this.props.className}
        filterName="更多"
        filterValue={filterValue}
        MenuComponent={MoreFilterMenu}
        MenuProps={menuProps}
        isAlwaysVisible
        isMoreButton
        {...restProps}
      />
    );
  }
}
