/*
 * @Author: WangJunJun
 * @Date: 2018-08-02 21:09:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-09 20:38:21
 */


import _ from 'lodash';
import { emp } from '../../../helper';
import { ORG_LEVEL1, ORG_LEVEL2, ORG_LEVEL3 } from '../../../config/orgTreeLevel';
import {
  EMP_MANAGER_SCOPE_ITEM,
  EMP_COMPANY_ITEM,
  EMP_DEPARTMENT_ITEM,
  EMP_COMPANY_SCOPE,
  EMP_DEPARTMENT_SCOPE,
  EMP_MANAGER_SCOPE,
  missionImplementation,
} from '../../../config/managerViewCustManagerScope';

/**
* 根据orgId,判断当前机构level和当前维度可选项
*/
export function judgeCurrentOrgLevel({ custRange, orgId = emp.getOrgId(), ptyMngId = '' }) {
  // 来自营业部
  let level = ORG_LEVEL3;
  let currentScopeList = [EMP_MANAGER_SCOPE_ITEM];
  if (!_.isEmpty(ptyMngId)) {
    return {
      currentScopeList,
      level,
    };
  }
  // 判断是否是经纪总部
  if (emp.isManagementHeadquarters(orgId)) {
    level = ORG_LEVEL1;
    currentScopeList = [
      EMP_COMPANY_ITEM,
      EMP_DEPARTMENT_ITEM,
      ...currentScopeList,
    ];
  } else if (emp.isFiliale(custRange, orgId)) {
    // 判断是否是分公司
    level = ORG_LEVEL2;
    currentScopeList = [
      EMP_DEPARTMENT_ITEM,
      ...currentScopeList,
    ];
  }
  return {
    currentScopeList,
    level,
  };
}

/**
 * 根据当前组织机构的level来确定维度信息
 */
export function getCurrentScopeByOrgLevel(level) {
  if (level === ORG_LEVEL1) {
    // 经总层级，默认维度是分公司
    return EMP_COMPANY_SCOPE;
  } else if (level === ORG_LEVEL2) {
    // 分公司层级，默认维度是营业部
    return EMP_DEPARTMENT_SCOPE;
  }

  return EMP_MANAGER_SCOPE;
}


/**
* 管理者视图右侧，服务经理维度统计，根据当前orgId机构，获取默认维度
*/
export function getCurrentScopeByOrgId(param) {
  const { level } = judgeCurrentOrgLevel(param);

  return getCurrentScopeByOrgLevel(level);
}

/**
* 获取任务实施神策log日志Name属性
*/
function getLogName(params) {
  const { logInfo } = missionImplementation;
  const {
    isEntryFromCustTotal,
    isEntryFromProgressDetail,
    isEntryFromResultStatisfy,
    isEntryFromPie,
    enterType,
  } = params;
  const {
    entryFromProgressDetail,
    entryFromPie,
    entryFromCustTotal,
  } = logInfo;
  let name = '';
  // 进度条
  if (isEntryFromProgressDetail || isEntryFromResultStatisfy) {
    name = entryFromProgressDetail.name;
  }
  // 饼状图
  if (isEntryFromPie) {
    name = entryFromPie.name;
  }
  // 表格
  if (isEntryFromCustTotal || enterType) {
    name = entryFromCustTotal.name;
  }
  return name;
}

/**
* 获取任务实施神策log日志element属性
*/
function getLogElement(params) {
  const {
    IS_SERVED,
    IS_DONE,
    IS_UP_TO_STANDARD,
    COMPLETED_PROGRESS_FLAG,
    logInfo,
  } = missionImplementation;
  const {
    isEntryFromCustTotal,
    isEntryFromProgressDetail,
    isEntryFromResultStatisfy,
    isEntryFromPie,
    missionProgressStatus,
    progressFlag,
    feedbackIdL1,
    currentFeedback,
  } = params;
  const {
    logElementFromCustTotal,
    logElementFromServedCustomer,
    logElementFromUnservedCustomer,
    logElementFromCompletedCustomer,
    logElementFromUncompletedCustomer,
    logElementFromUpToStandardCustomer,
    logElementFromNotUpToStandardCustomer,
  } = logInfo;
  let element = '';
  // 进度条
  if (isEntryFromProgressDetail || isEntryFromResultStatisfy) {
    // 判断progressFlag的完成状态
    const isCompletedProgressFlag = progressFlag === COMPLETED_PROGRESS_FLAG;
    switch (missionProgressStatus) {
      case IS_SERVED:
        element = isCompletedProgressFlag ? logElementFromServedCustomer
          : logElementFromUnservedCustomer;
        break;
      case IS_DONE:
        element = isCompletedProgressFlag ? logElementFromCompletedCustomer
          : logElementFromUncompletedCustomer;
        break;
      case IS_UP_TO_STANDARD:
        element = isCompletedProgressFlag ? logElementFromUpToStandardCustomer
          : logElementFromNotUpToStandardCustomer;
        break;
      default:
        break;
    }
  }
  // 饼状图
  if (isEntryFromPie) {
    const { feedbackName } = _.filter(currentFeedback,
      item => item.feedbackIdL1 === feedbackIdL1)[0];
    element = feedbackName;
  }
  // 表格中的客户总数
  if (isEntryFromCustTotal) {
    element = logElementFromCustTotal;
  }
  return element;
}

/**
* 处理任务实施神策log日志
*/
export function printMissionImplementationLog(params) {
  const name = getLogName(params);
  const element = getLogElement(params);
  return {
    name,
    element,
  };
}
