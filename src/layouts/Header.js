import React, { PropTypes } from 'react';
import { Icon, Popover } from 'antd';

import Menus from './Menu';
import styles from './header.less';

function Header({
  switchSider,
  siderFold,
  isNavbar,
  menuPopoverVisible,
  location,
  switchMenuPopover,
  navOpenKeys,
  changeOpenKeys,
}) {
  const menusProps = {
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  };
  return (
    <div className={styles.header}>
      {isNavbar
        ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : <div className={styles.button} onClick={switchSider}>
          <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
        </div>}
    </div>
  );
}

Header.propTypes = {
  switchSider: PropTypes.func.isRequired,
  siderFold: PropTypes.bool.isRequired,
  isNavbar: PropTypes.bool.isRequired,
  menuPopoverVisible: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  switchMenuPopover: PropTypes.func.isRequired,
  navOpenKeys: PropTypes.array.isRequired,
  changeOpenKeys: PropTypes.func.isRequired,
};

export default Header;
