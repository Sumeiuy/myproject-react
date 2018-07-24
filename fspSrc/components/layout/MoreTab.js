/**
 * @file components/layout/MoreTab.js
 * 更多的tab按钮
 * @author yuanhaojie
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Menu, Dropdown, Icon } from 'antd';
import { autobind } from 'core-decorators';
import styles from './moreTab.less';

const menuStyle = {
  border: '1px solid #ddd',
  borderRadius: '0 0 4px 4px',
};

export default class MoreTab extends PureComponent {
  static propTypes = {
    activeKey: PropTypes.string.isRequired,
    moreTabArray: PropTypes.array.isRequired,
    onRemove: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    onLinkClick: PropTypes.func.isRequired,
  }


  getMenuItem(menuItem, closeable) {
    const { activeKey, path } = this.props;
    // 可关闭 tab 通过 activeKey 判断是否高亮
    // 递归菜单通过 path 判断是否高亮
    const isActive =
      menuItem.id === activeKey || (menuItem.path === path);

    return (
      <Menu.Item
        key={menuItem.id}
        className={classnames({
          [styles.menuItem]: true,
          [styles.itemActive]: isActive,
        })}
      >
        {
          closeable ?
            <div className={styles.menuTab}>
              <div
                className={classnames({
                  [styles.text]: true,
                  [styles.textActive]: isActive,
                })}
                title={`${menuItem.name}`}
                onClick={() => this.change(menuItem.id, activeKey)}
              >
                {menuItem.name}
              </div>
              <div className={styles.close} onClick={() => this.remove(menuItem.id)}>
                <Icon type="close" />
              </div>
            </div> :
            <div
              className={classnames({
                [styles.text]: true,
                [styles.textActive]: isActive,
              })}
              title={menuItem.name}
              onClick={() => this.linkClick(menuItem)}
            >
              {menuItem.name}
            </div>
        }
      </Menu.Item>
    );
  }

  // 根据是否包含菜单，进行递归处理
  getMenus(array, closeable = true) {
    const { activeKey } = this.props;

    return array.map((item) => {
      const isActive = item.id === activeKey;
      if (item.children && !_.isEmpty(item.children)) {
        return (
          <Menu.SubMenu
            key={item.id}
            title={item.name}
            className={classnames({
              [styles.subMenu]: true,
              [styles.menuActive]: isActive,
            })}
          >
            {this.getMenus(item.children, false)}
          </Menu.SubMenu>
        );
      }
      // 非菜单的内容认为是可关闭的 tab
      return this.getMenuItem(item, closeable);
    });
  }

  @autobind
  remove(key) {
    const { onRemove } = this.props;
    onRemove(key);
  }

  @autobind
  change(key, activeKey) {
    const { onChange } = this.props;
    if (key !== activeKey) {
      onChange(key);
    }
  }

  @autobind
  linkClick(menuItem) {
    const { onLinkClick } = this.props;
    onLinkClick(menuItem);
  }

  render() {
    const { moreTabArray, activeKey } = this.props;
    const tabNum = moreTabArray.length;
    const isActive = !!_.find(moreTabArray, item => item.id === activeKey);

    const menus = (
      <Menu style={menuStyle}>
        <Menu.Item key="text" disabled>
          <div className={styles.text}>{`更多（${tabNum}）`}</div>
        </Menu.Item>
        <Menu.Divider />
        {
          this.getMenus(moreTabArray)
        }
      </Menu>
    );

    return (
      <div className={styles.moreTab}>
        <Dropdown
          placement="bottomLeft"
          overlay={menus}
          trigger={['hover']}
        >
          <div className={isActive ? styles.tabActive : null}>
            <div>
              {tabNum}
            </div>
          </div>
        </Dropdown>
      </div>
    );
  }
}
