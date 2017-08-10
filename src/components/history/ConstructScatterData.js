/**
 * by xuxiaoqin
 * ConstructScatterData.js
 */
import _ from 'lodash';
import FixNumber from '../chartRealTime/FixNumber';
import { ZHUNICODE } from '../../config';

export default {};

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const PERCENT = ZHUNICODE.PERCENT;
const PERMILLAGE = ZHUNICODE.PERMILLAGE;
const REN = ZHUNICODE.REN;
const HU = ZHUNICODE.HU;
const CI = ZHUNICODE.CI;
const YUAN = ZHUNICODE.YUAN;
const GE = ZHUNICODE.GE;

export const constructScatterData = (options = {}) => {
  const { core = EMPTY_OBJECT, contrast = EMPTY_OBJECT,
    scatterDiagramModels = EMPTY_LIST, description } = options;

  const xAxisOption = _.pick(contrast, ['key', 'name', 'value', 'unit']);

  const yAxisOption = _.pick(core, ['key', 'name', 'value', 'unit']);

  let finalData = [];
  const xAxisDataArray = [];
  const yAxisDataArray = [];
  const orgItemArray = [];
  let axisData;

  const constructHelper = {
    // 计算y轴的刻度范围
    getYAxisTickMinAndMax(array, curUnit) {
      if (_.isEmpty(array)) {
        return {
          min: 0,
          max: 1,
        };
      }

      let minAndMax;
      if (curUnit === HU || curUnit === REN) {
        minAndMax = FixNumber.getMaxAndMinCust(array);
      } else if (curUnit === CI) {
        minAndMax = FixNumber.getMaxAndMinCi(array);
      } else if (curUnit === GE) {
        minAndMax = FixNumber.getMaxAndMinGE(array);
      } else if (curUnit === YUAN) {
        minAndMax = FixNumber.getMaxAndMinMoney(array);
      } else if (curUnit === PERCENT) {
        minAndMax = FixNumber.getMaxAndMinPercent(array);
      } else if (curUnit === PERMILLAGE) {
        minAndMax = FixNumber.getMaxAndMinPermillage(array);
      }

      const { max, min } = minAndMax;
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
    // 针对百分比数据进行处理
    toFixedPercent(series) {
      return series.map(o => FixNumber.toFixedDecimal(o * 100));
    },
    // 针对千分比数据进行处理
    toFixedPermillage(series) {
      return series.map(o => FixNumber.toFixedDecimal(o * 1000));
    },
    // 获取y轴的单位和格式化后的数据源
    getYAxisUnit(array, unit) {
      if (unit === YUAN) {
        return FixNumber.toFixedMoney(array);
      } else if (unit === CI) {
        return FixNumber.toFixedCI(array);
      } else if (unit === GE) {
        return FixNumber.toFixedGE(array);
      } else if (unit === HU || unit === REN) {
        return FixNumber.toFixedCust(array);
      } else if (unit === PERCENT) {
        return {
          newSeries: constructHelper.toFixedPercent(array),
          newUnit: unit,
        };
      } else if (unit === PERMILLAGE) {
        return {
          newSeries: constructHelper.toFixedPermillage(array),
          newUnit: unit,
        };
      }
      return {
        newSeries: [],
        newUnit: '',
      };
    },
    // 获取x轴的单位和格式化后的数据源
    getXAxisUnit(array) {
      return FixNumber.toFixedCust(array);
    },
    formatDataSource(yAxisOriginUnit, yAxisTotalValue) {
      let yAxisFormatedValue;
      if (yAxisOriginUnit === HU || yAxisOriginUnit === REN) {
        yAxisFormatedValue = FixNumber.toFixedCust([Number(yAxisTotalValue)]).newSeries[0];
      } else if (yAxisOriginUnit === YUAN) {
        yAxisFormatedValue = FixNumber.toFixedMoney([Number(yAxisTotalValue)]).newSeries[0];
      } else if (yAxisOriginUnit === GE) {
        yAxisFormatedValue = FixNumber.toFixedGE([Number(yAxisTotalValue)]).newSeries[0];
      } else if (yAxisOriginUnit === PERCENT) {
        yAxisFormatedValue = FixNumber.toFixedDecimal(Number(yAxisTotalValue) * 100);
      } else if (yAxisOriginUnit === PERMILLAGE) {
        yAxisFormatedValue = FixNumber.toFixedDecimal(Number(yAxisTotalValue) * 1000);
      } else if (yAxisOriginUnit === CI) {
        yAxisFormatedValue = FixNumber.toFixedCI([Number(yAxisTotalValue)]).newSeries[0];
      }

      return yAxisFormatedValue;
    },
    // 计算当前散点图的斜率
    getSlope(unitInfo) {
      const { xAxisUnit, yAxisUnit } = unitInfo;
      const { value: xAxisTotalValue } = xAxisOption;
      const { value: yAxisTotalValue, unit: yAxisOriginUnit } = yAxisOption;
      let xAxisFormatedValue;
      let average = 0;
      if (xAxisUnit.indexOf('万') !== -1) {
        xAxisFormatedValue = FixNumber.toFixedCust([Number(xAxisTotalValue)]).newSeries[0];
      } else {
        xAxisFormatedValue = Number(xAxisTotalValue);
      }
      const yAxisFormatedValue = constructHelper.formatDataSource(yAxisOriginUnit, yAxisTotalValue);

      if (xAxisFormatedValue !== 0) {
        // 保证x不为0，不然得到NaN
        average = yAxisFormatedValue / xAxisFormatedValue;
        return {
          slope: average,
          averageInfo: `平均每${description}${average.toFixed(2)}${yAxisUnit}/${xAxisUnit}`,
        };
      }
      return {
        slope: average,
        averageInfo: `平均每${description}0${yAxisUnit}/${xAxisUnit}`,
      };
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

  // 原始y轴、x轴单位
  // 后台给的unit有可能是null，所以加上一个默认值
  const { unit: currentYUnit = '元' } = scatterDiagramModels[0].coreIndicator || EMPTY_OBJECT;
  const { unit: currentXUnit = '户' } = scatterDiagramModels[0].contrastIndicator || EMPTY_OBJECT;

  if (_.isEmpty(xAxisDataArray) && _.isEmpty(yAxisDataArray)) {
    // x、y轴数据都是0，则展示空数据折线图
    axisData = {
      pointerData: [],
      xAxisMin: 0,
      xAxisMax: 1,
      yAxisMin: 0,
      yAxisMax: 1,
      xAxisName: xAxisOption.name,
      yAxisName: yAxisOption.name,
      xAxisUnit: currentXUnit,
      yAxisUnit: currentYUnit,
      slope: 0,
      averageInfo: `平均每${description}0${currentYUnit}/${currentXUnit}`,
    };
    return axisData;
  }

  // 拿到x轴与y轴的单位与转换后的元数据
  const xAxisUnit = constructHelper.getXAxisUnit(xAxisDataArray);
  const yAxisUnit = constructHelper.getYAxisUnit(yAxisDataArray, currentYUnit);

  // 拿到x轴与y轴转换后的具体刻度最大值与最小值
  const xAxisTickArea = constructHelper.getXAxisTickMinAndMax(xAxisUnit.newSeries);
  const yAxisTickArea = constructHelper.getYAxisTickMinAndMax(yAxisUnit.newSeries, currentYUnit);

  // 斜率
  const slope = constructHelper.getSlope({
    xAxisMin: xAxisTickArea.min,
    yAxisMin: yAxisTickArea.min,
    xAxisMax: xAxisTickArea.max,
    yAxisMax: yAxisTickArea.max,
    xAxisUnit: xAxisUnit.newUnit,
    yAxisUnit: yAxisUnit.newUnit,
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

  axisData = {
    pointerData: finalData,
    xAxisMin: xAxisTickArea.min,
    xAxisMax: xAxisTickArea.max,
    yAxisMin: yAxisTickArea.min,
    yAxisMax: yAxisTickArea.max,
    xAxisName: xAxisOption.name,
    yAxisName: yAxisOption.name,
    xAxisUnit: xAxisUnit.newUnit,
    yAxisUnit: yAxisUnit.newUnit,
    slope: slope.slope,
    averageInfo: slope.averageInfo || '',
  };

  return axisData;
};
