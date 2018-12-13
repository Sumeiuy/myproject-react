/**
 * @file newHome/utils.js
 *  目标客户池-投顾绩效
 * @author zhufeiyang
 */

// 新版首页客户分析图表所需要的数据
import _ from 'lodash';
import { transformItemUnit } from '../chartRealTime/FixNumber';
import { number } from '../../helper';

const NAME_TGZC = '托管资产';
// 计算除数并转换成百分比显示
function calcPercent(x = 0, y = 0) {
  let result = 0;
  if (Number(y) === 0) {
    return result;
  }
  result = ((x / y) * 100).toFixed(0);
  return `${result}%`;
}
// 客户类型
function getCustClassChartData(data) {
  const showText = data.showText || '';
  const dataSource = [
    {
      name: '零售',
      filterValue: 'Y',
      filterId: 'custClass',
      filterName: '客户类型',
      style: {
        background: '#1ac4f8',
      },
    },
    {
      name: '高净值',
      filterValue: 'N',
      filterId: 'custClass',
      filterName: '客户类型',
      style: {
        background: '#008fd2',
      }
    }
  ];

  if (data.custClassRetail) {
    dataSource[0].custNum = data.custClassRetail.custNum || 0;
    dataSource[0].asset = data.custClassRetail.asset || 0;
  } else {
    dataSource[0].custNum = 0;
    dataSource[0].asset = 0;
  }

  if (data.custClassHighValue) {
    dataSource[1].custNum = data.custClassHighValue.custNum || 0;
    dataSource[1].asset = data.custClassHighValue.asset || 0;
  } else {
    dataSource[1].custNum = 0;
    dataSource[1].asset = 0;
  }

  if (dataSource[0].custNum + dataSource[1].custNum === 0) {
    dataSource[0].custNumRate = 50;
    dataSource[1].custNumRate = 50;
  } else {
    dataSource[0].custNumRate = Math.floor(
      (dataSource[0].custNum / (dataSource[0].custNum + dataSource[1].custNum)) * 100
    );
    dataSource[1].custNumRate = 100 - dataSource[0].custNumRate;
  }
  if (dataSource[0].asset + dataSource[1].asset === 0) {
    dataSource[0].assetRate = 50;
    dataSource[1].assetRate = 50;
  } else {
    dataSource[0].assetRate = Math.floor(
      (dataSource[0].asset / (dataSource[0].asset + dataSource[1].asset)) * 100
    );
    dataSource[1].assetRate = 100 - dataSource[0].assetRate;
  }
  const option = {
    grid: {
      top: '20px',
      bottom: '0px',
      left: '30px',
      right: '30px',
      containLabel: true,
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
      formatter: (params) => {
        let formatData = {
          value: number.thousandFormat(params.data.custNum),
          unit: '人',
        };
        let showParamsName = params.name;
        if (params.name === NAME_TGZC) {
          showParamsName = `客户${params.name}`;
          const item = transformItemUnit(params.data.asset);
          formatData = {
            value: item.newItem,
            unit: item.newUnit,
          };
        }
        return `${showText}${params.data.name}${showParamsName}：${formatData.value}${formatData.unit}`;
      }
    },
    xAxis: {
      type: 'category',
      data: ['客户', NAME_TGZC],
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#8995a5',
      },
    },
    yAxis: {
      type: 'value',
      max: 100,
      interval: 50,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value}%',
        color: '#8995a5',
        verticalAlign: 'bottom',
      },
      splitLine: {
        lineStyle: {
          color: '#eee',
        }
      }
    },
    series: [{
      type: 'bar',
      stack: 'one',
      data: [{
        ...dataSource[1],
        value: dataSource[1].custNumRate,
      }, {
        ...dataSource[1],
        value: dataSource[1].assetRate,
      }],
      itemStyle: {
        normal: {
          color: dataSource[1].style.background,
        },
      }
    },
    {
      type: 'bar',
      stack: 'one',
      data: [{
        ...dataSource[0],
        value: dataSource[0].custNumRate,
      }, {
        ...dataSource[0],
        value: dataSource[0].assetRate,
      }],
      barMaxWidth: '25%',
      itemStyle: {
        normal: {
          color: dataSource[0].style.background,
        },
      }
    }]
  };
  return {
    dataSource,
    option,
  };
}

