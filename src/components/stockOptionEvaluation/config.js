/*
 * @Author: zhangjun
 * @Date: 2018-06-05 15:39:47
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-06 14:08:40
 */
const config = {
  stockOptionApply: {
    pageName: '股票期权评估申请',
    pageType: '05', // 查询列表接口中的type值
    statusOptions: [
      {
        show: true,
        label: '不限',
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
  },
};

export default config;
