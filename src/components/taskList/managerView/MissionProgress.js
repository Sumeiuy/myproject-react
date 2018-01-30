/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-05 21:18:42
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-22 17:31:31
 * 任务进度
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import styles from './missionProgress.less';

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const SERVED_CUST = '已服务客户';
const NOT_SERVED_CUST = '未服务客户';
const COMPLETED_CUST = '已完成客户';
const NOT_COMPLETED_CUST = '未完成客户';
const STASIFY_CUST = '结果达标客户';
const NOT_STASIFY_CUST = '结果未达标客户';

// 固定顺序
// 已服务，未服务
// IS_SERVED
// 已完成，未完成
// IS_DONE
// 已达标，未达标
// IS_UP_TO_STANDARD
const MISSION_PROGRESS_MAP = [{
  key: 'IS_SERVED',
  name: '已服务，未服务',
}, {
  key: 'IS_DONE',
  name: '已完成，未完成',
}, {
  key: 'IS_UP_TO_STANDARD',
  name: '已达标，未达标',
}];

export default class MissionProgress extends PureComponent {

  static propTypes = {
    // 任务实施进度
    missionImplementationProgress: PropTypes.object,
    // 查看客户明细
    onPreviewCustDetail: PropTypes.func,
    // 任务进度字典
    missionProgressStatusDic: PropTypes.object,
  }

  static defaultProps = {
    missionImplementationProgress: EMPTY_OBJECT,
    onPreviewCustDetail: () => { },
    missionProgressStatusDic: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      progressFlag: '',
      missionProgressStatus: '',
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
  handlePreview({
    title,
    missionProgressStatus,
    progressFlag,
  }) {
    const { onPreviewCustDetail } = this.props;
    onPreviewCustDetail({
      title,
      missionProgressStatus,
      progressFlag,
      canLaunchTask: true,
    });
  }

  @autobind
  findCurrentProgressType(index) {
    const { missionProgressStatusDic: dic = {} } = this.props;
    const currentProgressType = _.find(dic, item =>
      item.key === MISSION_PROGRESS_MAP[index].key) || {};
    return currentProgressType.key;
  }

  @autobind
  renderTooltipContent(type, currentCount) {
    let missionProgressStatus = '';
    let progressFlag = '';

    // 需要传给后台3*2类型
    // missionProgressStatus是字典的属性名
    // progressFlag是标记位,Y或者N
    switch (type) {
      case SERVED_CUST:
        missionProgressStatus = this.findCurrentProgressType(0);
        progressFlag = 'Y';
        break;
      case NOT_SERVED_CUST:
        missionProgressStatus = this.findCurrentProgressType(0);
        progressFlag = 'N';
        break;
      case COMPLETED_CUST:
        missionProgressStatus = this.findCurrentProgressType(1);
        progressFlag = 'Y';
        break;
      case NOT_COMPLETED_CUST:
        missionProgressStatus = this.findCurrentProgressType(1);
        progressFlag = 'N';
        break;
      case STASIFY_CUST:
        missionProgressStatus = this.findCurrentProgressType(2);
        progressFlag = 'Y';
        break;
      case NOT_STASIFY_CUST:
        missionProgressStatus = this.findCurrentProgressType(2);
        progressFlag = 'N';
        break;
      default:
        break;
    }
    return (
      <div className={styles.content}>
        <div className={styles.currentType}>{type}{currentCount || 0}位</div>
        <div
          className={styles.linkCustDetail}
          onClick={() => this.handlePreview({
            type,
            missionProgressStatus,
            progressFlag,
          })}
        >点击查看明细&gt;&gt;</div>
      </div>
    );
  }

  @autobind
  renderProgressContent(
    activeType,
    remainingType,
    activePercent,
    showActivePercent,
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
                style={{ width: `${showActivePercent}%` }}
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
                style={{ width: `${100 - showActivePercent}%` }}
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
    // 真实百分比
    const servePercent = Number.parseInt(Number(servedNumsRatio) * 100, 10);
    const completedPercent = Number.parseInt(Number(completedNumsRatio) * 100, 10);
    const standardPercent = Number.parseInt(Number(standardNumsRatio) * 100, 10);
    // 自适应百分比
    const maxValue = Math.max(servePercent, completedPercent, completedPercent);
    let max = 0;
    if (max !== 100 && maxValue % 100 < 85) {
      max = maxValue + 10.0;
    } else {
      max = Number.parseFloat(maxValue).toFixed(1);
    }
    const showServePercent = Number((servePercent / max) * 100).toFixed(0);
    const showCompletedPercent = Number((completedPercent / max) * 100).toFixed(0);
    const showStandardPercent = Number((standardPercent / max) * 100).toFixed(0);

    return (
      <div className={styles.area}>
        <div className={styles.serviceCust}>
          <span className={styles.title}>{SERVED_CUST}</span>
          {
            this.renderProgressContent(
              SERVED_CUST,
              NOT_SERVED_CUST,
              servePercent,
              showServePercent,
              servedNums,
              custCount - servedNums,
            )
          }
        </div>
        <div className={styles.statusCust}>
          <span className={styles.title}>{COMPLETED_CUST}</span>
          {
            this.renderProgressContent(
              COMPLETED_CUST,
              NOT_COMPLETED_CUST,
              completedPercent,
              showCompletedPercent,
              completedNums,
              custCount - completedNums,
            )
          }
        </div>
        <div className={styles.standardCust}>
          <span className={styles.title}>{STASIFY_CUST}</span>
          {
            this.renderProgressContent(
              STASIFY_CUST,
              NOT_STASIFY_CUST,
              standardPercent,
              showStandardPercent,
              standardNums,
              custCount - standardNums,
            )
          }
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
