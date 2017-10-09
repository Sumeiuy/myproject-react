/**
 * @file customerPool/ToBeDone.js
 *  目标客户池首页-代办流程总数
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { fspGlobal } from '../../../utils';
import { fspContainer } from '../../../config';
import styles from './toBeDone.less';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: {},
  }

  // 处理数值（大于99+）
  processNum(num) {
    const nowNum = parseInt(num); // eslint-disable-line
    if (_.isNaN(nowNum)) {
      return '--';
    }
    if (nowNum > 99) {
      return <span>99<sup>+</sup></span>;
    }
    return <span>{num}</span>;
  }
  // 数据处理
  farmtNum(num) {
    if (_.isNaN(parseInt(num))) { // eslint-disable-line
      return '--';
    }
    return num;
  }

  // 跳转到满足业务办理客户列表
  @autobind
  linkToBusiness() {
    const { location: { query } } = this.props;
    const url = '/customerPool/list';
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'RCT_FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    if (document.querySelector(fspContainer.container)) {
      fspGlobal.openRctTab({ url: `${url}?source=business`, param });
    } else {
      this.props.push({
        pathname: url,
        query: {
          source: 'business',
        },
        // 方便返回页面时，记住首页的query，在本地环境里
        state: {
          ...query,
        },
      });
    }
  }

  render() {
    const { data: { businessNumbers,
      notificationNumbers,
      todayToDoNumbers,
      workFlowNumbers } } = this.props;
    const url = '/customerPool/todo';
    const notificationUrl = '/messgeCenter';
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_TODOLIST',
      title: '待办流程列表',
    };
    const notificationParam = {
      forceRefresh: false,
      id: 'MESSAGE_CENTER',
      title: '消息中心',
    };
    return (
      <div className={styles.toBeDoneBox}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <span className={styles.name}>我的待办事项</span>
          </div>
          <Row gutter={20}>
            <Col span={6}>
              <div className={`${styles.item} ${styles.item_a}`}>
                <a className="item" onClick={() => fspGlobal.myMotTask()}>
                  <div className={styles.content}>
                    <h1>{this.farmtNum(todayToDoNumbers)}</h1>
                    <p>今日可做任务</p>
                  </div>
                </a>
              </div>
            </Col>
            <Col span={6}>
              <div className={`${styles.item} ${styles.item_b}`}>
                <a
                  className="item"
                  onClick={this.linkToBusiness}
                >
                  <div className={styles.content}>
                    <h1>{this.farmtNum(businessNumbers)}</h1>
                    <p>满足业务办理条件客户</p>
                  </div>
                </a>
              </div>
            </Col>
            <Col span={6}>
              <div className={`${styles.item} ${styles.item_c}`}>
                <a className="item" onClick={() => fspGlobal.openRctTab({ url, param })}>
                  <div className={styles.content}>
                    <h1>{this.processNum(workFlowNumbers)}</h1>
                    <p>待办流程</p>
                  </div>
                </a>
              </div>
            </Col>
            <Col span={6}>
              <div className={`${styles.item} ${styles.item_d}`}>
                <a
                  className="item"
                  onClick={
                    () => fspGlobal.openFspTab({
                      url: notificationUrl,
                      param: notificationParam,
                    })
                  }
                >
                  <div className={styles.content}>
                    <h1>{this.processNum(notificationNumbers)}</h1>
                    <p>消息提醒</p>
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
