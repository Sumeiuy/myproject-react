/**
 * @Descripter: 平台参数设置
 * @Author: K0170179
 * @Date: 2018/4/12
 */

import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { backRoutePathList } from '../../helper/url';
import { linkTo } from '../../utils';
import Icon from '../common/Icon';
import styles from './header.less';

function linkGenerator(menuItem, parentPath, push) {
  let finaPathname = '';
  function defaultLink(menuItemOver, parentPathOver) {
    const childMenu = menuItemOver.children;
    const pathname = `${parentPathOver}${menuItemOver.path}`;
    if (_.isArray(childMenu) && childMenu.length) {
      defaultLink(childMenu[0], pathname);
    } else {
      finaPathname = pathname;
    }
  }
  defaultLink(menuItem, parentPath);
  const linkToParam = {
    routerAction: push,
    url: finaPathname,
    pathname: finaPathname,
  };
  return (
    <a
      onClick={() => { linkTo(linkToParam); }}
      style={{ fontSize: '14px' }}
    >
      {menuItem.name}
    </a>
  );
}

function getMenus(menu, parentPath, push, preventItem) {
  return (
    <Menu>
      {
        _.map(menu, menuItem => (
          <Menu.Item key={menuItem.path}>
            {
              preventItem.path === menuItem.path
                ? <a style={{ fontSize: '14px' }}>{menuItem.name}</a>
                : linkGenerator(menuItem, parentPath, push, preventItem)
            }
          </Menu.Item>
        ))
      }
    </Menu>
  );
}

function getNavItemList(menu, pathList) {
  const navList = [];
  function walkMenu(preventMenu) {
    const itemPath = pathList.shift();
    let preventItem = {}; // 默认导航
    if (itemPath) {
      preventItem = _.filter(preventMenu, menuItem => menuItem.path === itemPath)[0];
    } else {
      preventItem = preventMenu[0];
    }
    navList.push({
      preventItem,
      preventMenu,
    });
    // 当pathItem存在且不存在菜单去对应世则显示未知
    if (preventItem) {
      const childMenu = preventItem.children;
      if (_.isArray(childMenu) && childMenu.length) {
        walkMenu(childMenu);
      } else if (typeof childMenu === 'string') {
        navList.push(childMenu);
      }
    }
  }
  walkMenu(menu);
  return navList;
}

const mapStateToProps = state => ({
  location: state.routing.location,
});

const mapDispatchToProps = {
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Header extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    matchPath: PropTypes.string.isRequired,
    menu: PropTypes.array.isRequired,
    push: PropTypes.func.isRequired,
  };

  render() {
    const {
      location: { pathname }, matchPath, menu, push
    } = this.props;
    const pathList = backRoutePathList(pathname, matchPath);
    const navItemList = getNavItemList(menu, pathList);
    let parentPath = matchPath;
    return (
      <div className={styles.navBody}>
        {
          _.map(navItemList,
            (option, index) => {
              if (_.isObject(option)) {
                const { preventItem = {}, preventMenu } = option;
                const dropDownMenu = (
                  <div key={index} className={styles.navItem}>
                    <Dropdown overlay={getMenus(preventMenu, parentPath, push, preventItem)} trigger={['click']}>
                      <div className={styles.navItemCtn}>
                        {preventItem.name || '未知'}
                        {' '}
                        <Icon type="xiangxia" />
                      </div>
                    </Dropdown>
                  </div>
                );
                parentPath += preventItem.path;
                return dropDownMenu;
              }
              return _.isString(option)
                ? (<div key={index} className={styles.navItem}>{option}</div>)
                : null;
            })
        }
      </div>
    );
  }
}
