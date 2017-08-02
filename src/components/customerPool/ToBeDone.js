/**
 * @file customerPool/Home.js
 *  目标客户池首页
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { Link } from 'dva/router';
import { fspGlobal } from '../../utils';
import styles from './toBeDone.less';

export default class PerformanceIndicators extends PureComponent {

  render() {
    const url = '/customerPool/todo';
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_TODOLIST',
      title: '待办流程列表',
    };
    return (
      <div className={styles.toBeDoneBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <span className={styles.name}>我的待办事项</span>
          </div>
          <Row gutter={35}>
            <Col span={8}>
              <div className={`${styles.item} ${styles.item_a}`}>
                <a className="item" onClick={() => fspGlobal.myMotTask()}>
                  <div className={styles.content}>
                    <h1>25</h1>
                    <p>今日可做任务</p>
                  </div>
                </a>
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
                <a className="item" onClick={() => fspGlobal.openRctTab({ url, param })}>
                  <div className={styles.content}>
                    <h1>99<sup>+</sup></h1>
                    <p>待办流程</p>
                  </div>
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
