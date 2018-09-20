/**
 * @file newHome/utils.js
 *  目标客户池-投顾绩效
 * @author zhufeiyang
 */

 // 新版首页客户分析图表所需要的数据
import _ from 'lodash';
import { transformItemUnit } from '../chartRealTime/FixNumber';
import { number } from '../../helper';

 // 客户类型
function getCustClassChartData(data) {
  const dataSource = [
    {
      name: '零售客户',
      filterValue: 'Y',
      filterId: 'custClass',
      filterName: '客户类型',
      style: {
        background: '#4ed0f1',
      },
    },
    {
      name: '高净值客户',
      filterValue: 'N',
      filterId: 'custClass',
      filterName: '客户类型',
      style: {
        background: '#1aa1e0',
      }
    }
  ];
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
      backgroundColor: 'rgb(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
      formatter: (params) => {
        let data = {
          value: number.thousandFormat(params.data.value),
          unit: '人',
        }
        if (params.name === '托管资产') {
          const item = transformItemUnit(params.data.value);
          data = {
            value: item.newItem,
            unit: item.newUnit,
          }
        }
        return `${params.data.name} ${params.name}：${data.value}${data.unit}`;
      }
    },
    xAxis: {
      type: 'category',
      data: ['客户数', '托管资产'],
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
        value: 20,
      }, {
        ...dataSource[1],
        value: 70,
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
        value: 80,
      }, {
        ...dataSource[0],
        value: 30,
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
  }
}

// 客户性质
function getCustomTypeChartData(data) {
  const dataSource = [
    {
      name: '个人客户',
      filterValue: 'per',
      filterId: 'customType',
      filterName: '客户性质',
      style: {
        background: '#ffd5a6',
      }
    },
    {
      name: '普通机构客户',
      filterValue: 'org',
      filterId: 'customType',
      filterName: '客户性质',
      style: {
        background: '#ffb460',
      },
    },
    {
      name: '产品客户',
      filterValue: 'prod',
      filterId: 'customType',
      filterName: '客户性质',
      style: {
        background: '#ff8700',
      },
    }
  ];
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
      backgroundColor: 'rgb(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
      formatter: (params) => {
        let data = {
          value: number.thousandFormat(params.data.value),
          unit: '人',
        }
        if (params.name === '托管资产') {
          const item = transformItemUnit(params.data.value);
          data = {
            value: item.newItem,
            unit: item.newUnit,
          }
        }
        return `${params.data.name} ${params.name}：${data.value}${data.unit}`;
      }
    },
    xAxis: {
      type: 'category',
      data: ['客户数', '托管资产'],
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
        value: 20,
      }, {
        ...dataSource[2],
        value: 50,
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
        value: 30,
      }, {
        ...dataSource[1],
        value: 30,
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
        value: 50,
      }, {
        ...dataSource[0],
        value: 20,
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
  }
}

