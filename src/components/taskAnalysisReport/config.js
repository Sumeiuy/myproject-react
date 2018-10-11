import moment from 'moment';

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

// 报表通用配置项
const generalOptions = {
   // grid
   gridOptions: {
    show: true,
    top: '40px',
    left: '20px',
    right: '20px',
    bottom: '20px',
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
  }
};

// 完成服务客户统计配置项
const completeServiceCustOptions = {
  serviceCustOptions: {
    customerNumber: '客户人次',
    completeCustomerNumber: '完成客户人次',
  }
};

// 达标服务客户统计配置项
const complianceServiceCustOptions = {
  serviceCustOptions: {
    completeCustomerNumber: '完成客户人次',
    complianceCustomerNumber: '达标客户人次',
  }
};

const chartLineColors = ['#f7ad33', '#4c70b3'];

// 客户人次
const CUSTOMEER_NUMBER_NAME = '客户人次';
// 任务数
const TASK_NUMBER_NAME = '任务数';
// 完成客户人次
const COMPLETE_CUSTOMEER_NUMBER_NAME = '完成客户人次';
// 达标客户人次
const COMPLIANCE_CUSTOMEER_NUMBER_NAME = '达标客户人次';

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
  eventSourceOptions,
  taskCustomerOptions,
  chartLineColors,
  completeServiceCustOptions,
  complianceServiceCustOptions,
  CUSTOMEER_NUMBER_NAME,
  TASK_NUMBER_NAME,
  COMPLETE_CUSTOMEER_NUMBER_NAME,
  COMPLIANCE_CUSTOMEER_NUMBER_NAME,
};
