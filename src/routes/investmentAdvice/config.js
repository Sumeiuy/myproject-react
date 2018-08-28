/**
 * @Author: sunweibin
 * @Date: 2018-06-04 11:14:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-04 17:15:15
 * @description 投资建议模板使用页面配置项
 */

// Tab列表
const TAB_LIST = [
  {
    tabName: '任务绑定投资建议模板',
    key: '1',
  },
  {
    tabName: '投资建议模板',
    key: '2',
  },
];

// TabKey值集合
const TabKeys = {
  // 任务绑定投资建议模板
  TASK_BIND: '1',
  // 投资建议模板维护
  TEMPLATE: '2',
};
// 投资建议模板维护中的Metions的前缀
const MENTION_PREFIX = ['$'];
// metion的样式
const MentionTextStyles = {
  color: '#2d84cc',
  backgroundColor: '#ebf3fb',
  borderColor: '#ebf3fb',
};

//  MOT任务
const motTask = {
  key: '1',
  name: 'MOT任务',
};

// 自建任务
const selfTask = {
  key: '2',
  name: '自建任务',
};

const exported = {
  TAB_LIST,
  TabKeys,
  MENTION_PREFIX,
  MentionTextStyles,

  // 任务绑定投资建议模板下的Tabs
  TASK_LIST: [motTask, selfTask],

  MOT_TASK: motTask,
  SELF_TASK: selfTask,
};

export default exported;
export {
  TAB_LIST,
  TabKeys,
  MENTION_PREFIX,
  MentionTextStyles,
  motTask as MOT_TASK,
  selfTask as SELF_TASK,
};

export const {
  TASK_LIST,
} = exported;
