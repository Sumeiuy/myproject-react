/**
 * by xuxiaoqin
 * ConstructScatterData.js
 */
import _ from 'lodash';
import FixNumber from '../chartRealTime/FixNumber';

export default {};

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export const constructScatterData = (options) => {
  const { core = EMPTY_OBJECT, contrast = EMPTY_OBJECT,
    scatterDiagramModels = EMPTY_LIST } = options;
  // const core = {
  //   "key": "totAset",
  //   "name": "托管总资产",
  //   "value": "224428448617.8616",
  //   "unit": "元",
  //   "description": null,
  //   "categoryKey": null,
  //   "isBelongsSummury": null,
  //   "hasChildren": null,
  //   "parentKey": null,
  //   "parentName": null,
  //   "children": null
  // };

  const xAxisOption = _.pick(contrast, ['key', 'name', 'value', 'unit']);

  // const contrast = {
  //   "key": "custNum",
  //   "name": "服务客户数",
  //   "value": "342913",
  //   "unit": "户",
  //   "description": null,
  //   "categoryKey": null,
  //   "isBelongsSummury": null,
  //   "hasChildren": null,
  //   "parentKey": null,
  //   "parentName": null,
  //   "children": null
  // };

  const yAxisOption = _.pick(core, ['key', 'name', 'value', 'unit']);

  // const scatterDiagramModels = [
  //   {
  //     "coreIndicator": {
  //       "key": "totAset",
  //       "name": "托管总资产",
  //       "value": "20002769068.3283",
  //       "unit": "元",
  //       "description": null,
  //       "categoryKey": null,
  //       "isBelongsSummury": null,
  //       "hasChildren": null,
  //       "parentKey": null,
  //       "parentName": null,
  //       "children": null
  //     },
  //     "contrastIndicator": {
  //       "key": "custNum",
  //       "name": "服务客户数",
  //       "value": "21394",
  //       "unit": "户",
  //       "description": null,
  //       "categoryKey": null,
  //       "isBelongsSummury": null,
  //       "hasChildren": null,
  //       "parentKey": null,
  //       "parentName": null,
  //       "children": null
  //     },
  //     "orgItemDto": {
  //       "id": "ZZ001041106",
  //       "name": "南通分公司",
  //       "level": "2",
  //       "pid": null,
  //       "pname": null,
  //       "children": null
  //     },
  //   }
  // ];

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
      // let newXAxisRate;
      // let newYAxisRate;
      // if (_.isNumber(xAxisTotal) && _.isNumber(yAxisTotal)) {
      //   if (yAxisTotal >= 100000000) {
      //     newYAxisRate = yAxisTotal / 100000000;
      //   } else if (yAxisTotal > 10000) {
      //     newYAxisRate = yAxisTotal / 10000;
      //   } else {
      //     newYAxisRate = yAxisTotal;
      //   }

      //   if (xAxisTotal >= 5000) {
      //     newXAxisRate = xAxisTotal / 10000;
      //   } else {
      //     newXAxisRate = xAxisTotal;
      //   }
      //   return newYAxisRate / newXAxisRate;
      // }
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
      xAxisDataArray.push(xPointerData.value);
      yAxisDataArray.push(yPointerData.value);
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
    // {
    //   xAxisName: xAxisOption.name,
    //   xAxisUnit: xAxisUnit.newUnit,
    //   yAxisName: yAxisOption.name,
    //   yAxisUnit: yAxisUnit.newUnit,
    //   slope,
    // },
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
