/**
 * by xuxiaoqin
 * AbilityScatterAnalysis.js
 */
import React, { PropTypes, PureComponent } from 'react';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import CommonScatter from '../chartRealTime/CommonScatter';
import { constructScatterData } from './ConstructScatterData';
import { constructScatterOptions } from './ConstructScatterOptions';
import styles from './abilityScatterAnalysis.less';

const Option = Select.Option;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

export default class AbilityScatterAnalysis extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    queryContrastAnalyze: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    optionsData: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    swtichDefault: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    contrastType: PropTypes.string.isRequired,
    isLvIndicator: PropTypes.bool.isRequired,
    level: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    const options = this.makeOptions(props.optionsData);
    // 默认第一个选项
    this.state = {
      scatterElemHeight: 360,
      finalData: {},
      isShowTooltip: false,
      orgName: '',
      parentOrgName: '',
      finalOptions: options,
      selectValue: options[0].value,
      averageInfo: '',
      tooltipInfo: '',
      scatterOptions: EMPTY_OBJECT,
      average: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: nextData, swtichDefault: newSwitch, optionsData: nextOptions } = nextProps;
    const {
      swtichDefault: oldSwitch,
      description,
      optionsData: prevOptions,
      isLvIndicator,
    } = this.props;
    const {
      core = EMPTY_OBJECT,
      contrast = EMPTY_OBJECT,
      scatterDiagramModels = EMPTY_LIST,
    } = nextData;

    // 有值就构造图表数据
    if (!_.isEmpty(scatterDiagramModels)) {
      const finalData = constructScatterData({
        core,
        contrast,
        scatterDiagramModels,
        description,
        isLvIndicator,
      });
      const { averageInfo } = finalData;
      this.getAnyPoint(finalData);
      this.setState({
        finalData,
        averageInfo,
      });
    } else {
      this.setState({
        finalData: EMPTY_OBJECT,
        averageInfo: '',
      });
    }

    // 恢复默认选项
    if (oldSwitch !== newSwitch) {
      const options = this.state.finalOptions;
      this.setState({
        selectValue: options[0].value,
      });
    }

    // 切换对比数据
    if (prevOptions !== nextOptions) {
      const data = this.makeOptions(nextOptions);
      this.setState({
        finalOptions: data,
        selectValue: data[0].value,
      });
    }
  }

  /**
   * 根据斜率，计算出一个点，用来画直线，点必须靠近最大值，不然线不能延长
   * @param {*} seriesData series数据
   */
  getAnyPoint(seriesData) {
    const { xAxisMin, yAxisMin, yAxisMax, slope, xAxisMax, currentMax, average } = seriesData;
    let compare;
    let current;
    if (average) {
      // 代表率
      // 直接画出一条横线，代表平均线
      const scatterOptions = constructScatterOptions({
        ...seriesData,
        startCoord: [xAxisMin, average],
        endCoord: [xAxisMax, average],
      });

      this.setState({
        scatterOptions,
        average,
      });
      return true;
    }

    if (slope === 0) {
      // 处理斜率等于0
      // 画出两个空折线图，平均线横躺
      const scatterOptions = constructScatterOptions({
        ...seriesData,
        startCoord: [0, 0],
        endCoord: [1, 0],
      });

      this.setState({
        scatterOptions,
        average: '',
      });
      return true;
    } else if (slope <= 1) {
      // 处理斜率小于1的情况
      // 太小的斜率直接计算坐标
      const endYCood = yAxisMin + ((xAxisMax - xAxisMin) * slope);
      let finalSeriesData = {
        ...seriesData,
        startCoord: [xAxisMin, yAxisMin],
        endCoord: [xAxisMax, endYCood],
      };

      // 如果算出来的y坐标小于或者大于轴刻度的最小或最大值
      // 则将计算出来的值，作为刻度边界值，取floor或者ceil
      if (endYCood < yAxisMin) {
        finalSeriesData = {
          ...finalSeriesData,
          yAxisMin: Math.floor(endYCood),
        };
      } else if (endYCood > yAxisMax) {
        finalSeriesData = {
          ...finalSeriesData,
          yAxisMax: Math.ceil(endYCood),
        };
      }
      const scatterOptions = constructScatterOptions({
        ...finalSeriesData,
      });

      this.setState({
        scatterOptions,
        average: '',
      });
      return true;
    }

    // 比较当前x轴是否比x轴最大值大
    // 小的话，则取当前值
    // 不然递归调用
    if (xAxisMax > yAxisMax) {
      compare = yAxisMax;
      current = currentMax || xAxisMax;
    } else {
      compare = xAxisMax;
      current = currentMax || yAxisMax;
    }
    const point = (current - yAxisMin) / slope;

    if (point > compare) {
      if (current / 10000 > 1) {
        this.getAnyPoint({
          ...seriesData,
          currentMax: current - 5000,
        });
        return false;
      } else if (current / 1000 > 1) {
        this.getAnyPoint({
          ...seriesData,
          currentMax: current - 500,
        });
        return false;
      } else if (current / 100 > 1) {
        this.getAnyPoint({
          ...seriesData,
          currentMax: current - 50,
        });
        return false;
      } else if (current / 10 > 1) {
        this.getAnyPoint({
          ...seriesData,
          currentMax: current - 5,
        });
        return false;
      } else if (current !== 0) {
        this.getAnyPoint({
          ...seriesData,
          currentMax: current - 1,
        });
        return false;
      }
    }

    let endCoord;
    let finalSeriesData = seriesData;
    // 如果算出来的y坐标小于轴刻度的最小
    // 则将计算出来的值，作为刻度边界值，取floor
    if (xAxisMax > yAxisMax) {
      endCoord = [current, point];
      if (point < yAxisMin) {
        finalSeriesData = {
          ...seriesData,
          yAxisMin: Math.floor(point),
        };
      }
    } else {
      endCoord = [point, current];
      if (point < xAxisMin) {
        finalSeriesData = {
          ...seriesData,
          xAxisMin: Math.floor(point),
        };
      }
    }

    const scatterOptions = constructScatterOptions({
      ...finalSeriesData,
      startCoord: [xAxisMin, yAxisMin],
      endCoord,
    });

    this.setState({
      scatterOptions,
      average: '',
    });
    return true;
  }

  @autobind
  makeOptions(optionsData) {
    return optionsData.map(item => ({
      key: item.key,
      value: item.key,
      label: item.name,
    }));
  }

  /**
  * 构造tooltip的信息
  * @param {*} currentItemInfo 当前鼠标悬浮的点数据
  */
  constructTooltipInfo(currentItemInfo) {
    const { description, level } = this.props;
    const {
      currentSelectX,
      currentSelectY,
      xAxisName,
      xAxisUnit,
      yAxisName,
      yAxisUnit,
      yAxisMin,
      xAxisMin,
      slope,
      average,
    } = currentItemInfo;


    let compareSlope = '';
    let currentSlope;
    if (average) {
      // 对于率的指标作特殊处理
      // 比较每个点信息与平均值的比较
      compareSlope = average;
      currentSlope = currentSelectY;
    } else {
      compareSlope = slope;
      currentSlope = (currentSelectY - yAxisMin) / (currentSelectX - xAxisMin);
    }

    const currentAverageValue = (currentSelectY / currentSelectX).toFixed(2);

    // 经总和分公司下，显示每个点的平均值
    // 正常显示每个点的x信息和y信息，和每平均信息
    this.setState({
      tooltipInfo: `${yAxisName}：${currentSelectY}${yAxisUnit} / ${xAxisName}：${currentSelectX}${xAxisUnit}。${(level === '1' || level === '2') ? `平均${description}:${currentAverageValue}${yAxisUnit}/${xAxisUnit}，` : ''}每${description}的${yAxisName}${currentSlope > compareSlope ? '优' : '低'}于平均水平。`,
    });
  }

  /**
  * 处理鼠标悬浮事件
  * @param {*} params 当前点的数据
  */
  @autobind
  handleScatterHover(params) {
    const { isShowTooltip,
      finalData: {
        xAxisName,
        xAxisUnit,
        yAxisName,
        yAxisUnit,
        slope,
        yAxisMin,
        xAxisMin,
        average,
      } } = this.state;
    const { data: [xAxisData, yAxisData, { orgName, parentOrgName }] } = params;

    if (!isShowTooltip) {
      // 设置state，切换tooltip的显示信息
      this.setState({
        isShowTooltip: !isShowTooltip,
        orgName,
        parentOrgName,
      });
      this.constructTooltipInfo({
        currentSelectX: xAxisData,
        currentSelectY: yAxisData,
        xAxisName,
        xAxisUnit,
        yAxisName,
        yAxisUnit,
        slope,
        xAxisMin,
        yAxisMin,
        average,
      });
    }
  }

  @autobind
  handleChange(value) {
    this.setState({
      currentSelectedContrast: value,
      selectValue: value,
    });
    const { queryContrastAnalyze, type } = this.props;
    queryContrastAnalyze({
      type,
      contrastIndicatorId: value, // y轴
    });
  }

  /**
   * 处理鼠标离开事件
   */
  @autobind
  handleScatterLeave() {
    const { isShowTooltip } = this.state;
    if (isShowTooltip) {
      this.setState({
        isShowTooltip: !isShowTooltip,
      });
    }
  }

  render() {
    const {
      scatterElemHeight,
      isShowTooltip,
      orgName,
      parentOrgName,
      tooltipInfo,
      finalData,
      selectValue,
      finalOptions,
      averageInfo,
      scatterOptions,
    } = this.state;

    const {
      title,
      style,
      contrastType,
    } = this.props;


    if (_.isEmpty(finalData)) {
      return null;
    }

    const { xAxisName, yAxisName, xAxisUnit, yAxisUnit } = finalData;

    return (
      <div className={styles.abilityScatterAnalysis}>
        <div
          className={styles.abilityHeader}
        >
          <div className={styles.title}>{title}</div>
          <div className={styles.customerDimensionSelect}>
            <span className={styles.contrastType}>{contrastType}</span>
            <Select
              onChange={this.handleChange}
              allowClear={false}
              placeholder="无"
              value={selectValue} // 默认选中项
              dropdownClassName={styles.custDimenSelect}
            >
              {
                finalOptions.map(item =>
                  <Option value={item.value} key={item.key}>{item.label}</Option>)
              }
            </Select>
          </div>
        </div>
        <div className={styles.yAxisName} style={style}>{yAxisName}（{yAxisUnit}）</div>
        <div
          className={styles.abilityScatter}
          ref={ref => (this.abilityScatterElem = ref)}
        >
          <CommonScatter
            onScatterHover={this.handleScatterHover}
            onScatterLeave={this.handleScatterLeave}
            scatterOptions={scatterOptions}
            scatterElemHeight={scatterElemHeight}
          />
          <div className={styles.xAxisName}>{xAxisName}（{xAxisUnit}）</div>
        </div>
        {
          _.isEmpty(finalData) ?
            null
            :
            <div className={styles.averageDescription}>
              <div className={styles.averageIcon} />
              <div className={styles.averageInfo}>{averageInfo}</div>
            </div>
        }

        {isShowTooltip ?
          <div className={styles.description}>
            <div className={styles.orgDes}>
              <i className={styles.desIcon} />
              <span>{_.isEmpty(parentOrgName) ? '' : `${parentOrgName}-`}{orgName}:</span>
            </div>
            <div className={styles.detailDesc}>
              <span>{tooltipInfo}</span>
            </div>
          </div>
          : <div className={styles.noneTooltip} />
        }
      </div>
    );
  }
}
