import React from 'react';
// import PropTypes from 'prop-types';
import { Menu, Input, Dropdown } from 'antd';

import styles from './header.less';

// const SubMenu = Menu.SubMenu;
const Search = Input.Search;

function Header(/* {user, logout} */) {
  // const handleClickMenu = e => e.key === 'logout' && logout();
  // const menusProps = {};
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
  return (
    <div className={styles.header}>
      <div className={styles.headerLog} />
      <div className={styles.headerContent}>
        <div className={styles.seatch}>
          <Search
            placeholder="搜索"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          />
        </div>
        <div className={styles.contentNav}>
          <div>
            <Dropdown overlay={menu} trigger={['click']}>
              <spn>常用工具</spn>
            </Dropdown>
          </div>
          <ul>
            <li>移动版</li>
            <li>知识库</li>
            <li>运维管理</li>
            <li>通知提醒</li>
            <li>帮助</li>
          </ul>
        </div>
        <div className={styles.loaders}>
          <dl>
            <dt>王华</dt>
            <dd>服务部营业岗位</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
/*   user: PropTypes.object,
  logout: PropTypes.func.isRequired, */
};

Header.defaultProps = {
/*   user: { name: '测试用户' }, */
};

export default Header;
