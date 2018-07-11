/**
 * @file components/utils/tab.js
 *  tab 组件中的通用方法
 * @author yuanhaojie
 */

// 遍历 menus 中包括 children 在内的所有 menu 元素
function traverseMenus(menus, callback) {
  for(let i=0, len=menus.length; i < len; i++) {
    let menu = menus[i];
    callback(menu);
    if (menu.children) {
      traverseMenus(menu.children, callback);
    }
  }
}

export default {
  traverseMenus,
}