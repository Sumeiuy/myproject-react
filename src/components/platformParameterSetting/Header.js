/**
 * @Descripter: 平台参数设置
 * @Author: K0170179
 * @Date: 2018/4/12
 */

import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import Icon from '../../components/common/Icon';

import styles from './header.less';

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);

export default class Header extends PureComponent {
  render() {
    return (
      <div className={styles.navBody}>
        <div className={styles.navItem}>
          <Dropdown overlay={menu} trigger={['click']}>
            <div>
              用户中心 <Icon type="xiangxia" />
            </div>
          </Dropdown>
        </div>
        <div className={styles.navItem}>
          个人标签
        </div>
      </div>
    );
  }
}
