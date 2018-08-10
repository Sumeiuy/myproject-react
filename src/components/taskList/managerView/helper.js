/*
 * @Author: WangJunJun
 * @Date: 2018-08-02 21:09:41
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-02 21:11:54
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