// 客户性质
function getCustomTypeChartData(data) {
  const showText = data.showText || '';
  const dataSource = [
    {
      name: '个人',
      filterValue: 'per',
      filterId: 'customType',
      filterName: '客户性质',
      style: {
        background: '#fec965',
      }
    },
    {
      name: '普通机构',
      filterValue: 'org',
      filterId: 'customType',
      filterName: '客户性质',
      style: {
        background: '#ff8008',
      },
    },
    {
      name: '产品',
      filterValue: 'prod',
      filterId: 'customType',
      filterName: '客户性质',
      style: {
        background: '#d14c0f',
      },
    }
  ];

  if (data.custTypePer) {
    dataSource[0].custNum = data.custTypePer.custNum || 0;
    dataSource[0].asset = data.custTypePer.asset || 0;
  } else {
    dataSource[0].custNum = 0;
    dataSource[0].asset = 0;
  }
  if (data.custTypeOrg) {
    dataSource[1].custNum = data.custTypeOrg.custNum || 0;
    dataSource[1].asset = data.custTypeOrg.asset || 0;
  } else {
    dataSource[1].custNum = 0;
    dataSource[1].asset = 0;
  }
  if (data.custTypeProd) {
    dataSource[2].custNum = data.custTypeProd.custNum || 0;
    dataSource[2].asset = data.custTypeProd.asset || 0;
  } else {
    dataSource[2].custNum = 0;
    dataSource[2].asset = 0;
  }

  const custNumSum = dataSource[0].custNum + dataSource[1].custNum + dataSource[2].custNum;
  const assetSum = dataSource[0].asset + dataSource[1].asset + dataSource[2].asset;

  if (custNumSum === 0) {
    dataSource[0].custNumRate = 33.33;
    dataSource[1].custNumRate = 33.33;
    dataSource[2].custNumRate = 33.34;
    dataSource[0].showCustNumRate = 0;
    dataSource[1].showCustNumRate = 0;
    dataSource[2].showCustNumRate = 0;
  } else {
    dataSource[0].showCustNumRate = calcPercent(dataSource[0].custNum, custNumSum);
    dataSource[1].showCustNumRate = calcPercent(dataSource[1].custNum, custNumSum);
    dataSource[2].showCustNumRate = calcPercent(dataSource[2].custNum, custNumSum);
    dataSource[0].custNumRate = Math.floor((dataSource[0].custNum / custNumSum) * 100);
    dataSource[1].custNumRate = Math.floor((dataSource[1].custNum / custNumSum) * 100);
    if (dataSource[1].custNumRate === 0 && dataSource[0].custNumRate !== 100) {
      if (dataSource[1].custNum > dataSource[2].custNum) {
        dataSource[1].custNumRate = 1;
      }
    }
    dataSource[2].custNumRate = 100 - dataSource[0].custNumRate - dataSource[1].custNumRate;
  }
  if (assetSum === 0) {
    dataSource[0].assetRate = 33.33;
    dataSource[1].assetRate = 33.33;
    dataSource[2].assetRate = 33.34;
    dataSource[0].showAssetRate = 0;
    dataSource[1].showAssetRate = 0;
    dataSource[2].showAssetRate = 0;
  } else {
    dataSource[0].showAssetRate = calcPercent(dataSource[0].asset, assetSum);
    dataSource[1].showAssetRate = calcPercent(dataSource[1].asset, assetSum);
    dataSource[2].showAssetRate = calcPercent(dataSource[2].asset, assetSum);
    dataSource[0].assetRate = Math.floor((dataSource[0].asset / assetSum) * 100);
    dataSource[1].assetRate = Math.floor((dataSource[1].asset / assetSum) * 100);

    if (dataSource[1].assetRate === 0 && dataSource[0].assetRate !== 100) {
      if (dataSource[1].asset > dataSource[2].asset) {
        dataSource[1].assetRate = 1;
      }
    }
    dataSource[2].assetRate = 100 - dataSource[0].assetRate - dataSource[1].assetRate;
  }
  const option = {
    grid: {
      top: '20px',
      bottom: '0px',
      left: '30px',
      right: '30px',
      containLabel: true,
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
      formatter: (params) => {
        let formatData = {
          value: number.thousandFormat(params.data.custNum),
          unit: '人',
          showPercent: params.data.showCustNumRate || '0%',
        };
        let showParamsName = params.name;
        if (params.name === NAME_TGZC) {
          showParamsName = `客户${params.name}`;
          const item = transformItemUnit(params.data.asset);
          formatData = {
            value: item.newItem,
            unit: item.newUnit,
            showPercent: params.data.showAssetRate || '0%',
          };
        }
        return `
          ${showText}${params.data.name}${showParamsName}：${formatData.value}${formatData.unit}，占比${formatData.showPercent}
        `;
      }
    },
    xAxis: {
      type: 'category',
      data: ['客户', NAME_TGZC],
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#8995a5',
      },
    },
    yAxis: {
      type: 'value',
      max: 100,
      interval: 50,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value}%',
        color: '#8995a5',
        verticalAlign: 'bottom',
      },
      splitLine: {
        lineStyle: {
          color: '#eee',
        }
      }
    },
    series: [{
      type: 'bar',
      stack: 'one',
      data: [{
        ...dataSource[2],
        value: dataSource[2].custNumRate,
      }, {
        ...dataSource[2],
        value: dataSource[2].assetRate,
      }],
      itemStyle: {
        normal: {
          color: dataSource[2].style.background,
        },
      }
    },
    {
      type: 'bar',
      stack: 'one',
      data: [{
        ...dataSource[1],
        value: dataSource[1].custNumRate,
      }, {
        ...dataSource[1],
        value: dataSource[1].assetRate,
      }],
      itemStyle: {
        normal: {
          color: dataSource[1].style.background,
        },
      }
    },
    {
      type: 'bar',
      stack: 'one',
      data: [{
        ...dataSource[0],
        value: dataSource[0].custNumRate,
      }, {
        ...dataSource[0],
        value: dataSource[0].assetRate,
      }],
      barMaxWidth: '25%',
      itemStyle: {
        normal: {
          color: dataSource[0].style.background,
        },
      }
    }]
  };
  return {
    dataSource,
    option,
  };
}

