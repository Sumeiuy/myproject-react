/**
 * @file customerPool/ToBeDone.js
 *  目标客户池首页-代办流程总数
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
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
      fspGlobal.openRctTab({ url: `${url}?source=business&orgId=${window.forReactPosition.orgId}`, param });
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
        <div className={styles.title}>
          <span className={styles.name}>任务概览</span>
        </div>
        <div className={styles.row}>
          <div className={`${styles.item} ${styles.item_a}`}>
            <a className="item" onClick={() => fspGlobal.myMotTask()}>
              <div className={styles.content}>
                <div className={styles.description}>
                  <div className={styles.count}>
                    {this.farmtNum(todayToDoNumbers)}
                  </div>
                  <div className={styles.intro}>今日可做任务</div>
                </div>
              </div>
            </a>
          </div>
          <div className={`${styles.item} ${styles.item_b}`}>
            <a
              className="item"
              onClick={this.linkToBusiness}
            >
              <div className={styles.content}>
                <div className={styles.description}>
                  <div className={styles.count}>
                    {this.farmtNum(businessNumbers)}
                  </div>
                  <div className={styles.intro}>满足业务开通客户</div>
                </div>
              </div>
            </a>
          </div>
          <div className={`${styles.item} ${styles.item_c}`}>
            <a className="item" onClick={() => fspGlobal.openRctTab({ url, param })}>
              <div className={styles.content}>
                <div className={styles.description}>
                  <div className={styles.count}>
                    {this.processNum(workFlowNumbers)}
                  </div>
                  <div className={styles.intro}>待办流程</div>
                </div>
              </div>
            </a>
          </div>
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
                <div className={styles.description}>
                  <div className={styles.count}>
                    {this.processNum(notificationNumbers)}
                  </div>
                  <div className={styles.intro}>消息提醒</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
