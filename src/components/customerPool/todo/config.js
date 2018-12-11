/*
 * @Author: zuoguangzu
 * @Date: 2018-11-08 14:56:43
 * @Last Modified by: liqianwen
 * @Last Modified time: 2018-12-11 19:29:05
 */

import moment from 'moment';

// 筛选项默认开始时间
const defaultStartTime = moment().subtract(61, 'days').valueOf();
// 筛选项默认结束时间
const defaultEndTime = moment().valueOf();

const typeOption = [
  {
    key: '',
    value: '不限'
  },
  {
    key: '1',
    value: '自定义投资建议'
  },
  {
    key: '2',
    value: '投顾个性化信息',
  },
];
const linkTypeList = [
  {
    type: 'service_center',
    rejectUrl: '/bpc/standalone.html#/bpc/highrisk/edit?requestId={requestId}&empId={empId}',
    approvalUrl: '/fspa/spy/approval/html/highRiskMoneyLaunderingApproval.html?requestId={requestId}&empId={empId}'
  }
];

export {
  defaultStartTime,
  defaultEndTime,
  typeOption,
  linkTypeList,
};
