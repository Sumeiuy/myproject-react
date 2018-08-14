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
import commonConfig from './config';
import { fixExternUrl } from '../utils/tab';

const menuStyle = {
  border: '1px solid #ddd',
  borderRadius: '0 0 4px 4px',
  minWidth: '100px',
  maxWidth: '170px',
};

export default class TabMenu extends PureComponent {
  static propTypes = {
    activeKey: PropTypes.string.isRequired,
    mainArray: PropTypes.array.isRequired,
    moreMenuObject: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    currentMenuId: PropTypes.string.isRequired,
  }

  getMenus(array, level = 2) {
    const { path } = this.props;
    return array.map((item) => {
      if (item.children && !_.isEmpty(item.children)) {
        return (
          <Menu.SubMenu
            key={item.id}
            title={item.name}
            className={classnames({
              [styles.activeItem]: this.isActiveMenu(path, item, level),
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
            [styles.activeItem]: this.isActiveMenu(path, item, level, true),
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
    if (firstChild.children && !_.isEmpty(firstChild.children)) {
      return this.getFirstChild(firstChild);
    }
    return firstChild;
  }

  @autobind
  getPopupContainer() {
    return this.elem;
  }

  @autobind
  isActiveMenu(path, menuItem, level, exact = false) {
    const menuPath = menuItem.path;
    if (exact) {
      if (
        menuPath === path
        || path.indexOf(menuPath) > -1
        || menuItem.id === this.props.currentMenuId) {
        return true;
      }
      return false;
    }

    const pathArray = _.split(path, '/');
    let pathForMatch = pathArray[level];
    // 如果pathname是以fsp开头的，
    if (commonConfig.pathPrefix.test(path)) {
      pathForMatch = pathArray[level + 1]; // 去掉"/fsp"开头
    }
    if (menuPath && menuPath.indexOf(pathForMatch) > -1) {
      return true;
    }

    return false;
  }

  @autobind
  handleLinkClick(menuItem) {
    const { push, path } = this.props;
    if (menuItem.action === 'loadExternSystemPage') {
      const externUrl = fixExternUrl(menuItem.url);
      window.open(externUrl, '_blank');
    } else if (menuItem.path !== path) {
      push({
        pathname: menuItem.path,
        query: menuItem.query,
        state: {
          url: menuItem && menuItem.url,
        },
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
  handDropClick(menuItem, activeKey, canClick = false) {
    if (canClick) {
      if (menuItem.id !== activeKey) {
        // 是否有上次点击的菜单记录
        if (menuItem.path) {
          this.handleLinkClick(menuItem);
        } else {
          // 默认打开第一个子菜单
          this.handleLinkClick(this.getFirstChild(menuItem));
        }
      }
    }
  }

  @autobind
  renderDropdownMenu(menu) {
    const { activeKey } = this.props;
    const isActiveLink = menu.id === activeKey;
    // const hasHomePage = !!menu.path;
    const menus = (
      <Menu style={menuStyle}>
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
        <Dropdown
          placement="bottomLeft"
          overlay={menus}
          trigger={['hover']}
          getPopupContainer={this.getPopupContainer}
        >
          <div
            tabIndex="0"
            className={styles.text}
          >
            <div
              className={classnames({
                [styles.link]: true,
                // [styles.hasHomePage]: hasHomePage,
              })}
              title={menu.name}
              onClick={() => this.handDropClick(menu, activeKey)}
            >
              {menu.name}
            </div>
            <span className={styles.iconDown}><i className="anticon anticon-change" /></span>
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
              <span
                id={menu.id === activeKey ? 'activeTabPane' : null}
                className={styles.close}
                onClick={() => this.remove(menu.id)}
              >
                <Icon type="close" />
              </span> : null
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
        <div className={styles.dropDownContainer} ref={ref => this.elem = ref} />
        {
          mainArray.map((menu) => {
            if (menu.children && !_.isEmpty(menu.children)) {
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
