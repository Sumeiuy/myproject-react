/**
 * by xuxiaoqin
 * AbilityScatterAnalysis.js
 */
import React, { PropTypes, PureComponent } from 'react';
// import { connect } from 'react-redux';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import CommonScatter from '../chartRealTime/CommonScatter';
import { constructScatterData } from './ConstructScatterData';
import { constructScatterOptions } from './ConstructScatterOptions';
import helper from '../../utils/helper';
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
      currentPayload: {},
      finalOptions: options,
      selectValue: options[0].value,
      originYUnit: '',
      originXUnit: '',
    };
  }

  componentDidMount() {
    const scatterElem = this.abilityScatterElem;
    this.setHeight(scatterElem);
  }

  componentWillReceiveProps(nextProps) {
    const { data: nextData } = nextProps;
    const { data: prevData } = this.props;
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
    if (core !== prevCore || contrast !== prevContrast
      || scatterDiagramModels !== prevScatterDiagramModels) {
      const finalData = constructScatterData({ core, contrast, scatterDiagramModels });
      this.setState({
        finalData,
      });
    }
    // 恢复默认选项
    const { swtichDefault: oldSwitch } = this.props;
    const { swtichDefault: newSwitch } = nextProps;
    if (oldSwitch !== newSwitch) {
      const options = this.state.finalOptions;
      this.setState({
        selectValue: options[0].value,
      });
    }
  }

  componentDidUpdate() {
    const scatterElem = this.abilityScatterElem;
    this.setHeight(scatterElem);
  }

  @autobind
  setHeight(scatterElem) {
    if (scatterElem) {
      this.setState({
        scatterElemHeight: scatterElem.clientHeight,
      });
    }
  }

  getAnyPoint(seriesData) {
    const { xAxisMin, yAxisMin, yAxisMax, xAxisMax } = seriesData;
    return {
      startCoord: [xAxisMin, yAxisMin],
      endCoord: [xAxisMax, yAxisMax],
    };
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
    const {
      currentSelectX,
      currentSelectY,
      xAxisName,
      xAxisUnit,
      yAxisName,
      yAxisUnit,
      yAxisMin,
      slope,
      originYUnit,
      originXUnit,
    } = currentItemInfo;
    let newXData = currentSelectX;
    let newYData = currentSelectY;
    if (xAxisUnit.indexOf('万') !== -1) {
      newXData = helper.formatNum((currentSelectX * 10000).toFixed(0));
    } else {
      newXData = currentSelectX;
    }

    if (yAxisUnit.indexOf('亿') !== -1) {
      newYData = helper.formatNum((currentSelectY * 100000000).toFixed(0));
    } else if (yAxisUnit.indexOf('万') !== -1) {
      newYData = helper.formatNum((currentSelectY * 10000).toFixed(0));
    } else {
      newYData = currentSelectY;
    }

    const currentSlope = (currentSelectY - yAxisMin) / currentSelectX;

    this.setState({
      tooltipInfo: `${yAxisName}：${newYData}${originYUnit} / ${xAxisName}：${newXData}${originXUnit === '人' ? '户' : originXUnit}。每服务经理的交易量${currentSlope > slope ? '优' : '低'}于平均水平。`,
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
    const { data: [xAxisData, yAxisData, { orgName, parentOrgName,
      originYUnit, originXUnit }] } = params;

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
        originYUnit,
        originXUnit,
      });
    }
  }

  @autobind
  handleChange(value) {
    this.setState({
      currentSelectedContrast: value,
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
    } = this.state;

    const {
      title,
      style,
    } = this.props;

    if (_.isEmpty(finalData)) {
      return null;
    }

    const { xAxisName, yAxisName, xAxisUnit, yAxisUnit } = finalData;

    const point = this.getAnyPoint(finalData);

    const scatterOptions = constructScatterOptions({
      ...finalData,
      ...point,
    });

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
