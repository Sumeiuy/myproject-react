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
  };

  static defaultProps = {
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
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: nextData, swtichDefault: newSwitch } = nextProps;
    const { data: prevData, swtichDefault: oldSwitch, description } = this.props;
    const {
      core = EMPTY_OBJECT,
      contrast = EMPTY_OBJECT,
      scatterDiagramModels = EMPTY_LIST,
    } = nextData;

    const {
      core: prevCore = EMPTY_OBJECT,
      contrast: prevContrast = EMPTY_OBJECT,
      scatterDiagramModels: prevScatterDiagramModels = EMPTY_LIST,
    } = prevData;

    // 比较前后两次值是否相同
    if (!_.isEqual(core, prevCore) || !_.isEqual(contrast, prevContrast)
      || !_.isEqual(scatterDiagramModels, prevScatterDiagramModels)) {
      if (!_.isEmpty(scatterDiagramModels)) {
        const finalData = constructScatterData({
          core,
          contrast,
          scatterDiagramModels,
          description,
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
    }
    // 恢复默认选项
    if (oldSwitch !== newSwitch) {
      const options = this.state.finalOptions;
      this.setState({
        selectValue: options[0].value,
      });
    }
  }

  /**
   * 根据斜率，计算出一个点，用来画直线，点必须靠近最大值，不然线不能延长
   * @param {*} seriesData series数据
   */
  getAnyPoint(seriesData) {
    const { xAxisMin, yAxisMin, yAxisMax, slope, xAxisMax, currentMax } = seriesData;
    let compare;
    let current;

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
      if (current / 1000 > 1 && current !== 0) {
        this.getAnyPoint({
          ...seriesData,
          currentMax: current - 500,
        });
        return false;
      } else if (current / 100 > 1 && current !== 0) {
        this.getAnyPoint({
          ...seriesData,
          currentMax: current - 50,
        });
        return false;
      } else if (current / 10 > 1 && current !== 0) {
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
    if (xAxisMax > yAxisMax) {
      endCoord = [current, point];
    } else {
      endCoord = [point, current];
    }

    const scatterOptions = constructScatterOptions({
      ...seriesData,
      startCoord: [xAxisMin, yAxisMin],
      endCoord,
    });

    this.setState({
      scatterOptions,
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
    const { description } = this.props;
    const {
      currentSelectX,
      currentSelectY,
      xAxisName,
      xAxisUnit,
      yAxisName,
      yAxisUnit,
      yAxisMin,
      slope,
    } = currentItemInfo;

    const currentSlope = (currentSelectY - yAxisMin) / currentSelectX;

    this.setState({
      tooltipInfo: `${yAxisName}：${currentSelectY}${yAxisUnit} / ${xAxisName}：${currentSelectX}${xAxisUnit}。每${description}的交易量${currentSlope > slope ? '优' : '低'}于平均水平。`,
    });
  }

  /**
  * 处理鼠标悬浮事件
  * @param {*} params 当前点的数据
  */
  @autobind
  handleScatterHover(params) {
    const { isShowTooltip,
      finalData: { xAxisName, xAxisUnit, yAxisName, yAxisUnit, slope, yAxisMin } } = this.state;
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
        yAxisMin,
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
      finalData: { pointerData = EMPTY_LIST },
      selectValue,
      finalOptions,
      averageInfo,
      scatterOptions,
    } = this.state;

    const {
      title,
      style,
    } = this.props;

    if (_.isEmpty(pointerData)) {
      return null;
    }

    const { xAxisName, yAxisName, xAxisUnit, yAxisUnit } = finalData;

    return (
      <div className={styles.abilityScatterAnalysis}>
        <div className={styles.abilityHeader}>
          <div className={styles.title}>{title}</div>
          <div className={styles.compare}>对比</div>
          <div className={styles.customerDimensionSelect}>
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
          _.isEmpty(pointerData) ?
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
              <span>{orgName}{_.isEmpty(parentOrgName) ? '' : `-${parentOrgName}`}:</span>
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
