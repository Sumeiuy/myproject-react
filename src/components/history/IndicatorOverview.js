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
import ChartRadar from '../chartRealTime/ChartRadar';
import IndexItem from './IndexItem';
import styles from './indicatorOverview.less';
import { SelectTreeModal } from '../modals';

export default class IndicatorOverview extends PureComponent {
  static propTypes = {
    overviewData: PropTypes.array,
    indexData: PropTypes.object,
    summuryLib: PropTypes.object.isRequired,
    saveIndcatorToHome: PropTypes.func.isRequired,
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
      selectTreeModal: false,
      selectIndex: 0, // 默认选中项
      indexData,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { indexData: preIndexData } = this.props;
    const { indexData: nextIndexData } = nextProps;
    if (preIndexData !== nextIndexData) {
      const { scopeNum, data } = nextIndexData;
      const cOptions = this.createOption(scopeNum, data);
      // console.warn('cOptions', cOptions);
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
    // console.warn('PreviousPeriod', PreviousPeriod);
    const options = {
      title: {
        show: false,
        text: '指示分析',
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
                formatter: '{a},{b},{c}',
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
                // formatter: function(params) {
                //   if (params.value === (scopeNum - contrast)) {
                //     return contrast;
                //   }
                //   return '';
                // },
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
    const { selectIndex } = this.state;
    const { indexData } = this.props;
    const current = indexData.data[selectIndex].rank_current;
    const contrast = indexData.data[selectIndex].rank_contrast;
    const dataMode = [current, contrast]; // 选中项的排名
    const dataIndex = params.dataIndex; // 图标数据下标 本期、上期
    const preValue = params.value; // 当先图标数值
    const gcount = indexData.scopeNum; // 总公司数
    if (preValue === (gcount - dataMode[dataIndex])) {
      return dataMode[dataIndex];
    }
    return '';
  }

  /**
   * 弹窗处理（关闭）
  */
  @autobind
  handleCancel() {
    this.setState({ selectTreeModal: false });
  }
  /**
   * 弹窗处理（开启）
  */
  @autobind
  showModal() {
    this.setState({ selectTreeModal: true });
  }

  // 概览项选中
  @autobind
  handleClick(event, index) {
    const { indexData } = this.props;
    const { scopeNum, data } = indexData;
    const cOptions = this.createOption(scopeNum, data);
    this.setState({
      selectIndex: index,
      options: cOptions,
    });
  }

  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }

  render() {
    const { overviewData, indexData, summuryLib, saveIndcatorToHome } = this.props;
    if (_.isEmpty(overviewData)) {
      return null;
    }
    const { options, selectIndex, selectTreeModal } = this.state;
    // 创建共同配置项
    const selectTreeProps = {
      modalKey: 'selectTreeModal',
      modalCaption: '挑选指标（挑选您向要查看的指标名称，最少选择 4 项，最多选择 9 项）',
      closeModal: this.closeModal,
      summuryLib,
      visible: selectTreeModal,
      saveIndcatorToHome,
    };
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
              <div className={styles.content}>
                { /* 交易：icon-test 客户：kehu 指标：iczhibiao24px 钱袋：qiandai */ }
                <ul>
                  {
                    overviewData.map((item, index) => {
                      const itemIndex = `select${index}`;
                      const active = selectIndex === index;
                      return (
                        <li
                          onClick={event => this.handleClick(event, index)}
                          key={itemIndex}
                        >
                          <IndexItem
                            itemData={item}
                            active={active}
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
                {
                  overviewData.length ?
                    <p>
                      <span>{overviewData[selectIndex].name}：</span>
                      <span>{overviewData[selectIndex].description}</span>
                    </p>
                  :
                    ''
                }
              </div>
            </div>
          </Col>
          <Col span="10">
            <div className={styles.radarBox}>
              <div className={styles.titleDv}>
                强弱指示分析
              </div>
              <div className={styles.radar}>
                {
                  _.isEmpty(options)
                  ? null
                  : (
                    <ChartRadar
                      options={options}
                    />
                  )
                }
              </div>
              {
                indexData.data ?
                  <div className={styles.radarInfo}>
                    <i />{indexData.data[selectIndex].indicator_name}：本期排名：
                    <span className={styles.now}>
                      {indexData.data[selectIndex].rank_current}
                    </span>
                    上期排名：
                    <span className={styles.before}>
                      {indexData.data[selectIndex].rank_contrast}
                    </span>
                    共 <span className={styles.all}>{indexData.scopeNum}</span> 家营业
                  </div>
                :
                  ''
              }
            </div>
          </Col>
        </Row>
        <SelectTreeModal {...selectTreeProps} />
      </div>
    );
  }
}
