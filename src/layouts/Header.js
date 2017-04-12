import React, { PropTypes } from 'react';
import { Icon } from 'antd';

import styles from './header.less';

function Header({ switchSider, siderFold }) {
  return (
    <div className={styles.header}>
      <div className={styles.button} onClick={switchSider}>
        <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
      </div>
    </div>
  );
}

Header.propTypes = {
  switchSider: PropTypes.func.isRequired,
  siderFold: PropTypes.bool.isRequired,
};

export default Header;
