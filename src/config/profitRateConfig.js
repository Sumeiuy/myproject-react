// 时间范围选择
const timeList = [
  {
    key: 'month',
    value: '近30天',
  },
  {
    key: 'season',
    value: '近3个月',
  },
  {
    key: 'halfYear',
    value: '近半年',
  },
  {
    key: 'currentYear',
    value: '今年以来',
  },
];

const codeList = [
  {
    key: '000300',
    value: '沪深300',
  },
  {
    key: '000001',
    value: '上证指数',
  },
  {
    key: '399001',
    value: '深证指数',
  },
  {
    key: '399005',
    value: '中小板指数',
  },
  {
    key: '399006',
    value: '创业板指数',
  },
];

const profitRateConfig = {
  timeList,
  codeList,
};

export default profitRateConfig;

export {
  timeList,
  codeList,
};
