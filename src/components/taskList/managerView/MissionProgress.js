/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-05 21:18:42
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-02-08 20:47:52
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

function getPercent(num) {
  return Number(num * 100).toFixed(0);
}

export default class MissionProgress extends PureComponent {

  static propTypes = {
    // 任务实施进度
    missionImplementationProgress: PropTypes.object,
    // 查看客户明细
    onPreviewCustDetail: PropTypes.func,
    // 任务进度字典
    missionProgressStatusDic: PropTypes.array,
  }

  static defaultProps = {
    missionImplementationProgress: EMPTY_OBJECT,
    onPreviewCustDetail: () => { },
    missionProgressStatusDic: [],
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
    type,
    missionProgressStatus,
    progressFlag,
  }) {
    const { onPreviewCustDetail } = this.props;
    onPreviewCustDetail({
      title: type,
      missionProgressStatus,
      progressFlag,
      canLaunchTask: true,
      // 代表是从进度条点击的
      isEntryFromProgressDetail: true,
    });
  }

  @autobind
  findCurrentProgressType(index) {
    const { missionProgressStatusDic: dic = [] } = this.props;
    const currentProgressType = _.find(dic, item =>
      item.key === MISSION_PROGRESS_MAP[index].key) || {};
    return currentProgressType.key;
  }

  @autobind
  renderTooltipContent(type, currentCount) {
    // let missionProgressStatus = '';
    // let progressFlag = '';

    // // 需要传给后台3*2类型
    // // missionProgressStatus是字典的属性名
    // // progressFlag是标记位,Y或者N
    // switch (type) {
    //   case SERVED_CUST:
    //     missionProgressStatus = this.findCurrentProgressType(0);
    //     progressFlag = 'Y';
    //     break;
    //   case NOT_SERVED_CUST:
    //     missionProgressStatus = this.findCurrentProgressType(0);
    //     progressFlag = 'N';
    //     break;
    //   case COMPLETED_CUST:
    //     missionProgressStatus = this.findCurrentProgressType(1);
    //     progressFlag = 'Y';
    //     break;
    //   case NOT_COMPLETED_CUST:
    //     missionProgressStatus = this.findCurrentProgressType(1);
    //     progressFlag = 'N';
    //     break;
    //   case STASIFY_CUST:
    //     missionProgressStatus = this.findCurrentProgressType(2);
    //     progressFlag = 'Y';
    //     break;
    //   case NOT_STASIFY_CUST:
    //     missionProgressStatus = this.findCurrentProgressType(2);
    //     progressFlag = 'N';
    //     break;
    //   default:
    //     break;
    // }
    return (
      <div className={styles.content}>
        <div className={styles.currentType}>{type}{currentCount || 0}位</div>
        {/**
         * 暂时去掉，后端性能问题
         */}
        {/* <div
          className={styles.linkCustDetail}
          onClick={() => this.handlePreview({
            type,
            missionProgressStatus,
            progressFlag,
          })}
        >点击查看明细&gt;&gt;</div> */}
      </div>
    );
  }

  @autobind
  renderProgressContent({
    activeType,
    remainingType,
    activePercent,
    activeCount,
    remainingCount,
  }) {
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
                style={{ width: `${100 - activePercent}%` }}
              />
            </Tooltip>
          </div>
        </div>
        <span className="ant-progress-text">{activeCount} / {activePercent}%</span>
      </div>
    );
  }

  getParam(param) {
    const { total, activeCount, ratio, activeType, remainingType } = param;
    // 真实百分比
    const activePercent = getPercent(Number(ratio));
    return {
      activeType,
      remainingType,
      activeCount,
      activePercent,
      remainingCount: total - activeCount,
    };
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
    const serveParam = this.getParam({
      total: custCount,
      ratio: servedNumsRatio,
      activeCount: servedNums,
      activeType: SERVED_CUST,
      remainingType: NOT_SERVED_CUST,
    });
    const completedParam = this.getParam({
      total: custCount,
      ratio: completedNumsRatio,
      activeCount: completedNums,
      activeType: COMPLETED_CUST,
      remainingType: NOT_COMPLETED_CUST,
    });
    const standardParam = this.getParam({
      total: custCount,
      ratio: standardNumsRatio,
      activeCount: standardNums,
      activeType: STASIFY_CUST,
      remainingType: NOT_STASIFY_CUST,
    });

    return (
      <div className={styles.area}>
        <div className={styles.serviceCust}>
          <span className={styles.title}>{SERVED_CUST}</span>
          {
            this.renderProgressContent(serveParam)
          }
        </div>
        <div className={styles.statusCust}>
          <span className={styles.title}>{COMPLETED_CUST}</span>
          {
            this.renderProgressContent(completedParam)
          }
        </div>
        <div className={styles.standardCust}>
          <span className={styles.title}>{STASIFY_CUST}</span>
          {
            this.renderProgressContent(standardParam)
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
