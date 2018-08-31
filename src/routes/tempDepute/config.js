/*
 * @Author: sunweibin
 * @Date: 2018-08-29 15:42:30
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-30 15:36:00
 * @description 临时委托任务的配置项
 */
import _ from 'lodash';

import { status, drafter, approver, applyTime } from '../../config/busApplyFilters';

// 临时委托任务头部筛选基本条件
export const SEIBEL_HEADER_BASIC_FILTERS = [status, drafter, approver, applyTime];

// 列表项中tag的样式配置项
const STATUS_TAGS = [
  {
    code: '',
    type: '',
    text: '不限',
  },
  {
    code: '10',
    text: '审批中',
    type: 'processing',
  },
  {
    code: '20',
    text: '审批通过',
    type: 'complete',
  },
  {
    code: '30',
    text: '审批驳回',
    type: 'reject',
  },
  {
    code: '40',
    text: '委托中',
    type: 'processing',
  },
  {
    code: '50',
    text: '结束',
    type: 'stop',
  },
  {
    code: '60',
    text: '流程终止',
    type: 'stop',
  },
];

// 根据申请单的状态Code值获取到申请单状态标签组件的属性，用于展示各色标签
export const getStatusTagProps = code => _.find(STATUS_TAGS, item => item.code === code);
