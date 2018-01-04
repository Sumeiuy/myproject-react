import React from 'react';
import { Link } from 'dva/router';
// import PropTypes from 'prop-types';
import { Menu, Input, Dropdown } from 'antd';

// import Icon from "../../src/components/common/Icon";
import styles from './header.less';

// const SubMenu = Menu.SubMenu;
// const Search = Input.Search;

function Header(/* {user, logout} */) {
  // const handleClickMenu = e => e.key === 'logout' && logout();
  // const menusProps = {};
  const menu = (
    <Menu mode="vertical-right">
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
  const statisticalMenu = (
    <Menu mode="vertical-right">
      <Menu.Item key="0">
        <a href="http://www.alipay.com/">1st menu item</a>
      </Menu.Item>
      <Menu.SubMenu key="1" title="2级菜单">
        <Menu.Item key="3">
          <a href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <div className={styles.header}>
      <div className={styles.headerLogo}>
        <span className={styles.logo} />
        <Link to="/customerPool" className={styles.name}>
          华泰证券理财服务平台
        </Link>
      </div>
      <div className={styles.headerContent}>
        {/* <div className={styles.search}>
          <Search
            placeholder="搜索"
            onSearch={value => console.log(value)}
            style={{ width: 155 }}
          />
        </div> */}
        <Dropdown overlay={statisticalMenu} trigger={['hover']}>
          <spn className={styles.navItem}>常用工具</spn>
        </Dropdown>
        <Dropdown overlay={statisticalMenu} trigger={['hover']}>
          <spn className={styles.navItem}>移动版</spn>
        </Dropdown>
        <Dropdown overlay={statisticalMenu} trigger={['hover']}>
          <spn className={styles.navItem}>知识库</spn>
        </Dropdown>
        <Dropdown overlay={statisticalMenu} trigger={['hover']}>
          <spn className={styles.navItem}>运维管理</spn>
        </Dropdown>
        <Dropdown overlay={statisticalMenu} trigger={['hover']}>
          <spn className={styles.navItem}>通知提醒</spn>
        </Dropdown>
        <Dropdown overlay={statisticalMenu} trigger={['hover']}>
          <spn className={styles.navItem}>帮助</spn>
        </Dropdown>
        <Dropdown overlay={Menu} trigger={['hover']}>
          <dl className={styles.position}>
            <dt>王华</dt>
            <dd>服务部营业岗位</dd>
          </dl>
        </Dropdown>
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
