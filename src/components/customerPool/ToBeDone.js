/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { Link } from 'dva/router';
import styles from './toBeDone.less';

export default class PerformanceIndicators extends PureComponent {

  render() {
    return (
      <div className={styles.toBeDoneBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <span className={styles.name}>我的待办事项</span>
          </div>
          <Row gutter={35}>
            <Col span={8}>
              <div className={`${styles.item} ${styles.item_a}`}>
                <Link className="item" to="/customerPool/canDoToday">
                  <div className={styles.content}>
                    <h1>25</h1>
                    <p>今日可做任务</p>
                  </div>
                </Link>
              </div>
            </Col>
            <Col span={8}>
              <div className={`${styles.item} ${styles.item_b}`}>
                <Link className="item" to="">
                  <div className={styles.content}>
                    <h1>25</h1>
                    <p>满足业务办理条件客户</p>
                  </div>
                </Link>
              </div>
            </Col>
            <Col span={8}>
              <div className={`${styles.item} ${styles.item_c}`}>
                <Link className="item" to="/customerPool/todo">
                  <div className={styles.content}>
                    <h1>99<sup>+</sup></h1>
                    <p>待办流程</p>
                  </div>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
