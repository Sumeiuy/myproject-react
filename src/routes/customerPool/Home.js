/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import { withRouter, Link } from 'dva/router';

import styles from './home.less';

@withRouter
export default class Home extends PureComponent {
  render() {
    return (
      <div>
        <div className={styles.quickEntry}>
          <Link className="item" to="/customerPool/canDoToday">今日可做任务</Link>
          <Link className="item" to="">满足业务条件办理客户</Link>
          <Link className="item" to="/customerPool/todo">待办流程</Link>
        </div>
      </div>
    );
  }
}
