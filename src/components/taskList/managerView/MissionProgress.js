/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-05 21:18:42
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-06 15:31:03
 * 任务进度
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import styles from './missionProgress.less';

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

export default class MissionProgress extends PureComponent {

  static propTypes = {
    // 任务实施进度
    missionImplementationProgress: PropTypes.object,
    // 查看客户明细
    onPreviewCustDetail: PropTypes.func,
  }

  static defaultProps = {
    missionImplementationProgress: EMPTY_OBJECT,
    onPreviewCustDetail: () => { },
  }

  @autobind
  renderTooltipContent(type, currentCount) {
    return (
      <div className={styles.content}>
        <div className={styles.currentType}>{type}{currentCount || 0}位</div>
        <div
          className={styles.linkCustDetail}
          onClick={this.props.onPreviewCustDetail}
        >点击查看明细&gt;&gt;</div>
      </div>
    );
  }

  @autobind
  renderProgressContent(type, currentCount, activePercent, remainingPercent) {
    return (
      <div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-show-info">
        <div>
          <div className="ant-progress-outer">
            <Tooltip
              placement="topLeft"
              title={() => this.renderTooltipContent(type, currentCount)}
              arrowPointAtCenter
              overlayClassName={styles.tooltipOverlay}
            >
              <div className="ant-progress-bg" style={{ width: `${activePercent}%` }} />
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title={() => this.renderTooltipContent(type, currentCount)}
              arrowPointAtCenter
              overlayClassName={styles.tooltipOverlay}
            >
              <div className="ant-progress-inner" style={{ width: `${remainingPercent}%` }} />
            </Tooltip>
          </div>
        </div>
        <span className="ant-progress-text">100 / {activePercent}%</span>
      </div>
    );
  }

  @autobind
  renderProgressSection() {
    const { missionImplementationProgress } = this.props;
    const {
      // 客户总数
      // custCount = 300,
      // 已服务客户
      servedNums = 100,
      // 已完成客户
      completedNums = 100,
      // 结果达标客户
      standardNums = 100,
      // 已服务比例
      servedNumsRatio = 0.5,
      // 已完成比例
      completedNumsRatio = 0.5,
      // 已达标比例
      standardNumsRatio = 0.5,
    } = missionImplementationProgress || EMPTY_OBJECT;

    const servePercent = Number(servedNumsRatio) * 100;
    const completedPercent = Number(completedNumsRatio) * 100;
    const standardPercent = Number(standardNumsRatio) * 100;

    return (
      <div className={styles.area}>
        <div className={styles.serviceCust}>
          <span className={styles.title}>已服务客户</span>
          {this.renderProgressContent('已服务客户', servedNums,
            servePercent, 100 - servePercent)}
        </div>
        <div className={styles.statusCust}>
          <span className={styles.title}>已完成客户</span>
          {this.renderProgressContent('已完成客户', completedNums,
            completedPercent, 100 - completedPercent)}
        </div>
        <div className={styles.standardCust}>
          <span className={styles.title}>结果达标客户</span>
          {this.renderProgressContent('结果达标客户', standardNums,
            standardPercent, 100 - standardPercent)}
        </div>
      </div>
    );
  }


  render() {
    return (
      <div className={styles.missionProgressSection}>
        <div className={styles.title}>
          进度
        </div>
        <div className={styles.content}>
          {this.renderProgressSection()}
        </div>
      </div>
    );
  }
}
