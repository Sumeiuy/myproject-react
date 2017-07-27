/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import { withRouter } from 'dva/router';
// import { Row, Col } from 'antd';
import PerformanceIndicators from '../../components/customerPool/PerformanceIndicators';
import ToBeDone from '../../components/customerPool/ToBeDone';
import Search from '../../components/customerPool/Search';
import styles from './home.less';

@withRouter
export default class Home extends PureComponent {
  render() {
    return (
      <div className={styles.customerPoolWrap}>
        <Search />
        <div className={styles.content}>
          <ToBeDone />
          <PerformanceIndicators />
        </div>
      </div>
    );
  }
}
