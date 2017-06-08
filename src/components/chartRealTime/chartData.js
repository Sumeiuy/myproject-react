/**
 * @fileOverview chartRealTime/chartData.js
 * @author sunweibin
 * @description 图表数据相关方法
 */

import moment from 'moment';
import _ from 'lodash';


function toFixedDecimal(value) {
  if (value > 10000) {
    return Number.parseFloat(value.toFixed(0));
  }
  if (value > 1000) {
    return Number.parseFloat(value.toFixed(1));
  }
  return Number.parseFloat(value.toFixed(2));
}

function toFixedMoney(v) {
  return (item) => {
    const newItem = item;
    const data = item.data;
    newItem.data = data.map(n => toFixedDecimal(n / v));
    return newItem;
  };
}

const chartData = {
  // 取出orgModel中分公司、营业部、的名称数组
  // 用于Y轴刻度值，或者tooltip提示信息
  getLevelName(orgModel, key) {
    const yAxisLabels = [];
    if (orgModel) {
      orgModel.forEach((item) => {
        if (item[key] === null || item[key] === 'null') {
          yAxisLabels.push('--');
        } else {
          yAxisLabels.push(item[key]);
        }
      });
    }
    return yAxisLabels;
  },

  // 获取series的值
  getNormalSeries(orgModel, key) {
    const series = [];
    if (orgModel) {
      orgModel.forEach((item) => {
        if (item[key] === null || item[key] === 'null') {
          series.push(0);
        } else {
          series.push(item[key]);
        }
      });
    }
    return series;
  },

  /**
   * 获取stackSeries
   * @param  {[Array]} orgModel 元数据
   * @param  {[String]} key      数据键
   * @return {[Array]}          [{},{},{}...]
   */
  getStackSeries(orgModel, key, stack) {
    const stackSeries = [];
    // 设置一个uniqueStack值
    const now = moment().format('x');
    const uniqueStack = `${stack}-${now}`;
    if (orgModel) {
      // 首先确定stackSeries的长度
      const stackLen = orgModel[0].children.length;
      // 取出stackSeries数组
      for (let i = 0; i < stackLen; i++) {
        const stackObj = {
          label: {
            normal: {
              show: false,
            },
          },
          stack: uniqueStack,
          type: 'bar',
          name: orgModel[0].children[i].name,
        };
        const data = [];
        orgModel.forEach((item) => {
          let stackValue = item.children[i].value;
          if (stackValue === '' || stackValue === 'null' || stackValue === null || stackValue === undefined) {
            stackValue = 0;
          }
          data.push(Number(stackValue));
        });
        // 补足数据
        const padLength = 10 - data.length;
        for (let j = 0; j < padLength; j++) {
          data.push(0);
        }
        _.assign(stackObj, { data });
        stackSeries.push(stackObj);
      }
    }
    return stackSeries;
  },

  /**
   * 处理stackSeries中的金额数据以及单位
   */
  dealStackSeriesMoney(stackSeries) {
    let newUnit = '元';
    let newStackSeries = stackSeries;
    // 判断stackSeries中最大值是多少
    let allData = [];
    const len = newStackSeries.length;
    for (let i = 0; i < len; i++) {
      allData = _.concat(allData, newStackSeries[i].data);
    }
    const maxMoney = Math.max(...allData);
     // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (maxMoney > 100000000) {
      newUnit = '亿元';
      // newStackSeries = newStackSeries.map(item => this.toFixedDecimal(item / 100000000));
      newStackSeries = newStackSeries.map(toFixedMoney(100000000));
    } else if (maxMoney > 10000) {
      newUnit = '万元';
      newStackSeries = newStackSeries.map(toFixedMoney(10000));
    }
    return {
      newStackSeries,
      newUnit,
    };
  },
  /**
   * 处理StackData数据
   * @return {[type]} [description]
   */
  dealStackData(stackSeries) {
    const newStackSeries = stackSeries;
    // 判断stackSeries中最大值是多少
    const allData = [];
    const len = newStackSeries.length;
    const dataLen = newStackSeries[0].data.length;
    for (let i = 0; i < dataLen; i++) {
      const stackSingleValue = {
        plus: [],
        minus: [],
      };
      for (let j = 0; j < len; j++) {
        const v = newStackSeries[j].data[i];
        if (v >= 0) {
          stackSingleValue.plus.push(v);
        } else {
          stackSingleValue.minus.push(v);
        }
      }
      allData.push(stackSingleValue);
    }
    // 计算出每条柱状图的负值合并以及正值合并
    const minusAndPlusLen = allData.length;
    const minusMerge = [];
    const plusMerge = [];
    for (let j = 0; j < minusAndPlusLen; j++) {
      minusMerge.push(_.sum(allData[j].minus));
      plusMerge.push(_.sum(allData[j].plus));
    }
    const max = Math.max(...plusMerge);
    const min = Math.min(...minusMerge);
    return {
      max,
      min,
    };
  },
};

export default chartData;
