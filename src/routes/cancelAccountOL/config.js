/**
 * @Author: sunweibin
 * @Date: 2018-07-09 10:16:28
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-03 15:40:58
 * @description 线上销户需要用到的配置项
 */
import {
  customer, status, drafter, department, approver, applyTime
} from '../../config/busApplyFilters';

const config = {
  // 页面类型 Code
  PAGE_TYPE: '12',
  // 线上销户的状态选项列表
  STATUS_OPTIONS: [
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
  basicFilters: [
    customer,
    status,
    drafter,
    applyTime,
  ],
  moreFilters: [
    department,
    approver,
  ],
  moreFilterData: [
    { value: '部门', key: 'orgId' },
    { value: '审批人', key: 'approvalId' },
  ],
};

export default config;

export const {
  PAGE_TYPE,
  STATUS_OPTIONS,
  basicFilters,
  moreFilters,
  moreFilterData,
} = config;
