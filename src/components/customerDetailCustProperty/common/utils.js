/*
 * @Author: sunweibin
 * @Date: 2018-11-26 17:13:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 17:47:55
 * @description 辅助函数
 */
import _ from 'lodash';

 // 判断是否来自综柜、财富通、95597渠道的都不允许修改
 export function isFromNoSupportUpdateSource(code) {
  return false;
 };

// 判断是新建联系方式还是修改联系方式
export function isCreateContact(action) {
  return action === 'CREATE';
};

// 联系方式code,用于判断用户能否新增修改记录的联系方式Code
const CONTACT_CODE = {
  // 手机
  mobile: '104123',
  // 电子邮件
  email: '104124',
};

// 判断有无主要联系方式
function hasMainContact(data) {
  return !!_.find(data, item => item.mainFlag === 'Y');
}

// 判断有无手机联系方式
function hasMobileContact(data) {
  return !!_.find(data, item => item.contactWayCode === CONTACT_CODE.mobile);
}

// 判断有无电子邮件联系方式
function hasEmailContact(data) {
  return !!_.find(data, item => item.contactWayCode === CONTACT_CODE.email);
}

// 判断是否电子邮件
export function isEmailContactWay (contactWayCode) {
  return contactWayCode === CONTACT_CODE.email;
}

// 个人客户
// 判断是否存在主电话信息并且是手机
// 如果没有主手机联系方式记录，则新建时报错“请客户先通过线上自助或线下临柜的方式维护主联系方式”。
export function hasMainMobile(data) {
  return hasMainContact(data) && hasMobileContact(data);
}
// 如果没有主电子邮件记录，则新建电子邮件时报“请客户先通过线上自助或线下临柜的方式维护主要邮箱””。
export function hasMainEmail(data) {
  return hasMainContact(data) && hasEmailContact(data);
}
