import moment from 'moment';

// 客户人次
const CUSTOMEER_NUMBER_NAME = '客户人次';
// 任务数
const TASK_NUMBER_NAME = '任务数';
// 完成客户人次
const COMPLETE_CUSTOMEER_NUMBER_NAME = '完成客户人次';
// 达标客户人次
const COMPLIANCE_CUSTOMEER_NUMBER_NAME = '达标客户人次';
// 涨乐
const ZHANGLE = '涨乐';
// 其他
const OTHER = '其他';
// 电话
const TELEPHONE = '电话';
// 面谈
const INTERVIEW = '面谈';

// 日期格式
const dateFormat = 'YYYY-MM-DD';
// 筛选项默认开始时间
const defaultStartTime = moment().subtract(7, 'days').format(dateFormat);
// 筛选项默认结束时间
const defaultEndTime = moment().subtract(1, 'days').format(dateFormat);
// 执行类型选项
const executeTypeOptions = [
  {
    show: true,
    label: '不限',
    value: '',
  },
  {
    show: true,
    label: '必做',
    value: 'Mission',
  },
  {
    show: true,
    label: '选做',
    value: 'Chance',
  },
];
// 任务来源选项
const eventSourceOptions = [
  {
    show: true,
    label: '不限',
    value: '',
  },
  {
    show: true,
    label: 'MOT推送',
    value: '1',
  },
  {
    show: true,
    label: '自建任务',
    value: '2',
  },
];

// 事件来源
const eventSourceTypes = {
  // 1是MOT推送
  MOT: '1',
  // 2是自建
  SELFBUILD: '2',
};

// 报表通用配置项
const generalOptions = {
   // grid
   gridOptions: {
    show: true,
    top: '40px',
    left: '20px',
    right: '20px',
    bottom: '0',
    containLabel: true,
    borderWidth: '0',
  },
  textStyle: {
    color: '#333',
  },
  toolbox: {
    show: false,
  },
  yAxisSplitLine: {
    lineStyle: {
      color: '#979797',
      type: 'dotted',
    }
  },
};

// 任务-客户报表配置项
const taskCustomerOptions = {
  color: ['#6fb7ec', '#4c70b3'],
  // 图例配置项
  legendList: [
    {
      type: 'square',
      color: '#6fb7ec',
      name: CUSTOMEER_NUMBER_NAME,
    },
    {
      type: 'line',
      color: '#4c70b3',
      name: TASK_NUMBER_NAME,
    },
  ],
};

// 折线图通用配置项
const chartLineOptions = {
  color: ['#f7ad33', '#4c70b3'],
  series: {
    symbol: 'none',
    smooth: true,
    itemStyle: {
      normal: {
        lineStyle: {
          width: 4,
        }
      }
    },
  },
  // grid
  gridOptions: {
    show: true,
    top: '40px',
    left: '20px',
    right: '40px',
    bottom: '0',
    containLabel: true,
    borderWidth: '0',
  },
};


// 完成服务客户统计配置项
const completeServiceCustOptions = {
  serviceCustOptions: {
    customerNumber: CUSTOMEER_NUMBER_NAME,
    completeCustomerNumber: COMPLETE_CUSTOMEER_NUMBER_NAME,
  },
  // 图例配置项
  legendList: [
    {
      type: 'line',
      color: '#f7ad33',
      name: CUSTOMEER_NUMBER_NAME,
    },
    {
      type: 'line',
      color: '#4c70b3',
      name: COMPLETE_CUSTOMEER_NUMBER_NAME,
    },
  ],
};

// 达标服务客户统计配置项
const complianceServiceCustOptions = {
  serviceCustOptions: {
    completeCustomerNumber: COMPLETE_CUSTOMEER_NUMBER_NAME,
    complianceCustomerNumber: COMPLIANCE_CUSTOMEER_NUMBER_NAME,
  },
  // 图例配置项
  legendList: [
    {
      type: 'line',
      color: '#f7ad33',
      name: COMPLETE_CUSTOMEER_NUMBER_NAME,
    },
    {
      type: 'line',
      color: '#4c70b3',
      name: COMPLIANCE_CUSTOMEER_NUMBER_NAME,
    },
  ],
};

