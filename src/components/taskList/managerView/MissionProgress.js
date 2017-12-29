/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-05 21:18:42
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-28 09:41:34
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
const SERVED_CUST = '已服务客户';
const NOT_SERVED_CUST = '未服务客户';
const COMPLETED_CUST = '已完成客户';
const NOT_COMPLETED_CUST = '未完成客户';
const STASIFY_CUST = '结果达标客户';
const NOT_STASIFY_CUST = '结果未达标客户';

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

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  @autobind
  getActiveElem() {
    return this.activeElem;
  }

  @autobind
  getRemainingElem() {
    return this.remainingElem;
  }

  @autobind
  handlePreview(title) {
    const { onPreviewCustDetail } = this.props;
    onPreviewCustDetail({ title });
  }

  @autobind
  renderTooltipContent(type, currentCount) {
    return (
      <div className={styles.content}>
        <div className={styles.currentType}>{type}{currentCount || 0}位</div>
        <div
          className={styles.linkCustDetail}
          onClick={() => this.handlePreview(type)}
        >点击查看明细&gt;&gt;</div>
      </div>
    );
  }

  @autobind
  renderProgressContent(
    activeType,
    remainingType,
    activePercent,
    remainingPercent,
    activeCount,
    remainingCount,
  ) {
    return (
      <div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-show-info">
        <div>
          <div className="ant-progress-outer">
            <Tooltip
              placement="topLeft"
              title={() => this.renderTooltipContent(activeType, activeCount)}
              arrowPointAtCenter
              overlayClassName={styles.tooltipOverlay}
              getPopupContainer={this.getActiveElem}
            >
              <div
                className="ant-progress-bg"
                style={{ width: `${activePercent}%` }}
                ref={ref => (this.activeElem = ref)}
              />
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title={() => this.renderTooltipContent(remainingType, remainingCount)}
              arrowPointAtCenter
              overlayClassName={styles.tooltipOverlay}
              getPopupContainer={this.getRemainingElem}
            >
              <div
                className="ant-progress-inner"
                ref={ref => (this.remainingElem = ref)}
                style={{ width: `${remainingPercent}%` }}
              />
            </Tooltip>
          </div>
        </div>
        <span className="ant-progress-text">{activeCount} / {activePercent}%</span>
      </div>
    );
  }

  @autobind
  renderProgressSection() {
    const { missionImplementationProgress } = this.props;
    const {
      // 客户总数
      custCount = 0,
      // 已服务客户
      servedNums = 0,
      // 已完成客户
      completedNums = 0,
      // 结果达标客户
      standardNums = 0,
      // 已服务比例
      servedNumsRatio = 0,
      // 已完成比例
      completedNumsRatio = 0,
      // 已达标比例
      standardNumsRatio = 0,
    } = missionImplementationProgress || EMPTY_OBJECT;

    const servePercent = Number.parseInt(Number(servedNumsRatio) * 100, 10);
    const completedPercent = Number.parseInt(Number(completedNumsRatio) * 100, 10);
    const standardPercent = Number.parseInt(Number(standardNumsRatio) * 100, 10);

    return (
      <div className={styles.area}>
        <div className={styles.serviceCust}>
          <span className={styles.title}>{SERVED_CUST}</span>
          {this.renderProgressContent(SERVED_CUST, NOT_SERVED_CUST,
            servePercent, 100 - servePercent, servedNums, custCount - servedNums)}
        </div>
        <div className={styles.statusCust}>
          <span className={styles.title}>{COMPLETED_CUST}</span>
          {this.renderProgressContent(COMPLETED_CUST, NOT_COMPLETED_CUST,
            completedPercent, 100 - completedPercent, completedNums, custCount - completedNums)}
        </div>
        <div className={styles.standardCust}>
          <span className={styles.title}>{STASIFY_CUST}</span>
          {this.renderProgressContent(STASIFY_CUST, NOT_STASIFY_CUST,
            standardPercent, 100 - standardPercent, standardNums, custCount - standardNums)}
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
