/**
 * @fileOverview chartRealTime/FixNumber.js
 * @author sunweibin
 * @description 为图表chart提供单位数字的处理函数集
 */

function padFixedMoney(m, method) {
  const money = Math.abs(m);
  let value = 0;
  if (money >= 10000) {
    value = Math[method](m / 1000) * 1000;
  } else if (money >= 1000) {
    value = Math[method](m / 1000) * 1000;
  } else if (money >= 100) {
    value = Math[method](m / 100) * 100;
  } else if (money >= 10) {
    value = Math[method](m / 10) * 10;
  } else {
    value = Math[method](m);
  }
  return value;
}

function padFixedCust(m, method) {
  const cust = Math.abs(m);
  let value = 0;
  if (cust >= 10000) {
    value = Math[method](m / 1000) * 1000;
  } else if (cust >= 100) {
    value = Math[method](m / 100) * 100;
  } else if (cust < 100) {
    value = Math[method](m / 10) * 10;
  }
  return value;
}

const FixNumber = {
  // 对小数点进行处理
  toFixedDecimal(value) {
    if (value > 10000) {
      return Number.parseFloat(value.toFixed(0));
    }
    if (value > 1000) {
      return Number.parseFloat(value.toFixed(1));
    }
    return Number.parseFloat(value.toFixed(2));
  },

  // 针对金额进行特殊处理
  toFixedMoney(series) {
    let newUnit = '元';
    const tempSeries = series.map(n => Math.abs(n));
    let newSeries = series;
    const MaxMoney = Math.max(...tempSeries);
    // 1. 全部在万元以下的数据不做处理
    // 2.超过万元的，以‘万元’为单位
    // 3.超过亿元的，以‘亿元’为单位
    if (MaxMoney >= 100000000) {
      newUnit = '亿元';
      newSeries = series.map(item => FixNumber.toFixedDecimal(item / 100000000));
    } else if (MaxMoney > 10000) {
      newUnit = '万元';
      newSeries = series.map(item => FixNumber.toFixedDecimal(item / 10000));
    }

    return {
      newUnit,
      newSeries,
    };
  },

  // 针对百分比的数字来确认图表坐标轴的最大和最小值
  getMaxAndMinPercent(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    max = Math.ceil((max / 10)) * 10;
    min = Math.floor((min / 10)) * 10;
    if (max === 0) {
      max = 100;
    }
    if (min === 100) {
      min = 0;
    }
    return {
      max,
      min,
    };
  },

  // 针对千分比确认图表最大和最小值
  getMaxAndMinPermillage(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    max = Math.ceil(max);
    min = Math.floor(min);
    if (max === 0) {
      max = 1;
    }
    return {
      max,
      min,
    };
  },

  // 针对金额确认图表最大和最小值
  getMaxAndMinMoney(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    max = padFixedMoney(max, 'ceil');
    min = padFixedMoney(min, 'floor');
    if (max === 0 && min === 0) {
      max = 1;
    }
    return { max, min };
  },

  // 针对户获取图表最大和最小值
  getMaxAndMinCust(series) {
    let max = Math.max(...series);
    let min = Math.min(...series);
    max = padFixedCust(max, 'ceil');
    min = padFixedCust(min, 'floor');
    if (max === 0 && min === 0) {
      max = 10;
    }
    // if (max >= 10000) {
    //   max = Math.ceil(max / 1000) * 1000;
    // } else if (max >= 100) {
    //   max = Math.ceil(max / 100) * 100;
    // } else if (max < 100) {
    //   max = Math.ceil(max / 10) * 10;
    // }
    // if (max === 0) {
    //   max = 10;
    // }
    // if (min >= 10000) {
    //   min = Math.floor(min / 1000) * 1000;
    // } else if (min >= 100) {
    //   min = Math.floor(min / 100) * 100;
    // } else if (min < 100) {
    //   min = Math.floor(min / 10) * 10;
    // }
    // if (min <= 0 || min >= max) {
    //   min = 0;
    // }
    return { max, min };
  },
};

export default FixNumber;
