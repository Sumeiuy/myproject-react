/**
 * @file customerPool/ToBeDone.js
 *  目标客户池首页-代办流程总数
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './toBeDone.less';
import { fspGlobal } from '../../../utils';
import { fspContainer } from '../../../config';
import Clickable from '../../../components/common/Clickable';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    authority: PropTypes.bool.isRequired,
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
  linkToBusiness() {
    const { location: { query }, authority } = this.props;
    const url = '/customerPool/list';
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'RCT_FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    if (document.querySelector(fspContainer.container)) {
      const authOrgId = authority ? window.forReactPosition.orgId : '';
      fspGlobal.openRctTab({ url: `${url}?source=business&orgId=${authOrgId}`, param });
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

  @autobind
  handleMotClick() {
    // 点击事件
    fspGlobal.myMotTask();
  }

  @autobind
  handleMessageClick() {
    // 点击事件
    const notificationUrl = '/messgeCenter';
    const notificationParam = {
      forceRefresh: false,
      id: 'MESSAGE_CENTER',
      title: '消息中心',
    };
    fspGlobal.openFspTab({
      url: notificationUrl,
      param: notificationParam,
    });
  }

  render() {
    const { data: { businessNumbers,
      notificationNumbers,
      todayToDoNumbers,
      workFlowNumbers } } = this.props;
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
        <div className={styles.title}>
          <span className={styles.name}>任务概览</span>
        </div>
        <div className={styles.row}>
          <div className={`${styles.item} ${styles.item_a}`}>
            <Clickable
              onClick={this.handleMotClick}
              eventName="/click/taskOverview/canDoTodayClick"
            >
              <a className="item">
                <div className={styles.content}>
                  <div className={styles.description}>
                    <div className={styles.count}>
                      {this.farmtNum(todayToDoNumbers)}
                    </div>
                    <div className={styles.intro}>今日可做任务</div>
                  </div>
                </div>
              </a>
            </Clickable>
          </div>
          <div className={`${styles.item} ${styles.item_b}`}>
            <Clickable
              onClick={this.linkToBusiness}
              eventName="/click/taskOverview/bisinessCust"
            >
              <a className="item">
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
            </Clickable>
          </div>
          <div className={`${styles.item} ${styles.item_c}`}>
            <Clickable
              onClick={() => fspGlobal.openRctTab({ url, param })}
              eventName="/click/taskOverview/toDoFlow"
            >
              <a className="item">
                <div className={styles.content}>
                  <div className={styles.description}>
                    <div className={styles.count}>
                      {this.processNum(workFlowNumbers)}
                    </div>
                    <div className={styles.intro}>待办流程</div>
                  </div>
                </div>
              </a>
            </Clickable>
          </div>
          <div className={`${styles.item} ${styles.item_d}`}>
            <Clickable
              onClick={this.handleMessageClick}
              eventName="/click/taskOverview/messageNotification"
            >
              <a className="item">
                <div className={styles.content}>
                  <div className={styles.description}>
                    <div className={styles.count}>
                      {this.processNum(notificationNumbers)}
                    </div>
                    <div className={styles.intro}>消息提醒</div>
                  </div>
                </div>
              </a>
            </Clickable>
          </div>
        </div>
      </div>
    );
  }
}
