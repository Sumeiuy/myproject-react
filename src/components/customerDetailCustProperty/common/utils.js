/*
 * @Author: sunweibin
 * @Date: 2018-11-26 17:13:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-28 17:22:08
 * @description 辅助函数
 */

 // 判断是否来自综柜、财富通、95597渠道的都不允许修改
 export function isFromNoSupportUpdateSource(code) {
  return false;
 };

// 判断是新建联系方式还是修改联系方式
export function isCreateContact(action) {
  return action === 'CREATE';
};
