import _ from 'lodash';
import { permission } from '../../helper';
import {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  chooseMissionView,
} from './config';

const getViewInfo = (missionViewType = '') => {
  // 任务管理权限
  const hasPermissionOfManagerView = permission.hasPermissionOfManagerView();

  // 默认展示创建者视图
  let currentViewType = INITIATOR;
  let missionViewList = chooseMissionView;

  // 然后根据权限来，到底需不需要展示管理者视图的入口
  // 没有管理者视图查看权限
  if (!hasPermissionOfManagerView) {
    missionViewList = _.filter(chooseMissionView, item => item.value !== CONTROLLER);
    // 当前视图是执行者视图
    currentViewType = EXECUTOR;
  } else {
    // 如果当前用户有职责权限并且url上没有当前视图类型，默认显示管理者视图
    currentViewType = CONTROLLER;
  }

  // 如果当前url上有当前视图类型，则用url上的视图类型
  if (!_.isEmpty(missionViewType)) {
    currentViewType = missionViewType;
  }

  return {
    currentViewType,
    missionViewList,
  };
};

const exported = {
  getViewInfo,
};

export default exported;
export { getViewInfo };
