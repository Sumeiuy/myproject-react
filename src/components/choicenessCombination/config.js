/**
 * @Description: 精选组合部分配置项
 * @Author: Liujianshu
 * @Date: 2018-04-25 14:28:07
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-04-25 16:47:41
 */

const config = {
  timeRange: [
    {
      show: true,
      label: '全部',
      value: '',
    },
    {
      show: true,
      label: '近三个月',
      value: '3',
    },
    {
      show: true,
      label: '近半年',
      value: '6',
    },
    {
      show: true,
      label: '近一年',
      value: '12',
    },
  ],
  directionRange: [
    {
      show: true,
      label: '请选择',
      value: '',
    },
    {
      show: true,
      label: '调入/增/买',
      value: '1',
    },
    {
      show: true,
      label: '调出/减/卖',
      value: '2',
    },
  ],
};

export default config;
