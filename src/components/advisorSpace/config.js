/*
 * @Author: zuoguangzu
 * @Date: 2018-09-14 14:04:07
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-09-18 16:01:37
 */
import _ from 'lodash';

const advisorSpace = {
    pageName: '投顾空间申请',
    pageType: '07', // 查询列表接口中的type值
    statusOptions: [
      {
        show: true,
        label: '预约成功',
        value: '06',
      },
      {
        show: true,
        label: '已撤销',
        value: '07',
      }
    ],
}
// 列表项中tag的样式配置项
const STATUS_TAGS = [
  {
    code: '06',
    text: '预约成功',
    type: 'processing',
  },
  {
    code: '07',
    text: '已撤销',
    type: 'reject',
  },
];

// 根据申请单的状态Code值获取到申请单状态标签组件的属性，用于展示各色标签
const getStatusTagProps = code => _.find(STATUS_TAGS, item => item.code === code);
export {
  advisorSpace,
  getStatusTagProps,
}
