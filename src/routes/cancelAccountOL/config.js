/**
 * @Author: sunweibin
 * @Date: 2018-07-09 10:16:28
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-10 15:50:43
 * @description 线上销户需要用到的配置项
 */

const config = {
  // 页面类型 Code
  PAGE_TYPE: '12',
  // 线上销户的状态选项列表
  STATUS_OPTIONS: [
    {
      show: true,
      label: '全部',
      value: '',
    },
    {
      show: true,
      label: '处理中',
      value: '01',
    },
    {
      show: true,
      label: '完成',
      value: '02',
    },
    {
      show: true,
      label: '终止',
      value: '03',
    },
    {
      show: true,
      label: '驳回',
      value: '04',
    },
  ],
};

export default config;
