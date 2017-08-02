/**
 * @file /history/IndicatorOverview.js
 *  历史指标-指标概览
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../common/Icon';
import PickIndicators from './PickIndicators';
import ChartRadar from '../chartRealTime/ChartRadar';
import IndexItem from './IndexItem';
import styles from './indicatorOverview.less';

export default class IndicatorOverview extends PureComponent {
  static propTypes = {
    overviewData: PropTypes.array,
    indexData: PropTypes.object,
  }

  static defaultProps = {
    overviewData: [],
    indexData: {},
  }

  constructor(props) {
    super(props);
    const { indexData } = this.props;
    this.state = {
      visible: false,
      selectIndex: 'select0', // 默认选中项
      indexData,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { indexData: preIndexData } = this.props;
    const { indexData: nextIndexData } = nextProps;
    if (preIndexData !== nextIndexData) {
      const { scopeNum, data } = nextIndexData;
      const cOptions = this.createOption(scopeNum, data);
      this.setState({
        options: cOptions,
      });
    }
  }

  /**
   * options
  */
  @autobind
  createOption(scopeNum, data) {
    const indicatorData = [];// name
    const period = []; // 本期数据值
    const PreviousPeriod = []; // 上期
    _.each(data, (item) => {
      indicatorData.push({ name: item.indicator_name, max: scopeNum });
      period.push(scopeNum - item.rank_current);
      PreviousPeriod.push(scopeNum - item.rank_contrast);
    });
    const options = {
      title: {
        show: false,
        text: '强弱指示分析',
      },
      gird: { x: '7%', y: '7%', width: '38%', height: '38%' },
      legend: {
        data: [
          { name: '本期', icon: 'square' },
          { name: '上期', icon: 'square' },
        ],
        bottom: 0,
        left: '10%',
        itemGap: 20,
      },
      radar: {
        shape: 'circle',
        splitNumber: 6,
        // polarIndex: 1,
        center: ['50%', '45%'],
        name: {
          textStyle: {
            color: '#666666',
          },
        },
        splitLine: {
          lineStyle: {
            color: [
              '#ebf2ff',
            ].reverse(),
          },
        },
        splitArea: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#b9e7fd',
          },
        },
        indicator: indicatorData,
      },
      series: [{
        name: '本期 vs 上期',
        type: 'radar',
        smooth: true,
        symbolSize: 1,
        data: [
          {
            value: period,
            name: '本期',
            areaStyle: {
              normal: {
                color: 'rgba(117, 111,184, 0.5)',
              },
            },
            itemStyle: {
              normal: {
                color: '#38d8e8',
              },
            },
            label: {
              normal: {
                show: true,
                formatter: this.labelShow,
                textStyle: {
                  color: '#ff7a39',
                },
              },
            },
            // symbolSize: 5,
            // syboml: 'circle',
          },
          {
            value: PreviousPeriod,
            name: '上期',
            areaStyle: {
              normal: {
                color: 'rgba(58, 216,232, 0.5)',
              },
            },
            itemStyle: {
              normal: {
                color: '#756fb8',
              },
            },
            label: {
              normal: {
                show: true,
                formatter: this.labelShow,
                textStyle: {
                  color: '#3983ff',
                },
              },
            },
          },
        ],
      }],
    };
    return options;
  }

  @autobind
  labelShow(params) {
    const dataMode = [2, 1]; // 选中项的排名
    const dataIndex = params.dataIndex; // 图标数据下标 本期、上期
    const preValue = params.value; // 当先图标数值
    const gcount = 32; // 总公司数
    if (preValue === (gcount - dataMode[dataIndex])) {
      return dataMode[dataIndex];
    }
    return '';
  }

  /**
   * 问题处理提交
  */
  @autobind
  handleCreate(f) {
    const form = f;
    console.log(form);
  }
  /**
   * 存储处理问题form
  */
  saveFormRef = (form) => {
    this.handlingForm = form;
  }
  /**
   * 弹窗处理（关闭）
  */
  handleCancel = () => {
    this.setState({ visible: false });
  }
  /**
   * 弹窗处理（开启）
  */
  showModal = () => {
    this.setState({ visible: true });
  }

  // 概览项选中
  @autobind
  handleClick(event) {
    const dataKey = event.currentTarget.getAttribute('data-key');
    this.setState({
      selectIndex: `select${dataKey}`,
    });
  }

  render() {
    const { overviewData } = this.props;
    const { options } = this.state;
    return (
      <div className={styles.overviewBox}>
        <Row>
          <Col span="14">
            <div className={styles.overview}>
              <div className={styles.titleDv}>
                <Button
                  type="primary"
                  ghost className={styles.btn_r}
                  onClick={this.showModal}
                >
                  <Icon type="jia" />
                  挑选指标
                </Button>
                指标概览
              </div>
              <PickIndicators
                ref={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
              />
              <div className={styles.content}>
                {/* 交易：icon-test 客户：kehu 指标：iczhibiao24px 钱袋：qiandai */}
                <ul>
                  {
                    overviewData.map((item, index) => {
                      const selectIndex = `select${index}`;
                      return (
                        <li
                          onClick={event => this.handleClick(event)}
                          key={selectIndex}
                          data-key={index}
                        >
                          <IndexItem
                            itemData={item}
                            active={this.state.selectIndex}
                            itemIndex={selectIndex}
                          />
                        </li>
                      );
                    })
                  }
                  <div className={styles.clear} />
                </ul>
              </div>
              <div className={styles.bottomInfo}>
                <i />
                <p>
                  <span>资产交易量：</span>
                  资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资
产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量资产交易量。</p>
              </div>
            </div>
          </Col>
          <Col span="10">
            <div className={styles.radarBox}>
              <div className={styles.titleDv}>
                强弱指示分析
              </div>
              <div className={styles.radar}>
                {!_.isEmpty(options) ? <ChartRadar
                  options={options}
                /> : null}
              </div>
              <div className={styles.radarInfo}>
                <i />新开客户：本期排名：
                <span className={styles.now}>3</span>
                上期排名：<span className={styles.before}>4</span>
                共 <span className={styles.all}>9</span> 家营业
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
