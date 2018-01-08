/**
 * @Author: sunweibin
 * @Date: 2018-01-04 14:09:13
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-04 14:16:48
 * @description 头部Logo小部件
 */
import React from 'react';
import { Link } from 'dva/router';

import styles from './logo.less';

const Logo = () => (
  <div className={styles.headerLogo}>
    <span className={styles.logo} />
    <Link to="/customerPool" className={styles.name}>
      华泰证券理财服务平台
    </Link>
  </div>
  );

export default Logo;
