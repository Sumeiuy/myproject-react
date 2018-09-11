/*
 * @Author: zhangjun
 * @Date: 2018-09-11 14:38:00
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-11 14:59:24
 * @description models/investmentSpace.js
 */

import { keyMonitorAccount as api } from '../api';

export default {
  namespace: 'investmentSpace',
  state: {
    // 申请单列表
    applictionList: {},
    // 右侧详情
    detailInfo: {},
    // 智慧前厅列表
    smartFrontHallList: {},
  }
}