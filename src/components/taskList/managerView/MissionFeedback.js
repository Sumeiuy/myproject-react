/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的基本信息
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Progress } from 'antd';
import classnames from 'classnames';
import LabelInfo from '../common/LabelInfo';
import IECharts from '../../IECharts';

import styles from './missionFeedback.less';

const option = {
  title: {
    text: '',
    subtext: '',
    x: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  color: ['#6dacf4', '#4fe0f5', '#ffa800', '#756fb8'],
  series: [
    {
      name: '半径模式',
      type: 'pie',
      radius: [0, 100],
      center: ['50%', '46%'],
      roseType: 'radius',
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: false,
        },
      },
      lableLine: {
        normal: {
          show: false,
        },
        emphasis: {
          show: true,
        },
      },
      data: [
        { value: 15, name: 'rose1' },
        { value: 30, name: 'rose2' },
        { value: 25, name: 'rose3' },
        { value: 25, name: 'rose4' },
      ],
    },
  ],
};
const option2 = {
  tooltip: {
    trigger: 'axis',
  },
  color: ['#6dacf4', '#4fe0f5', '#ffa800', '#756fb8'],
  grid: {
    left: '10%',
    right: '10%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: [
    {
      data: [],
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: {
    show: false,
  },
  series: [
    {
      name: '直接访问',
      type: 'bar',
      barWidth: '20%',
      data: [10, 52, 200, 334],
      itemStyle: {
        normal: {
          barBorderRadius: [15, 15, 0, 0],
        },
      },
    },
  ],
};

export default class MissionFeedback extends PureComponent {

  static propTypes = {
    // 有效期开始时间
    triggerTime: PropTypes.string,
    // 有效期结束时间
    endTime: PropTypes.string,
    // 任务目标
    missionTarget: PropTypes.string,
    // 服务策略
    servicePolicy: PropTypes.string,
    // 父容器宽度变化,默认宽度窄
    isFold: PropTypes.bool,
  }

  static defaultProps = {
    triggerTime: '',
    endTime: '',
    missionTarget: '',
    servicePolicy: '',
    isFold: false,
  }

  render() {
    const { isFold } = this.props;
    // const colSpanValue = isFold ? 12 : 24;
    console.log('isFold-->', isFold);
    return (
      <div className={styles.basicInfo}>
        <LabelInfo value="任务反馈" />
        <div className={styles.feedback}>
          <Row className={styles.feedbackContent}>
            <Col span={24}>
              <div className={styles.FeedAll}>
                <div
                  className={classnames({
                    [styles.firAllBorder]: !isFold,
                    [styles.firAllBorderTwo]: isFold,
                  })}
                >
                  总体反馈状态
                </div>
                <div
                  className={classnames({
                    [styles.allSedBoder]: !isFold,
                    [styles.allSedBoderTwo]: isFold,
                  })}
                >
                  <div className={styles.charts}>
                    <Progress percent={50} showInfo={false} />
                  </div>
                  <div className={styles.allService}>
                    <span>服务经理总数：<b>33333</b></span>
                    <span>已反馈：<b>33333</b><b>(30%)</b></span>
                  </div>
                </div>
              </div>
              <div className={styles.radioFeedAll}>
                <div
                  className={classnames({
                    [styles.firBorder]: !isFold,
                    [styles.firBorderTwo]: isFold,
                  })}
                >
                  <h5>单选描述问题描述问题描述单选描述问</h5>
                </div>
                <div
                  className={classnames({
                    [styles.sedBoder]: !isFold,
                    [styles.sedBoderTwo]: isFold,
                  })}
                >
                  <div className={styles.charts}>
                    <IECharts
                      onReady={this.handleBusinessOpenClick}
                      option={option}
                      resizable
                      style={{
                        height: '216px',
                      }}
                    />
                  </div>
                  <div className={styles.tips}>
                    <h5><span>反馈结果选项A:<b>33333</b><b>(30%)</b></span></h5>
                    <h5><span>反馈结果选项A:<b>33333</b><b>(30%)</b></span></h5>
                    <h5><span>反馈结果选项A:<b>33333</b><b>(30%)</b></span></h5>
                    <h5><span>反馈结果选项A:<b>33333</b><b>(30%)</b></span></h5>
                  </div>
                </div>
              </div>
              <div className={styles.checkFeed}>
                <div
                  className={classnames({
                    [styles.firBorder]: !isFold,
                    [styles.firBorderTwo]: isFold,
                  })}
                >
                  多选描述问题描述问题描述
                </div>
                <div
                  className={classnames({
                    [styles.sedBoder]: !isFold,
                    [styles.sedBoderTwo]: isFold,
                  })}
                >
                  <div className={styles.charts}>
                    <IECharts
                      onReady={this.handleBusinessOpenClick}
                      option={option2}
                      resizable
                      style={{
                        height: '216px',
                      }}
                    />
                  </div>
                  <div className={styles.tips}>
                    <h5><span>反馈结果选项A:<b>33333</b><b>(30%)</b></span></h5>
                    <h5><span>反馈结果选项A:<b>33333</b><b>(30%)</b></span></h5>
                    <h5><span>反馈结果选项A:<b>33333</b><b>(30%)</b></span></h5>
                    <h5><span>反馈结果选项A:<b>33333</b><b>(30%)</b></span></h5>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
