/**
 * @fileOverview chartRealTime/chartData.js
 * @author sunweibin
 * @description 图表数据相关方法
 */

import moment from 'moment';

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
    const stackObj = {
      stack: uniqueStack,
      type: 'bar',
    };
    if (orgModel) {
      // 首先确定stackSeries的长度
      const stackLen = orgModel[0].value.length;
      console.log(stackLen);
      console.log(stackObj);
      console.log(key);
      // for (let i = 0; i < stackLen; i++) {

      // }
    }
    return stackSeries;
  },
};

export default chartData;
