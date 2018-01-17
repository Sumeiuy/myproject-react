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

// const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default class MissionFeedback extends PureComponent {

  static propTypes = {
    // 父容器宽度变化,默认宽度窄
    isFold: PropTypes.bool,
    // 任务反馈统计数据
    missionFeedbackData: PropTypes.array.isRequired,
    // 任务反馈已反馈总数
    missionFeedbackCount: PropTypes.number.isRequired,
    // 服务经理总数
    serveManagerCount: PropTypes.number.isRequired,
  }

  static defaultProps = {
    isFold: false,
  }

  constructor(props) {
    super(props);

    // const { finalData, originProblemData } = this.handleData(
    //   props.missionFeedbackData,
    //   props.missionFeedbackCount,
    //   props.serveManagerCount,
    // );

    this.state = {
      expandAll: false,
      cycleSelect: '',
      createCustRange: [],
      finalData: {
        allFeedback: {},
        radioFeedback: [],
        checkboxFeedback: [],
      },
      problems: {
        resultData: {
          pageInfo: {
            curPageNum: 1,
            curPageSize: 10,
            totalPage: 10,
          },
          dataInfo: [],
        },
      },
      originProblemData: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { missionFeedbackCount, missionFeedbackData = EMPTY_LIST, serveManagerCount } = nextProps;
    const { missionFeedbackCount: count, missionFeedbackData: data = EMPTY_LIST } = this.props;
    const { problems } = this.state;
    if (data !== missionFeedbackData && count !== missionFeedbackCount) {
      const { finalData, originProblemData } = this.handleData(
        missionFeedbackData,
        missionFeedbackCount,
        serveManagerCount,
        problems,
      );

      this.setState({
        finalData,
        problems: originProblemData,
        originProblemData,
      });
    }
  }

  @autobind
  handleData(missionFeedbackData, missionFeedbackCount, serveManagerCount, problems = []) {
    const finalData = this.formatData(
      missionFeedbackData,
      missionFeedbackCount,
      serveManagerCount,
    );
    const { dataInfo } = finalData;
    const originProblemData = _.merge(problems, {
      resultData: {
        dataInfo,
        pageInfo: {
          curPageNum: 1,
          curPageSize: 10,
          totalPage: _.size(dataInfo),
        },
      },
    });

    return {
      finalData,
      originProblemData,
    };
  }

  /**
   * 构造饼图和进度条需要的数据结构
   * @param {*array} missionFeedbackData 任务反馈数据
   * @param {*number} missionFeedbackCount 任务反馈已反馈数
   * @param {*number} serveManagerCount 服务经理总数
   */
  @autobind
  formatData(missionFeedbackData, missionFeedbackCount, serveManagerCount) {
    let finalData = [];
    let countPercent = 0;
    if (serveManagerCount !== 0) {
      countPercent = ((missionFeedbackCount / serveManagerCount) * 100).toFixed(0);
    }

    let radioFeedback = [];
    let checkboxFeedback = [];
    let answerTotalCount = 0;
    let dataInfo = [];
    _.each(missionFeedbackData, (item) => {
      if (_.isArray(item)) {
        let radioData = [];
        let checkboxData = [];
        let infoData = [];

        // 拿到当前题目所有count之和,下面需要计算每一个答案占的比率
        answerTotalCount = _.reduce(_.map(item, childItem =>
          childItem.cnt), (sum, n) => sum + n, 0);

        _.each(item, (childItem) => {
          const { quesTypeCode } = childItem;
          if (quesTypeCode === '1' || quesTypeCode === 1 || quesTypeCode === '2' || quesTypeCode === 2) {
            const tempData = [{
              name: childItem.optionValue,
              value: childItem.cnt,
              optionPer: `${((childItem.cnt / answerTotalCount) * 100).toFixed(0) || 0}%`,
            }];
            if (quesTypeCode === '1') {
              // 单选题
              radioData = _.concat(radioData, tempData);
            } else {
              // 多选题
              checkboxData = _.concat(checkboxData, tempData);
            }
          } else if (quesTypeCode === '3' || quesTypeCode === 3) {
            // 主观题
            infoData = _.concat(infoData, [
              { data: childItem.answerText },
            ]);
          }
        });

        if (!_.isEmpty(radioData)) {
          radioFeedback = _.concat(radioFeedback, [{
            radioTaskFeedbackDes: item[0].quesValue,
            radioData,
          }]);
        }

        if (!_.isEmpty(checkboxData)) {
          checkboxFeedback = _.concat(checkboxFeedback, [{
            checkboxFeedbackDes: item[0].quesValue,
            checkboxData,
          }]);
        }

        if (!_.isEmpty(infoData)) {
          dataInfo = _.concat(dataInfo, [{
            infoProblem: item[0].quesValue,
            infoData,
          }]);
        }
      }
    });

    finalData = {
      allFeedback: {
        serviceAllNum: serveManagerCount || 0,
        aFeedback: missionFeedbackCount || 0,
        aFeedbackPer: `${countPercent}%`,
        allTaskFeedbackDes: '所有问题反馈结果',
      },
      radioFeedback,
      checkboxFeedback,
      dataInfo,
    };

    return finalData;
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
    const grids = isFold ? { left: '20%', right: '20%', bottom: '5%', containLabel: true } :
      { left: '15%', right: '15%', bottom: '5%', containLabel: true };
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

  /**
   * 页码改变事件，翻页事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页条目
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { problems } = this.state;
    const { curDataInfo } = this.renderProblemsData(nextPage, currentPageSize);
    this.setState({
      problems: _.merge(problems, {
        resultData: {
          pageInfo: {
            curPageNum: nextPage,
            curPageSize: currentPageSize,
          },
          dataInfo: curDataInfo,
        },
      }),
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleSizeChange(currentPageNum, changedPageSize) {
    const { problems } = this.state;
    const { curDataInfo } = this.renderProblemsData(currentPageNum, changedPageSize);
    this.setState({
      problems: _.merge(problems, {
        resultData: {
          pageInfo: {
            curPageNum: currentPageNum,
            curPageSize: changedPageSize,
          },
          dataInfo: curDataInfo,
        },
      }),
    });
  }

  @autobind
  renderProblemsData(curPageNum, curPageSize) {
    const { problems: { resultData: { dataInfo } } } = this.state;
    let curDataInfo = [];
    if (curPageNum <= 1) {
      // 第一页
      curDataInfo = _.slice(dataInfo, 0, curPageSize);
    } else {
      // 大于一页
      curDataInfo = _.slice(dataInfo,
        (curPageNum - 1) * curPageSize, curPageSize);
    }

    return {
      curDataInfo,
    };
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

  @autobind
  renderProblemsInfo(key) {
    const { isFold } = this.props;
    const { problems: { resultData: { pageInfo } } } = this.state;
    const { curPageNum, curPageSize, totalRecordNum } = pageInfo;
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
    const { problems: { resultData: { dataInfo } }, finalData } = this.state;
    const { allFeedback, radioFeedback, checkboxFeedback } = finalData;
    const residue = (1 - (Number(allFeedback.aFeedbackPer) / 100)) * 100;

    if (_.isEmpty(dataInfo) &&
      _.isEmpty(allFeedback) &&
      _.isEmpty(radioFeedback) &&
      _.isEmpty(checkboxFeedback)) {
      return null;
    }

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
                  <div className={styles.layBox}>
                    <div className={styles.charts}>
                      {this.renderAllFeedback(allFeedback.serviceAllNum,
                        allFeedback.aFeedback, allFeedback.aFeedbackPer, residue)}
                    </div>
                    <div className={styles.allService}>
                      <span>服务经理总数：<b>{allFeedback.serviceAllNum}</b></span>
                      <span>已反馈：<b>{allFeedback.aFeedback}</b>
                        <b>{allFeedback.aFeedbackPer ? `(${allFeedback.aFeedbackPer})` : ''}</b></span>
                    </div>
                  </div>
                </div>
              </div>
              {this.renderRadios(radioFeedback)}
              {this.renderCheckBox(checkboxFeedback)}
              {this.renderProblemsInfo(dataInfo)}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
