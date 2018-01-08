/**
 * @Author: sunweibin
 * @Date: 2018-01-05 15:20:49
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-05 15:34:07
 * @description 头部导航栏次级菜单导航项
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import styles from './navItem.less';

function NavItem({ label, downIcon, line }) {
  const icon = downIcon ? (<Icon type="down" style={{ marginLeft: '2px' }} />) : null
  return (
    <div>
      <span className={styles.navItem}>
        {label}{icon}
      </span>
      { line ? (<span className={styles.splitLine} />) : null}
    </div>
  );
}

NavItem.propTypes = {
  label: PropTypes.string,
  downIcon: PropTypes.bool,
  line: PropTypes.bool,
};

NavItem.defaultProps = {
  label: '',
  downIcon: true,
  line: true,
};

export default NavItem;
