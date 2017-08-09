/**
 * @file customerPool/ToBeDone.js
 *  目标客户池首页-代办流程总数
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import { Link } from 'dva/router';
import { fspGlobal } from '../../utils';
import styles from './toBeDone.less';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    processData: PropTypes.number,
    motTaskCountData: PropTypes.number,
  }

  static defaultProps = {
    processData: 0,
    motTaskCountData: 0,
  }

  // 处理数值（大于99+）
  processNum(num) {
    if (parseInt(num) > 99) { // eslint-disable-line
      return <span>99<sup>+</sup></span>;
    }
    return <span>{num}</span>;
  }
  render() {
    const { processData, motTaskCountData } = this.props;
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
                    <h1>{motTaskCountData || '--'}</h1>
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
                    <h1>{this.processNum(processData || '--')}</h1>
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
