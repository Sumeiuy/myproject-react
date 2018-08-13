/**
 * @file components/utils/tab.js
 *  tab 组件中的通用方法
 * @author yuanhaojie
 */

import _ from 'lodash';
import { emp } from '../../../src/helper';

function traverseMenus(menus, callback) {
  const newMenus = [
    ...menus,
  ];
  _.forEach(newMenus, (menu, i, array) => {
    if (callback(menu, i, array)) {
      return false;
    }
    return menu.children && !_.isEmpty(menu.children) ?
      traverseMenus(menu.children, callback) : true;
  });

  return newMenus;
}

// 修正外部跳转连接
function fixExternUrl(url) {
  const empId = emp.getId();
  const orgId = emp.getOrgId();
  return url
    .replace('=#[userCode]', `=${empId}`)
    .replace('=#[orgCode]', `=${orgId}`);
}

export {
  traverseMenus,
  fixExternUrl,
};
