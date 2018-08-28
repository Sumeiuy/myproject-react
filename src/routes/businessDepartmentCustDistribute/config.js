/**
 * @Author: sunweibin
 * @Date: 2018-05-08 15:05:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-09 10:22:04
 * @description 营业部非投顾签约客户分配的配置项
 */

const exported = {
  pageName: '营业部客户分配',
  pageType: '08',

  status: [
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
    {
      show: true,
      label: '失败',
      value: '05',
    },
  ],
};

export default exported;
