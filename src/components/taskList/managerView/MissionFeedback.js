/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author zhushengnan
 * @description 管理者视图右侧详情任务反馈
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Tooltip } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import LabelInfo from '../common/LabelInfo';
import IECharts from '../../IECharts';
import Icon from '../../common/Icon';
import Paganation from '../../common/Paganation';

import styles from './missionFeedback.less';

// 任务反馈接口本迭代不开发， 故用死数据展示
const resultData = {
  allFeedback: {
    serviceAllNum: '1150',
    aFeedback: '1150',
    aFeedbackPer: '100%',
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
        {
          name: '单选选项E',
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

const problems = {
  resultData: {
    pageInfo: {
      curPageNum: 1,
      curPageSize: 10,
      totalPage: 100,
    },
    dataInfo: [{
      infoProblem: '这是问题描述，问题描述',
      infoData: [
        { data: '这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
      ],
    },
    {
      infoProblem: '这是问题描述222，问题描述2222',
      infoData: [
        { data: '这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
        { data: '这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述这是问题描述，问题描述' },
      ],
    }],
  },
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

  constructor(props) {
    super(props);
    this.state = {
      expandAll: false,
      cycleSelect: '',
      createCustRange: [],
    };
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
          radius: [0, 55],
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
      color: ['#6dacf4', '#4fe0f5', '#ffa800', '#756fb8', '#4adad5'],
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
    } : {
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
        axisLine: {
          show: true,
          lineStyle: {
            color: '#e2e2e2',
          },
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
                const colorList = ['#6dacf4', '#4fe0f5', '#ffa800', '#756fb8', '#4adad5'];
                return colorList[params.dataIndex];
              },
            },
          },
        },
      ],
    };
    return option;
  }

  handleShowData(onOff, nameDes, data, item, isRadio = false) {
    return (
      <div className={styles.radioFeedAll}>
        <div
          className={classnames({
            [styles.firBorder]: !onOff,
            [styles.firBorderTwo]: onOff,
          })}
        >
          <h5>{nameDes}</h5>
        </div>
        <div
          className={classnames({
            [styles.sedBoder]: !onOff,
            [styles.sedBoderTwo]: onOff,
          })}
        >
          <div className={styles.charts}>
            <IECharts
              option={isRadio ? this.handleOptionCake(data, nameDes) :
                this.handleOptionBar(data, nameDes)}
              resizable
              style={{
                height: '180px',
              }}
            />
          </div>
          <div className={styles.tips}>
            <div>
              {item}
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  renderTooltipContent(type, currentCount, per = null) {
    return (
      <div className={styles.content}>

        {_.isEmpty(per) ?
          <div className={styles.currentType}>{type}&nbsp;:&nbsp;{currentCount || 0}位</div> :
          <div className={styles.currentType}>{type}&nbsp;:&nbsp;{currentCount || 0}({per})</div>
        }
      </div>
    );
  }

  renderAllFeedback(allCount, count, countPer, residue) {
    const type = '服务经理总数';
    const per = '已反馈人数';
    return (
      <div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-show-info">
        <div>
          <div className="ant-progress-outer">
            <Tooltip
              placement="topLeft"
              title={() => this.renderTooltipContent(per, count, countPer)}
              arrowPointAtCenter
              overlayClassName={styles.tooltipOverlay}
            >
              <div
                className="ant-progress-bg"
                style={{ width: `${countPer}%` }}
              />
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title={() => this.renderTooltipContent(type, allCount)}
              arrowPointAtCenter
              overlayClassName={styles.tooltipOverlay}
            >
              <div
                className="ant-progress-inner"
                style={{ width: `${residue}%` }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  renderRadios(data) {
    const { isFold } = this.props;
    const isRadio = true;
    const oDiv = _.map(data, (item) => {
      const radios = _.map(item.radioData, itemChild =>
        (<h5 key={itemChild.value}><span>{itemChild.name}&nbsp;:&nbsp;<b>{itemChild.value}</b>
          <b>({itemChild.optionPer})</b></span></h5>));
      return this.handleShowData(isFold, item.radioTaskFeedbackDes,
        item.radioData, radios, isRadio);
    });
    return oDiv;
  }

  @autobind
  renderCheckBox(data) {
    const { isFold } = this.props;
    const oDiv = _.map(data, (item) => {
      const checkBox = _.map(item.checkboxData, itemChild =>
        (<h5 key={itemChild.value}><span>{itemChild.name}&nbsp;:&nbsp;<b>{itemChild.value}</b>
          <b>({itemChild.optionPer})</b></span></h5>));
      return this.handleShowData(isFold, item.checkboxFeedbackDes,
        item.checkboxData, checkBox);
    });
    return oDiv;
  }

  @autobind
  handlePageChange(value, page) {
    console.log('-->', value, page);
  }

  @autobind
  handleSizeChange(value) {
    console.log('value--->', value);
  }

  @autobind
  renderProblemsInfo(key) {
    // const problemsInfo = problems.resultData.dataInfo;
    const { isFold } = this.props;
    const { curPageNum, curPageSize, totalRecordNum } = problems.resultData.pageInfo;
    const value = _.map(key, (item) => {
      const info = _.map(item.infoData, (itemChild, index) =>
        <h5 title={itemChild.data} key={itemChild.data}>{index + 1}.{itemChild.data}</h5>);
      return (
        <div className={styles.subjective}>
          <div
            className={classnames({
              [styles.problemsInfo]: !isFold,
              [styles.problemsInfoTwo]: isFold,
            })}
          >
            <h5>{item.infoProblem}</h5>
          </div>
          <div
            className={classnames({
              [styles.thrBoder]: !isFold,
              [styles.thrBoderTwo]: isFold,
            })}
          >
            <div className={styles.problems}>
              <div>
                {info}
                <Paganation
                  curPageNum={curPageNum}
                  curPageSize={curPageSize}
                  totalRecordNum={totalRecordNum}
                  onPageChange={this.handlePageChange}
                  onSizeChange={this.handleSizeChange}
                />
              </div>
            </div>
          </div>
        </div>
      );
    });
    return value;
  }

  render() {
    const { isFold } = this.props;
    const { allFeedback, radioFeedback, checkboxFeedback } = resultData;
    const residue = (1 - (Number(allFeedback.aFeedbackPer) / 100)) * 100;
    return (
      <div className={styles.basicInfo}>
        <div className={styles.feedbackTitle}>
          <div>
            <LabelInfo value="任务反馈" />
          </div>
          <div>
            <div className={styles.down}>
              <div className={styles.iconDown}>
                <Icon type="xiazai" />
              </div>
              <div className={styles.downLoad}>
                导出
            </div>
            </div>
          </div>
        </div>
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
                  {allFeedback.allTaskFeedbackDes}
                </div>
                <div
                  className={classnames({
                    [styles.allSedBoder]: !isFold,
                    [styles.allSedBoderTwo]: isFold,
                  })}
                >
                  <div className={styles.charts}>
                    {this.renderAllFeedback(allFeedback.serviceAllNum,
                      allFeedback.aFeedback, allFeedback.aFeedbackPer, residue)}
                  </div>
                  <div className={styles.allService}>
                    <span>服务经理总数：<b>{allFeedback.serviceAllNum}</b></span>
                    <span>已反馈：<b>{allFeedback.aFeedback}</b>
                      <b>({allFeedback.aFeedbackPer})</b></span>
                  </div>
                </div>
              </div>
              {this.renderRadios(radioFeedback)}
              {this.renderCheckBox(checkboxFeedback)}
              {this.renderProblemsInfo(problems.resultData.dataInfo)}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