// 盈亏比
function getMaxCostRateChartData(data) {
  const xAxisLabel = ['-30', '-20', '-10', '0', '10', '20', '30'];
  const dataSource = [
    {
      name: '低于-30%',
      value: 100,
      filterValue: {
        minVal: null,
        maxVal: '-30',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '-30% ~ -20%',
      value: 52,
      filterValue: {
        minVal: '-30',
        maxVal: '-20',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '-20% ~ -10%',
      value: 210,
      filterValue: {
        minVal: '-20',
        maxVal: '-10',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '-10% ~ 0',
      value: 324,
      filterValue: {
        minVal: '-10',
        maxVal: '0',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '0 ~ 10%',
      value: 431,
      filterValue: {
        minVal: '0',
        maxVal: '10',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '10% ~ 20%',
      value: 516,
      filterValue: {
        minVal: '10',
        maxVal: '20',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '20% ~ 30%',
      value: 219,
      filterValue: {
        minVal: '20',
        maxVal: '30',
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    },
    {
      name: '高于30%',
      value: 123,
      filterValue: {
        minVal: '30',
        maxVal: null,
      },
      filterName: '收益率',
      filterId: 'maxCostRate',
    }
  ];
  const option = {
    color: ['#6dcfec'],
    grid: {
      left: '10px',
      right: '10px',
      bottom: '0px',
      top: '20px',
      containLabel: false
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgb(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
      formatter: (params) => {
        const data = {
          value: number.thousandFormat(params.data.value),
          unit: '人',
        }
        return `${params.data.name} 客户数：${data.value}${data.unit}`;
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
        show: false,
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
    '-100', '-50', '-30', '-10', '-5', '-1', '0',
    '1', '5', '10', '30', '50', '100'
  ];
  const dataSource = [
    {
      name: '亏损大于100万元',
      value: 100,
      filterValue: {
        minVal: null,
        maxVal: '-1000000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '亏损在50-100万元',
      value: 52,
      filterValue: {
        minVal: '-1000000',
        maxVal: '-500000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '亏损在30-50万元',
      value: 210,
      filterValue: {
        minVal: '-500000',
        maxVal: '-300000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '亏损在10-30万元',
      value: 324,
      filterValue: {
        minVal: '-300000',
        maxVal: '-100000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '亏损在10-5万元',
      value: 431,
      filterValue: {
        minVal: '-100000',
        maxVal: '-50000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '亏损在5-1万',
      value: 516,
      filterValue: {
        minVal: '-50000',
        maxVal: '-10000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '亏损在1万以内',
      value: 219,
      filterValue: {
        minVal: '-10000',
        maxVal: '0',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈利在1万元以内',
      value: 123,
      filterValue: {
        minVal: '0',
        maxVal: '10000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈利在1-5万元',
      value: 93,
      filterValue: {
        minVal: '10000',
        maxVal: '50000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈利在5-10万元',
      value: 223,
      filterValue: {
        minVal: '50000',
        maxVal: '100000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈利在10-30万元',
      value: 323,
      filterValue: {
        minVal: '100000',
        maxVal: '300000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈利在30-50万元',
      value: 183,
      filterValue: {
        minVal: '300000',
        maxVal: '500000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈利在50-100万元',
      value: 143,
      filterValue: {
        minVal: '500000',
        maxVal: '1000000',
      },
      filterName: '收益',
      filterId: 'pftAmt',
    },
    {
      name: '盈利在100万元以上',
      value: 353,
      filterValue: {
        minVal: '1000000',
        maxVal: null,
      },
      filterName: '收益',
      filterId: 'pftAmt',
    }
  ];
  const option = {
    color: ['#6dcfec'],
    grid: {
      left: '10px',
      right: '10px',
      bottom: '0px',
      top: '20px',
      containLabel: false
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgb(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
      formatter: (params) => {
        const data = {
          value: number.thousandFormat(params.data.value),
          unit: '人',
        }
        return `${params.data.name} 客户数：${data.value}${data.unit}`;
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
        show: false,
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
  const dataSource = [
    {
      name: '股票',
      style: {
        background: '#d75c5b',
      }
    },
    {
      name: '债券',
      style: {
        background: '#ed7e7d',
      },
    },
    {
      name: '公募',
      style: {
        background: '#fba415',
      },
    },
    {
      name: '私募',
      style: {
        background: '#f8c361',
      },
    },
    {
      name: '紫金',
      style: {
        background: '#9edde6',
      },
    },
    {
      name: 'OTC',
      style: {
        background: '#41a9e4',
      },
    }
  ];
  const option = {
    tooltip: {
      position: 'right',
      backgroundColor: 'rgb(2, 22, 55, 0.8)',
      padding: 10,
      textStyle: {
        fontSize: 12,
      },
      formatter: (params) => {
        const item = transformItemUnit(params.data.value);
        const data = {
          value: item.newItem,
          unit: item.newUnit,
        }
        return `${params.data.name} 资产数：${data.value}${data.unit}`;
      }
    },
    grid: {
      containLabel: false
    },
    series: [
      {
        type: 'pie',
        radius: ['54%', '78%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '14',
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 548,
            name: dataSource[5].name,
            itemStyle: {
              normal: {
                color: dataSource[5].style.background,
              },
            }
          },
          {
            value: 1548,
            name: dataSource[4].name,
            itemStyle: {
              normal: {
                color: dataSource[4].style.background,
              },
            }
          },
          {
            value: 135,
            name: dataSource[3].name,
            itemStyle: {
              normal: {
                color: dataSource[3].style.background,
              },
            }
          },
          {
            value: 234,
            name: dataSource[2].name,
            itemStyle: {
              normal: {
                color: dataSource[2].style.background,
              },
            }
          },
          {
            value: 310,
            name: dataSource[1].name,
            itemStyle: {
              normal: {
                color: dataSource[1].style.background,
              },
            }
          },
          {
            value: 335,
            name: dataSource[0].name,
            itemStyle: {
              normal: {
                color: dataSource[0].style.background,
              },
            }
          }
        ]
      }
    ]
  };

  return {
    dataSource,
    option,
  };
}

export {
  getCustClassChartData,
  getCustomTypeChartData,
  getMaxCostRateChartData,
  getPftAmtChartData,
  getHoldingChart,
}

