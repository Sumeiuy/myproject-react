/**
 * @file components/layout/TabMenu.js
 * 生成Tab导航菜单
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Menu, Dropdown, Icon } from 'antd';
import _ from 'lodash';
import styles from './tabMenu.less';
import MoreTab from './MoreTab';

export default class TabMenu extends PureComponent {
  static propTypes = {
    activeKey: PropTypes.string.isRequired,
    mainArray: PropTypes.array.isRequired,
    moreMenuObject: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
  }

  getMenus(array, level = 1) {
    const { path } = this.props;
    return array.map((item) => {
      if (item.children && !_.isEmpty(item.children)) {
        return (
          <Menu.SubMenu
            key={item.id}
            title={item.name}
            className={classnames({
              [styles.activeItem]: this.isActiveMenu(path, item.path, level),
              [styles.subMenuLink]: true,
            })}
          >
            {this.getMenus(item.children, level + 1)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.id}
          className={classnames({
            [styles.subItem]: true,
            [styles.activeItem]: item.path === path,
          })}
        >
          <div
            title={item.name}
            className={styles.linkItem}
            onClick={() => this.handleLinkClick(item)}
          >
            {item.name}
          </div>
        </Menu.Item>
      );
    });
  }

  @autobind
  getFirstChild(menu) {
    const firstChild = menu.children[0];
    if (firstChild.path === '' && firstChild.children) {
      return this.getFirstChild(firstChild);
    }
    return firstChild;
  }

  isActiveMenu(path, menuPath, level) {
    let pathForMatch = path;
    // 如果pathname是以fsp开头的，
    if (/^\/fsp/.test(pathForMatch)) {
      pathForMatch = _.slice(pathForMatch, 5); // 去掉"/fsp/"开头
    }

    const pathArray = _.split(pathForMatch, '/');

    if (menuPath.indexOf(pathArray[level]) > -1) {
      return true;
    }

    return false;
  }

  @autobind
  handleLinkClick(menuItem) {
    const { push, path } = this.props;
    if (menuItem.action === 'loadExternSystemPage') {
      window.open(menuItem.url, '_blank');
    } else if (menuItem.path !== path) {
      push({
        pathname: menuItem.path,
        query: menuItem.query,
      });
    }
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
  handDropClick(menuItem, activeKey) {
    if (menuItem.id !== activeKey) {
      // 是否有上次点击的菜单记录
      if (menuItem.path !== '') {
        this.handleLinkClick(menuItem);
      } else {
        // 默认打开第一个子菜单
        this.handleLinkClick(this.getFirstChild(menuItem));
      }
    }
  }

  @autobind
  renderDropdownMenu(menu) {
    const { activeKey } = this.props;
    const isActiveLink = menu.id === activeKey;
    const hasHomePage = menu.path !== '';
    const menus = (
      <Menu>
        {
          this.getMenus(menu.children)
        }
      </Menu>
    );
    return (
      <div
        key={menu.id}
        className={classnames({
          [styles.menuItem]: true,
          [styles.activeLink]: isActiveLink,
        })}
      >
        <Dropdown placement="bottomLeft" overlay={menus} trigger={['hover']}>
          <div
            tabIndex="0"
            className={styles.text}
          >
            <div
              className={classnames({
                [styles.link]: true,
                [styles.hasHomePage]: hasHomePage,
              })}
              title={menu.name}
              onClick={() => this.handDropClick(menu, activeKey)}
            >
              {menu.name}
            </div>
            <i className="anticon anticon-change" />
          </div>
        </Dropdown>
      </div>
    );
  }

  @autobind
  renderLinkMenu(menu, closeable = false) {
    const { activeKey } = this.props;
    return (
      <div
        key={menu.id}
        className={classnames({
          [styles.menuItem]: true,
          [styles.widerItem]: closeable,
          [styles.activeLink]: menu.id === activeKey,
        })}
      >
        <div className={styles.text}>
          <div
            className={`${styles.link} ${styles.hasHomePage}`}
            title={`${menu.name}`}
            onClick={() => this.change(menu.id, activeKey)}
          >
            {menu.name}
          </div>
          {
            closeable ?
              <div id={menu.id === activeKey ? 'activeTabPane' : null} className={styles.close} onClick={() => this.remove(menu.id)}>
                <Icon type="close" />
              </div> : null
          }
        </div>
      </div>
    );
  }

  @autobind
  renderMoreTab() {
    const { onRemove, onChange, activeKey, moreMenuObject, path } = this.props;
    return (
      <div className={styles.moreTab}>
        <MoreTab
          moreTabArray={moreMenuObject.children}
          onChange={onChange}
          activeKey={activeKey}
          onRemove={onRemove}
          onLinkClick={this.handleLinkClick}
          path={path}
        />
      </div>
    );
  }

  render() {
    const { mainArray, moreMenuObject } = this.props;
    return (
      <div id="tabMenu" className={styles.tabMenu}>
        {
          mainArray.map((menu) => {
            if (menu.children) {
              return this.renderDropdownMenu(menu);
            } else if (menu.pid === 'ROOT') {
              return this.renderLinkMenu(menu, false);
            }
            return this.renderLinkMenu(menu, true);
          })
        }
        {
          moreMenuObject.children.length !== 0 ? this.renderMoreTab() : null
        }
      </div>
    );
  }
}
