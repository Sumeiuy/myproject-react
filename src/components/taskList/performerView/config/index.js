/**
 * @Author: sunweibin
 * @Date: 2018-04-13 15:20:19
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-19 14:12:22
 * @description 服务实施中需要用到的配置项
 */
import _ from 'lodash';

// 流程状态，即每一个客户的任务状态
const flowStatus = [
  { id: 10, name: '未开始' },
  { id: 20, name: '处理中' },
  { id: 30, name: '完成' },
  { id: 40, name: '结果达标' },
  { id: 50, name: '审核中' }, // 目前只有涨乐财富通的服务方式下才有
  { id: 60, name: '驳回' }, // 目前只有涨乐财富通的服务方式下才有
];

// 流程状态为未开始
function flowIsUnStart(code) {
  return flowStatus[0].id === Number(code);
}

// 流程状态为处理中
function flowIsProcess(code) {
  return flowStatus[1].id === Number(code);
}

// 流程状态是否完成
function flowIsCompleted(code) {
  return flowStatus[2].id === Number(code);
}

// 流程状态是否结果达标
function flowIsReached(code) {
  return flowStatus[3].id === Number(code);
}

// 流程状态是否审批中
function flowIsApproval(code) {
  return flowStatus[4].id === Number(code);
}

// 流程状态是否被驳回
function flowIsReject(code) {
  return flowStatus[5].id === Number(code);
}

// 根据code获取流程状态
function getFlowStatus(code) {
  return _.find(flowStatus, o => o.id === Number(code));
}

// 根据name获取流程状态Code
function getFlowCodeByName(name) {
  return _.find(flowStatus, o => o.name === name).id;
}

// 任务状态
const taskStatus = [
  { id: 10, name: '审批中' },
  { id: 20, name: '审批驳回' },
  { id: 30, name: '终止' },
  { id: 40, name: '等待执行' },
  { id: 50, name: '执行中' },
  { id: 60, name: '结果跟踪' },
  { id: 70, name: '结束' },
  { id: 80, name: '已完成' },
];

// 任务是否审批中
function taskIsApproval(code) {
  return taskStatus[0].id === Number(code);
}
// 任务是否审批驳回
function taskIsApprovalReject(code) {
  return taskStatus[1].id === Number(code);
}
// 任务是否终止
function taskIsEnd(code) {
  return taskStatus[2].id === Number(code);
}
// 任务是否等待执行
function taskIsWaitExecute(code) {
  return taskStatus[3].id === Number(code);
}
// 任务是否执行中
function taskIsExecuting(code) {
  return taskStatus[4].id === Number(code);
}
// 任务是否结果跟踪
function taskIsResultTrack(code) {
  return taskStatus[5].id === Number(code);
}
// 任务是否结束
function taskIsFinished(code) {
  return taskStatus[6].id === Number(code);
}
// 任务是否已完成
function taskIsCompleted(code) {
  return taskStatus[7].id === Number(code);
}

const exported = {
  // 流程状态，即每一个客户的任务状态
  flowStatusList: flowStatus,

  // 流程状态工具
  flow: {
    isUnStart: flowIsUnStart,
    isProcess: flowIsProcess,
    isComplete: flowIsCompleted,
    isReached: flowIsReached,
    isApproval: flowIsApproval,
    isReject: flowIsReject,
    getFlowStatus,
    getFlowCodeByName,
  },

  // 任务状态
  taskStatusList: taskStatus,

  // 任务状态工具
  task: {
    isApproval: taskIsApproval,
    isApprovalReject: taskIsApprovalReject,
    isEnd: taskIsEnd,
    isWaitExecute: taskIsWaitExecute,
    isExecuting: taskIsExecuting,
    isResultTrack: taskIsResultTrack,
    isFinished: taskIsFinished,
    isCompleted: taskIsCompleted,
  },
};

export default exported;
export { flowStatus as flowStatusList, taskStatus as taskStatusList };

export const {
  flow,
  task,
} = exported;
