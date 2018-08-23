/**
 * @Descripter:
 * @Author: K0170179
 * @Date: 2018/5/22
 */

export const MISSION_PROGRESS_MAP = [
  {
    value: 'IS_SERVED',
    type: 'Y',
    name: '已服务',
  },
  {
    value: 'IS_SERVED',
    type: 'N',
    name: '未服务',
  },
  {
    value: 'IS_DONE',
    type: 'Y',
    name: '已完成',
  },
  {
    value: 'IS_DONE',
    type: 'N',
    name: '未完成',
  },
  {
    value: 'IS_UP_TO_STANDARD',
    type: 'Y',
    name: '已达标',
  },
  {
    value: 'IS_UP_TO_STANDARD',
    type: 'N',
    name: '未达标',
  },
];

export const OPEN_IN_TAB_PARAM = {
  URL: '/customerPool/createTaskFromServiceResultCust',
  TITLE: '自建任务',
  ID: 'RCT_FSP_CREATE_TASK_FROM_SERVICE_RESULT_CUST',
};