// 服务渠道配置项
const serviceChannelOptions = {
  color: ['#f7ad33', '#4c70b3', '#67b8e1', '#cf4b4a'],
  zhangle: ZHANGLE,
  other: OTHER,
  telephone: TELEPHONE,
  interview: INTERVIEW,
  legendOptions: [
    {
      color: '#f7ad33',
      name: ZHANGLE,
    },
    {
      color: '#4c70b3',
      name: TELEPHONE,
    },
    {
      color: '#67b8e1',
      name: INTERVIEW,
    },
    {
      color: '#cf4b4a',
      name: OTHER,
    }
  ],
  // grid
  gridOptions: {
    show: true,
    top: '40px',
    left: '0',
    right: '40px',
    bottom: '0',
    containLabel: true,
    borderWidth: '0',
  },
  series: {
    symbol: 'none',
    smooth: true,
  },
};

// 事件分析配置项
// 触发任务和完成任务配置项
const taskOption = {
  color: ['#f7ad33', '#4c70b3'],
  eventReportName: '任务统计',
  eventDataName: {
    triggerTaskName: '已触发任务数',
    completedTaskName: '已完成客户数',
  },
  series: {
    type: 'line',
    smooth: true,
    symbol: 'none',
  },
  legendList: [
    {
      color: '#f7ad33',
      name: '触发任务数',
      type: 'line',
    },
    {
      color: '#4c70b3',
      name: '剩余任务数',
      type: 'line',
    }
  ]
};
// 覆盖客户数和完成客户数配置项
const customerOption = {
  color: ['#f7ad33', '#4c70b3'],
  eventReportName: '服务客户统计',
  eventDataName: {
    coveredCustomerName: '覆盖客户数',
    completedCustomerName: '完成客户数',
  },
  series: {
    type: 'line',
    smooth: true,
    symbol: 'none',
  },
  legendList: [
    {
      color: '#f7ad33',
      name: '覆盖客户数',
      type: 'line',
    },
    {
      color: '#4c70b3',
      name: '完成客户数',
      type: 'line',
    }
  ]
};
// 服务渠道占比配置项
const serviceChannelChangeOption = {
  color: ['#f7ad33', '#4c70b3', '#67b8e1', '#cf4b4a'],
  eventReportName: '服务渠道变化',
  eventDataName: {
    zhangle: '涨乐',
    phone: '电话',
    interview: '面谈',
    other: '其它',
  },
  series: {
    type: 'line',
    smooth: true,
    symbol: 'none',
  },
  legendList: [
    {
      color: '#f7ad33',
      name: '涨乐',
      type: 'line',
    },
    {
      color: '#67b8e1',
      name: '电话',
      type: 'line',
    },
    {
      color: '#cf4b4a',
      name: '面谈',
      type: 'line',
    },
    {
      color: '#4c70b3',
      name: '其它',
      type: 'line',
    }
  ]
};

const chartLineColors = ['#f7ad33', '#4c70b3'];

export const {
  gridOptions,
  textStyle,
  toolbox,
  yAxisSplitLine,
} = generalOptions;

export {
  defaultStartTime,
  defaultEndTime,
  generalOptions,
  chartLineOptions,
  executeTypeOptions,
  eventSourceTypes,
  eventSourceOptions,
  taskCustomerOptions,
  chartLineColors,
  completeServiceCustOptions,
  complianceServiceCustOptions,
  serviceChannelOptions,
  CUSTOMEER_NUMBER_NAME,
  TASK_NUMBER_NAME,
  taskOption,
  customerOption,
  serviceChannelChangeOption,
};
