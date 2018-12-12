/*
 * @Author: sunweibin
 * @Date: 2018-11-26 17:13:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 17:50:31
 * @description 辅助函数
 */
import _ from 'lodash';

import { SOURCE_CODE, FORMART_CODE } from './config';

// 判断是否来自综柜、财富通、95597渠道的都不允许修改
export function isFromNoSupportUpdateSource(code) {
  return _.includes([SOURCE_CODE.zonggui, SOURCE_CODE.zhangle, SOURCE_CODE.callCenter], code);
}

// 判断是新建联系方式还是修改联系方式
export function isCreateContact(action) {
  return action === 'CREATE';
}

// 联系方式code,用于判断用户能否新增修改记录的联系方式Code
const CONTACT_CODE = {
  // 手机
  mobile: '104123',
  // 电子邮件
  email: '104124',
};

// 判断有无主要联系方式
export function hasMainContact(data) {
  return !!_.find(data, item => item.mainFlag === 'Y');
}

// 判断是否电子邮件
export function isEmailContactWay(contactWayCode) {
  return contactWayCode === CONTACT_CODE.email;
}

// 个人客户
// 判断是否存在主电话信息并且是手机
// 如果没有主手机联系方式记录，则新建时报错“请客户先通过线上自助或线下临柜的方式维护主联系方式”。
export function hasMainMobile(data) {
  return !!_.find(data, item => item.contactWayCode === CONTACT_CODE.mobile && item.mainFlag === 'Y');
}
// 如果没有主电子邮件记录，则新建电子邮件时报“请客户先通过线上自助或线下临柜的方式维护主要邮箱””。
export function hasMainEmail(data) {
  return !!_.find(data, item => item.contactWayCode === CONTACT_CODE.email && item.mainFlag === 'Y');
}

// 判断是否选择的是联系方式是手机号码
export function isCellPhone(code) {
  return FORMART_CODE.mobile === code;
}
// 判断是否固定电话
export function isLandline(code) {
  return FORMART_CODE.officeline === code || FORMART_CODE.homeline === code;
}
// 判断是否Email
export function isEmail(code) {
  return FORMART_CODE.email === code;
}
