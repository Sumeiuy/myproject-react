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
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    queryContrastAnalyze: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      scatterElemHeight: 360,
      finalData: {},
      isShowTooltip: false,
      orgName: '',
      parentOrgName: '',
      currentPayload: {},
    };
  }

  componentDidMount() {
    const scatterElem = this.abilityScatterElem;
    this.setHeight(scatterElem);
  }

  componentWillReceiveProps(nextProps) {
    const { data: nextData, custRange = EMPTY_LIST } = nextProps;
    const { data: prevData, queryContrastAnalyze,
      custRange: prevCustRange = EMPTY_LIST } = this.props;

    // const { currentSelectedContrast } = nextState;
    const { currentSelectedContrast } = this.state;

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

    if (custRange !== prevCustRange) {
      // 当前指标变化
      // x轴变化
      // 请求数据
      queryContrastAnalyze({
        boardId: '3',
        type: 'invest',
        orgId: 'ZZ001041',
        localScope: '1',
        scope: '2',
        begin: '20170601',
        end: '20170630',
        cycleType: 'month',
        coreIndicatorId: '', // x轴
        contrastIndicatorId: currentSelectedContrast, // y轴
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

    // this.setState({
    //   currentPayload: {
    //     type: 'highlight',
    //     // 可选，系列 index，可以是一个数组指定多个系列
    //     seriesIndex,
    //     // 可选，系列名称，可以是一个数组指定多个系列
    //     seriesName,
    //     // 可选，数据的 index
    //     dataIndex,
    //     // 可选，数据的 名称
    //     name,
    //   },
    // });

    // console.log({
    //   type: 'highlight',
    //   // 可选，系列 index，可以是一个数组指定多个系列
    //   seriesIndex,
    //   // 可选，系列名称，可以是一个数组指定多个系列
    //   seriesName,
    //   // 可选，数据的 index
    //   dataIndex,
    //   // 可选，数据的 名称
    //   name,
    // });
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
    } = currentItemInfo;
    let newXData = '';
    let newYData = '';
    if (xAxisUnit.indexOf('万') !== -1) {
      // 万户
      newXData = helper.formatNum((currentSelectX * 10000).toFixed(0));
    } else {
      // 户
      newXData = currentSelectX;
    }

    if (yAxisUnit.indexOf('亿') !== -1) {
      // 亿元
      newYData = helper.formatNum((currentSelectY * 100000000).toFixed(0));
    } else if (yAxisUnit.indexOf('万') !== -1) {
      // 万元
      newYData = helper.formatNum((currentSelectY * 10000).toFixed(0));
    } else {
      newYData = currentSelectY;
    }

    const currentSlope = (currentSelectY - yAxisMin) / currentSelectX;

    this.setState({
      tooltipInfo: `${yAxisName}：${newYData}元 / ${xAxisName}：${newXData}户。每客户贡献的交易量${currentSlope > slope ? '优' : '低'}于平均水平。`,
    });
  }

  getAnyPoint(seriesData) {
    const { xAxisMin, yAxisMin, yAxisMax, xAxisMax } = seriesData;

    return {
      startCoord: [xAxisMin, yAxisMin],
      endCoord: [xAxisMax, yAxisMax],
    };
  }

  @autobind
  handleChange(value) {
    console.log(`selected ${value}`);
    const { queryContrastAnalyze } = this.props;
    queryContrastAnalyze({
      boardId: '3',
      type: 'invest',
      orgId: 'ZZ001041',
      localScope: '1',
      scope: '2',
      begin: '20170601',
      end: '20170630',
      cycleType: 'month',
      coreIndicatorId: '', // x轴
      contrastIndicatorId: value, // y轴
    });
    this.setState({
      currentSelectedContrast: value,
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
      // currentPayload,
    } = this.state;

    if (_.isEmpty(finalData)) {
      return null;
    }

    const optionData = [
      { value: '总客户', label: '总客户' },
      { value: '一般客户', label: '一般客户' },
      { value: '机构客户', label: '机构客户' },
    ];

    const { xAxisName, yAxisName, xAxisUnit, yAxisUnit } = finalData;

    const point = this.getAnyPoint(finalData);

    const scatterOptions = constructScatterOptions({
      ...finalData,
      ...point,
    });

    return (
      <div className={styles.abilityScatterAnalysis}>
        <div className={styles.abilityHeader}>
          <div className={styles.title}>客户贡献分析</div>
          <div className={styles.compare}>对比</div>
          <div className={styles.customerDimensionSelect}>
            <Select
              defaultValue="总客户"
              onChange={this.handleChange}
              allowClear={false}
              placeholder="无"
              dropdownClassName={styles.custDimenSelect}
            >
              {
                optionData.map(item =>
                  <Option value={item.value} key={item.value}>{item.label}</Option>)
              }
            </Select>
          </div>
        </div>
        <div className={styles.yAxisName}>{yAxisName}（{yAxisUnit}）</div>
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
          : null
        }
      </div>
    );
  }
}