// 盈亏比
function getMaxCostRateChartData(data) {
  const xAxisLabel = ['-30', '-20', '-10', '0', '10', '20', '30'];
  let dataSource = [
    {
      name: '盈亏比在-∞~-30%(不含)的',
      value: 0,
      filterValue: {
        minVal: null,
        maxVal: '-30',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '盈亏比在-30%~-20%(不含)的',
      value: 0,
      filterValue: {
        minVal: '-30',
        maxVal: '-20',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '盈亏比在-20%~-10%(不含)的',
      value: 0,
      filterValue: {
        minVal: '-20',
        maxVal: '-10',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '盈亏比在-10%~0(不含)的',
      value: 0,
      filterValue: {
        minVal: '-10',
        maxVal: '0',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '盈亏比在0~10%(不含)的',
      value: 0,
      filterValue: {
        minVal: '0',
        maxVal: '10',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '盈亏比在10%~20%(不含)的',
      value: 0,
      filterValue: {
        minVal: '10',
        maxVal: '20',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '盈亏比在20%~30%(不含)的',
      value: 0,
      filterValue: {
        minVal: '20',
        maxVal: '30',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '盈亏比在30%~+∞(不含)的',
      value: 0,
      filterValue: {
        minVal: '30',
        maxVal: null,
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    }
  ];
  if (data.profitAndLossRatio) {
    dataSource = _.map(dataSource, (item, index) => ({
      ...item,
      value:
        (data.profitAndLossRatio[index] && data.profitAndLossRatio[index].custNum) || 0,
    }));
  }
  const option = {
    color: ['#1ac4f8'],
    grid: {
      left: '10px',
      right: '10px',
      bottom: '0px',
      top: '15px',
      containLabel: false,
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
      formatter: (params) => {
        const formatData = {
          value: number.thousandFormat(params.data.value),
          unit: '人',
        };
        return `${params.data.name}客户：${formatData.value}${formatData.unit}`;
      }
    },
    xAxis: [
      {
        type: 'category',
        data: _.map(dataSource, item => item.name),
        axisLabel: {
          show: false,
        },
        show: false,
      }
    ],
    yAxis: [
      {
        type: 'value',
        show: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        },
        splitNumber: 5,
      }
    ],
    series: [
      {
        type: 'bar',
        barWidth: '80%',
        data: dataSource,
      }
    ]
  };
  return {
    xAxisLabel,
    dataSource,
    option,
  };
}

// 盈亏幅度
function getPftAmtChartData(data) {
  const xAxisLabel = [
    '-100', '-50', '-10', '-5', '-1', '0',
    '1', '5', '10', '50', '100'
  ];
  let dataSource = [
    {
      name: '盈亏幅度在-∞~-100(不含)万元的',
      value: 0,
      filterValue: {
        minVal: null,
        maxVal: '-1000000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在-100~-50(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '-1000000',
        maxVal: '-500000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在-50~-10(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '-500000',
        maxVal: '-100000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在-10~-5(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '-100000',
        maxVal: '-50000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在-5~-1(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '-50000',
        maxVal: '-10000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在-1~0(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '-10000',
        maxVal: '0',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在0~1(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '0',
        maxVal: '10000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在1~5(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '10000',
        maxVal: '50000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在5~10(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '50000',
        maxVal: '100000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在10~50(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '100000',
        maxVal: '500000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在50~100(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '500000',
        maxVal: '1000000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈亏幅度在100~∞(不含)万元的',
      value: 0,
      filterValue: {
        minVal: '1000000',
        maxVal: null,
      },
      filterName: '收益',
      filterId: 'pftAmt',
    }
  ];
  if (data.profitAndLossMargin) {
    dataSource = _.map(dataSource, (item, index) => ({
      ...item,
      value:
        (data.profitAndLossMargin[index] && data.profitAndLossMargin[index].custNum) || 0,
    }));
  }
  const option = {
    color: ['#008fd2'],
    grid: {
      left: '10px',
      right: '10px',
      bottom: '0px',
      top: '15px',
      containLabel: false
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
      formatter: (params) => {
        const formatData = {
          value: number.thousandFormat(params.data.value),
          unit: '人',
        };
        return `${params.data.name}客户：${formatData.value}${formatData.unit}`;
      }
    },
    xAxis: [
      {
        type: 'category',
        data: _.map(dataSource, item => item.name),
        axisLabel: {
          show: false,
        },
        show: false,
      }
    ],
    yAxis: [
      {
        type: 'value',
        show: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#eee',
          }
        },
        splitNumber: 5,
      }
    ],
    series: [
      {
        type: 'bar',
        barWidth: '80%',
        data: dataSource,
      }
    ]
  };
  return {
    xAxisLabel,
    dataSource,
    option,
  };
}

// 持仓分布
function getHoldingChart(data) {
  if (_.isEmpty(data)) {
    return false;
  }
  // 1. 获取所有的数据
  const values = _.map(data, item => item.asset || 0);
  // 2. 将数据与指标轴名称合并到一起
  const indicators = _.map(data, (item) => {
    const { type, asset } = item;
    let max = Math.max(...values);
    const min = Math.min(...values);
    if (max === min && min === 0) {
      max = 10;
    }
    return {
      name: `${type}|${asset}`,
      max: max * 1.1,
      min: -(max * 0.5),
      color: '#666666',
    };
  });

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    radar: {
      indicator: indicators,
      center: ['50%', '50%'],
      radius: 60,
      // shape: 'circle',
      splitNumber: 3,
      splitArea: {
        areaStyle: { // 分隔区域的样式设置。
          show: true,
          color: ['#f4f6f9', '#e9eaec'],
        }
      },
      nameGap: 10,
      name: {
        formatter: (name) => {
          const labels = name.split('|');
          const text = labels[0];
          const value = Number(labels[1]);
          const formatedV = number.formatToUnit({ num: value, floatLength: 2 });
          return `{normal|${text}}\n{normal|${formatedV}}`;
        },
        axisLine: {
          lineStyle: {
            color: '#fec965',
          },
        },
        rich: {
          name: {
            fontSize: 12,
            color: 'red',
            align: 'center',
          }
        },
      },
    },
    series: [
      {
        type: 'radar',
        name: '持仓分布',
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#ff8008',
            },
            areaStyle: {
              color: '#fec965',
              opacity: 1
            },
          }
        },
        symbol: 'circle',
        data: [
          {
            value: values,
          },
        ],
      },
    ],
  };
  return option;
}

// 业务开通
function getOpenedAccountsChartData(data) {
  const option = {
    color: ['#49b6ff'],
    grid: {
      left: '10px',
      right: '10px',
      bottom: '1px',
      top: '15px',
      containLabel: false,
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
    },
    xAxis: [
      {
        type: 'category',
        data: _.map(data, item => item.name),
        show: true,
        axisLine: {
          lineStyle: {
            color: '#a8b6d4',
            width: 1,
          }
        },
        axisTick: {
          alignWithLabel: true,
          length: 0,
        },
        axisLabel: {
          color: '#666',
          align: 'center',
          margin: 20,
          rotate: 30,
        },
      }
    ],
    yAxis: [
      {
        type: 'value',
        show: false,
      }
    ],
    series: [{
      data,
      type: 'bar',
      barWidth: 14,
      cursor: 'default',
      label: {
        normal: {
          show: true,
          position: 'top',
          color: '#333',
          fontSize: 12,
        },
      },
    }],
  };
  return {
    option,
  };
}

export {
  getCustClassChartData,
  getCustomTypeChartData,
  getMaxCostRateChartData,
  getPftAmtChartData,
  getHoldingChart,
  getOpenedAccountsChartData,
  NAME_TGZC,
};
