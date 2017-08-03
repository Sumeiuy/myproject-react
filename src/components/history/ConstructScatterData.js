/**
 * by xuxiaoqin
 * ConstructScatterData.js
 */
import _ from 'lodash';
import FixNumber from '../chartRealTime/FixNumber';

export default {};

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export const constructScatterData = (options = {}) => {
  const { core = EMPTY_OBJECT, contrast = EMPTY_OBJECT,
    scatterDiagramModels = EMPTY_LIST } = options;

  const xAxisOption = _.pick(contrast, ['key', 'name', 'value', 'unit']);

  const yAxisOption = _.pick(core, ['key', 'name', 'value', 'unit']);

  let finalData = [];
  const xAxisDataArray = [];
  const yAxisDataArray = [];
  const orgItemArray = [];

  const constructHelper = {
    // 计算y轴的刻度范围
    getYAxisTickMinAndMax(array) {
      if (_.isEmpty(array)) {
        return {
          min: 0,
          max: 1,
        };
      }

      const { max, min } = FixNumber.getMaxAndMinMoney(array);
      let newMax = 0;
      // 对于金额y轴，需要给最大刻度多加一个刻度，
      // 不然最大值z在散点图上显示不全
      if (max % 1000 === 0) {
        newMax = max + 1000;
      } else if (max % 100 === 0) {
        newMax = max + 100;
      } else if (max % 10 === 0) {
        newMax = max + 10;
      } else {
        newMax = max + 1;
      }

      return {
        max: newMax,
        min,
      };
    },
    // 计算x轴的刻度范围
    getXAxisTickMinAndMax(array) {
      if (_.isEmpty(array)) {
        return {
          min: 0,
          max: 1,
        };
      }

      return FixNumber.getMaxAndMinCust(array);
    },
    // 获取y轴的单位和格式化后的数据源
    getYAxisUnit(array) {
      return FixNumber.toFixedMoney(array);
    },
    // 获取x轴的单位和格式化后的数据源
    getXAxisUnit(array) {
      return FixNumber.toFixedCust(array);
    },
    // 计算当前散点图的斜率
    getSlope(xyAxisData) {
      const {
        xAxisMin,
        yAxisMin,
        xAxisMax,
        yAxisMax,
      } = xyAxisData;
      return (yAxisMax - yAxisMin) / (xAxisMax - xAxisMin);
    },
  };

  // 遍历scatter模型，取出x轴数据，y轴数据，和每一个组织的信息
  _.each(scatterDiagramModels, ((item) => {
    const xPointerData = _.pick(item.contrastIndicator, ['name', 'value']);
    const yPointerData = _.pick(item.coreIndicator, ['name', 'value']);
    const orgItem = _.pick(item.orgItemDto, ['id', 'name', 'pid', 'pname']);
    if (!_.isEmpty(xPointerData.value)
      && !_.isEmpty(yPointerData.value)
      && xPointerData.value !== '0'
      && yPointerData.value !== '0') {
      xAxisDataArray.push(parseFloat(xPointerData.value));
      yAxisDataArray.push(parseFloat(yPointerData.value));
      orgItemArray.push(orgItem);
    }
  }));

  // 拿到x轴与y轴的单位与转换后的元数据
  const xAxisUnit = constructHelper.getXAxisUnit(xAxisDataArray);
  const yAxisUnit = constructHelper.getYAxisUnit(yAxisDataArray);

  // 拿到x轴与y轴转换后的具体刻度最大值与最小值
  const xAxisTickArea = constructHelper.getXAxisTickMinAndMax(xAxisUnit.newSeries);
  const yAxisTickArea = constructHelper.getYAxisTickMinAndMax(yAxisUnit.newSeries);

  // 斜率
  const slope = constructHelper.getSlope({
    xAxisMin: xAxisTickArea.min,
    yAxisMin: yAxisTickArea.min,
    xAxisMax: xAxisTickArea.max,
    yAxisMax: yAxisTickArea.max,
  });

  // 构造元数据给series，用来绘制scatter
  const ySeriesData = yAxisUnit.newSeries;
  finalData = xAxisUnit.newSeries.map((item, index) => [
    item,
    ySeriesData[index],
    {
      orgId: orgItemArray[index].id,
      orgName: orgItemArray[index].name,
      parentOrgId: orgItemArray[index].pid,
      parentOrgName: orgItemArray[index].pname,
    },
  ]);

  const aixsData = {
    pointerData: finalData,
    xAxisMin: xAxisTickArea.min,
    xAxisMax: xAxisTickArea.max,
    yAxisMin: yAxisTickArea.min,
    yAxisMax: yAxisTickArea.max,
    xAxisName: xAxisOption.name,
    yAxisName: yAxisOption.name,
    xAxisUnit: xAxisUnit.newUnit,
    yAxisUnit: yAxisUnit.newUnit,
    slope,
  };

  return aixsData;
};
