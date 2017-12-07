/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author zhushengnan
 * @description 管理者视图右侧详情任务反馈
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Progress } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import LabelInfo from '../common/LabelInfo';
import IECharts from '../../IECharts';

import styles from './missionFeedback.less';

// 任务反馈接口本迭代不开发， 故用死数据展示
const resultData = {
  allFeedback: {
    serviceAllNum: '1150',
    aFeedback: '460',
    aFeedbackPer: '40%',
    allTaskFeedbackDes: '所有问题反馈结果',
  },
  radioFeedback: [
    {
      radioTaskFeedbackDes: '单选问题反馈结果如下11',
      radioData: [
        {
          name: '单选选项A',
          value: '10',
          optionPer: '10%',
        },
        {
          name: '单选选项B',
          value: '20',
          optionPer: '20%',
        },
        {
          name: '单选选项C',
          value: '30',
          optionPer: '30%',
        },
        {
          name: '单选选项D',
          value: '40',
          optionPer: '40%',
        },
      ],
    },
    {
      radioTaskFeedbackDes: '单选问题反馈结果如下22',
      radioData: [
        {
          name: '单选选项A',
          value: '10',
          optionPer: '10%',
        },
        {
          name: '单选选项B',
          value: '20',
          optionPer: '20%',
        },
      ],
    },
  ],
  checkboxFeedback: [
    {
      checkboxFeedbackDes: '多选问题反馈结果如下',
      checkboxData: [
        {
          name: '多选选项A',
          value: '10',
          optionPer: '10%',
        },
        {
          name: '多选选项B',
          value: '20',
          optionPer: '20%',
        },
        {
          name: '多选选项C',
          value: '30',
          optionPer: '30%',
        },
        {
          name: '多选选项D',
          value: '40',
          optionPer: '40%',
        },
      ],
    },
    {
      checkboxFeedbackDes: '多选问题反馈结果如下',
      checkboxData: [
        {
          name: '多选选项A',
          value: '10',
          optionPer: '10%',
        },
        {
          name: '多选选项B',
          value: '20',
          optionPer: '20%',
        },
      ],
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

  handleOptionCake(value, names) {
    const option = {
      title: {
        text: '',
        subtext: '',
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const dataShow = `${params.data.name}：<br/>共选择人数：${params.data.value}<br/>所占百分比：${params.data.optionPer}`;
          return dataShow;
        },
      },
      series: [
        {
          name: names,
          type: 'pie',
          radius: [0, 70],
          center: ['50%', '52%'],
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
          data: value,
        },
      ],
      color: ['#6dacf4', '#4fe0f5', '#ffa800', '#756fb8', '#ff4e7b'],
    };
    return option;
  }


  @autobind
  handleOptionBar(value, names) {
    const { isFold } = this.props;
    const grids = isFold ? {
      left: '20%',
      right: '20%',
      bottom: '5%',
      containLabel: true,
    } :
    {
      left: '15%',
      right: '15%',
      bottom: '5%',
      containLabel: true,
    };
    const option = {
      tooltip: {
        formatter: (params) => {
          const dataShow = `${params.data.name}：<br/>共选择人数：${params.data.value}<br/>所占百分比：${params.data.optionPer}`;
          return dataShow;
        },
      },
      grid: grids,
      xAxis: {
        type: 'category',
        data: value,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          name: names,
          type: 'bar',
          barWidth: '20%',
          data: value,
          itemStyle: {
            normal: {
              barBorderRadius: [6, 6, 0, 0],
              color: (params) => {
                const colorList = ['#6dacf4', '#4fe0f5', '#ffa800', '#756fb8', '#ff4e7b'];
                return colorList[params.dataIndex];
              },
            },
          },
        },
      ],
    };
    return option;
  }

  renderRadios() {
    const datas = resultData.radioFeedback;
    const { isFold } = this.props;
    const oDiv = _.map(datas, (item) => {
      const radios = _.map(item.radioData, itemChild =>
        (<h5><span>{itemChild.name}&nbsp;:&nbsp;<b>{itemChild.value}</b>
          <b>({itemChild.optionPer})</b></span></h5>));
      return (
        <div className={styles.radioFeedAll}>
          <div
            className={classnames({
              [styles.firBorder]: !isFold,
              [styles.firBorderTwo]: isFold,
            })}
          >
            <h5>{item.radioTaskFeedbackDes}</h5>
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
                option={this.handleOptionCake(item.radioData, item.radioTaskFeedbackDes)}
                resizable
                style={{
                  height: '180px',
                }}
              />
            </div>
            <div className={styles.tips}>
              <div>
                {radios}
              </div>
            </div>
          </div>
        </div>
      );
    });
    return oDiv;
  }

  renderCheckBox() {
    const datas = resultData.checkboxFeedback;
    const { isFold } = this.props;
    const oDiv = _.map(datas, (item) => {
      const checkBox = _.map(item.checkboxData, itemChild =>
        (<h5><span>{itemChild.name}&nbsp;:&nbsp;<b>{itemChild.value}</b>
          <b>({itemChild.optionPer})</b></span></h5>));
      return (
        <div className={styles.checkFeed}>
          <div
            className={classnames({
              [styles.firBorder]: !isFold,
              [styles.firBorderTwo]: isFold,
            })}
          >
            <h5>{item.checkboxFeedbackDes}</h5>
          </div>
          <div
            className={classnames({
              [styles.sedBoder]: !isFold,
              [styles.sedBoderTwo]: isFold,
            })}
          >
            <div className={styles.charts}>
              <IECharts
                option={this.handleOptionBar(item.checkboxData, item.checkboxFeedbackDes)}
                resizable
                style={{
                  height: '180px',
                }}
              />
            </div>
            <div className={styles.tips}>
              <div>
                {checkBox}
              </div>
            </div>
          </div>
        </div>
      );
    });
    return oDiv;
  }

  render() {
    const { isFold } = this.props;


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
              {this.renderRadios()}
              {this.renderCheckBox()}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
