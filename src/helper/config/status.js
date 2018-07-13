/**
 * @Author: sunweibin
 * @Date: 2018-07-09 13:46:23
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-09 13:50:55
 * @description 状态值Code对应的数据
 */

const status = [
  {
    code: '',
    type: '',
    text: '不限',
  },
  {
    code: '01',
    text: '处理中',
    type: 'processing',
  },
  {
    code: '02',
    text: '完成',
    type: 'complete',
  },
  {
    code: '03',
    text: '终止',
    type: 'stop',
  },
  {
    code: '04',
    text: '驳回',
    type: 'reject',
  },
];

export default status;
