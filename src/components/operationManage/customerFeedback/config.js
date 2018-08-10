/**
 * @Description: 任务绑定客户反馈部分配置项
 * @Author: Liujianshu
 * @Date: 2018-04-16 13:25:09
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-27 10:51:54
 */

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

// 服务经理角色
const serviceManagerRole = {
  name: '服务经理可选项',
  key: '0',
};

// 涨乐客户角色
const zhangleRole = {
  name: '客户可选项',
  key: '1',
};


const config = {
  // 角色可选项配置
  ROLE_TYPES: [serviceManagerRole, zhangleRole],
  // tab切换选项
  TABLIST: [motTask, selfTask],
  MOT_TASK: motTask,
  SELF_TASK: selfTask,
  SERVICE_MANAGER_ROLE: serviceManagerRole,
  ZHANGLE_ROLE: zhangleRole,
};

export default config;
export {
  motTask as MOT_TASK,
  selfTask as SELF_TASK,
  serviceManagerRole as SERVICE_MANAGER_ROLE,
  zhangleRole as ZHANGLE_ROLE,
};

export const {
  ROLE_TYPES,
  TABLIST,
} = config;
