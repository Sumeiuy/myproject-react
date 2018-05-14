import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Menu } from 'antd';
/* import className from 'classnames'; */
import _ from 'lodash';
import styles from './moreFilterMenu.less';

const { SubMenu } = Menu;

export default class MoreFilterMenu extends PureComponent {
  static propTypes = {
    selectedKeys: PropTypes.array.isRequired, // 默认带进来选中的Item数组
    data: PropTypes.array.isRequired, // Menu显示的数据源， [{key:,value: }]
    onChange: PropTypes.func.isRequired, // 选中某项的回调， function({key, value})
    insideMenuProps: PropTypes.object.isRequired,
    menuStyle: PropTypes.object.isRequired,
    defaultOpenKeys: PropTypes.array.isRequired,
  }

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item) => {
    const { selectedKeys } = this.props;
    if (item.children && item.children.some(child => child.value)) {
      const childrenItems = this.getNavMenuItems(item.children);
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={(
              <span><span>{item.value}</span></span>
            )}
            key={item.value}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    }
    return (
      <Menu.Item key={item.value} level={1} className={styles.checkbox}>
        <Checkbox
          onChange={e => this.handleItemCheck(e, item.key)}
          checked={this.isChecked(item, selectedKeys)}
        >
          {item.value}
        </Checkbox>
      </Menu.Item>
    );
  };

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.value)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  isChecked = (item, selectedKeys) => {
    if (_.find(selectedKeys, key => key === item.key)) {
      return true;
    }
    return false;
  };

  handleItemCheck = (event, key) => {
    if (event.target.checked) {
      this.props.onChange({
        name: key,
        value: '',
      }, {
        inVisible: true,
      });
    } else {
      this.props.onChange({
        name: key,
        value: '',
        isDeleteFilterFromLocation: true,
      });
    }
  }

  render() {
    const { selectedKeys, data, defaultOpenKeys } = this.props;
    const menuProps = this.props.insideMenuProps;

    return (
      <div className={styles.moreFilterMenu}>
        <Menu
          key="Menu"
          theme="light"
          mode="inline"
          inlineIndent={14}
          multiple
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          style={this.props.menuStyle}
          {...menuProps}
        >
          {this.getNavMenuItems(data)}
        </Menu>
      </div>
    );
  }
}
