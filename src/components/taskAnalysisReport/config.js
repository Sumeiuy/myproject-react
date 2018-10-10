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
    value: '01',
  },
  {
    show: true,
    label: '选做',
    value: '02',
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
    label: '自建任务',
    value: '01',
  },
  {
    show: true,
    label: 'MOT推送',
    value: '02',
  },
];

export {
  defaultStartTime,
  defaultEndTime,
  executeTypeOptions,
  eventSourceOptions,
};
