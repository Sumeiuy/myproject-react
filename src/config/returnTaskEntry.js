export default {};

export const returnTaskFromToDoList = 'returnTaskFromToDoList';

export const returnTaskFromTaskList = 'returnTaskFromTaskList';

export const custGroupList = 'custGroupList';

export const pieEntry = 'pieEntry';

export const progressEntry = 'progressEntry';

// returnTaskFromToDoList是待办，审批驳回之后，编辑自建任务信息界面
// returnTaskFromTaskList是创建者视图，审批驳回之后，编辑自建任务信息界面
// custGroupList是客户分组
// pieEntry是管理者视图的饼图
// progressEntry是管理者视图的进度条
// custGroupList, 客户分组管理
export const returnTaskEntrySource = [
  returnTaskFromTaskList,
  returnTaskFromToDoList,
  custGroupList,
  progressEntry,
  pieEntry,
];
