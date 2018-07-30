/**
 * @Author: xiazhiqiang
 * @Date: 2018-05-21 13:33:05
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-07-10 09:38:04
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { getFilter } from '../helper';
import styles from './toBeDone.less';
import { openRctTab } from '../../../utils';
import logable from '../../../decorators/logable';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: {},
  }

  componentDidMount() {
    this.setMinFontSizeByWidth();
    window.addEventListener('resize', () => {
      this.setMinFontSizeByWidth();
    });
  }

  componentDidUpdate() {
    this.setMinFontSizeByWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.setMinFontSizeByWidth());
  }

  // 根据宽度，按一定比例缩放字号
  @autobind
  setMinFontSizeByWidth() {
    const { data: { businessNumbers } } = this.props;
    // 十万起，数字展示不下，要缩放
    if (businessNumbers > 99999 && this.itemBElem) {
      const currentWidth = Math.ceil(this.itemBElem.offsetWidth);
      const minWidth = Math.ceil(
        parseFloat(
          window.getComputedStyle(
            this.itemBElem,
          ).getPropertyValue('min-width'),
        ),
      );
      // 按照一定比例缩放(自测出来的)
      const percentSize = Math.floor((currentWidth - minWidth) * 0.2);
      this.itemBElem.style.fontSize = `${Math.min((20 + percentSize), 30)}px`;
    }
  }

  // 处理数值（大于99+）
  processNum(num) {
    const nowNum = parseInt(num, 10);
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
    if (_.isNaN(parseInt(num, 10))) {
      return '--';
    }
    return num;
  }

  // 跳转到满足业务办理客户列表
  @autobind
  @logable({ type: 'Click', payload: { name: '潜在业务客户' } })
  linkToBusiness() {
    const { location: { query }, push } = this.props;
    const url = '/customerPool/list';
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'RCT_FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    const data = {
      source: 'business',
      bizFlag: 'biz',
    };
    openRctTab({
      routerAction: push,
      url: `${url}?source=business&filters=${getFilter(data)}&bizFlag=biz`,
      pathname: url,
      query: data,
      param,
      state: {
        ...query,
        filters: getFilter(data),
      },
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '今日可做任务' } })
  handleMotClick() {
    // 点击事件
    const { location: { query }, push } = this.props;
    const url = '/taskCenter/taskList';
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_MOT_SELFBUILT_TASK',
      title: '任务管理',
    };
    const data = {
      missionViewType: 'executor',
    };
    openRctTab({
      routerAction: push,
      url: `${url}?missionViewType=executor`,
      pathname: url,
      query: data,
      param,
      state: {
        ...query,
      },
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '消息提醒' } })
  handleMessageClick() {
    // 点击事件
    const { location: { query }, push } = this.props;
    const notificationUrl = '/messageCenter';
    const notificationParam = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'MESSAGE_CENTER',
      title: '消息中心',
    };
    openRctTab({
      routerAction: push,
      url: notificationUrl,
      pathname: notificationUrl,
      param: notificationParam,
      state: {
        ...query,
      },
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '待办流程' } })
  handleTodoClick() {
    // 点击事件
    const url = '/customerPool/todo';
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_TODOLIST',
      title: '待办流程列表',
    };
    const { push } = this.props;
    openRctTab({
      routerAction: push,
      url,
      param,
    });
  }

  render() {
    const { data: { businessNumbers,
      notificationNumbers,
      todayToDoNumbers,
      workFlowNumbers } } = this.props;
    return (
      <div className={styles.toBeDoneBox}>
        <div className={styles.title}>
          <span className={styles.name}>任务概览</span>
        </div>
        <div className={styles.row}>
          <div className={`${styles.item} ${styles.item_a}`}>
            <a className="item" onClick={this.handleMotClick}>
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
            <a className="item" onClick={this.linkToBusiness}>
              <div className={styles.content}>
                <div className={styles.description}>
                  <div
                    className={styles.count}
                    ref={(ref) => { this.itemBElem = ref; }}
                  >
                    {this.farmtNum(businessNumbers)}
                  </div>
                  <div className={styles.intro}>潜在业务客户</div>
                </div>
              </div>
            </a>
          </div>
          <div className={`${styles.item} ${styles.item_c}`}>
            <a className="item" onClick={this.handleTodoClick}>
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
            <a className="item" onClick={this.handleMessageClick}>
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
