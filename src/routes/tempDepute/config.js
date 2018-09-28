/*
 * @Author: sunweibin
 * @Date: 2018-08-29 15:42:30
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-28 16:18:58
 * @description 临时委托任务的配置项
 */
import _ from 'lodash';

import { status, drafter, approver } from '../../config/busApplyFilters';
// 申请时间,时间格式需要使用默认的，而不是定制的
const applyTime = {
  id: 'applyTime',
  props: {
    filterName: '申请时间',  // 过滤器中文名称
    filterId: 'applyTime', // 过滤器英文代号, 首字母小写
    type: 'date', // 过滤器类型
  },
  filterOption: ['createTime', 'createTimeTo'],
};

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
    text: '审批驳回',
    type: 'reject',
  },
  {
    code: '30',
    text: '审批通过',
    type: 'complete',
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
