/**
 * @Author: XuWenKang
 * @Description: 客户360，客户属性tab相关配置
 * @Date: 2018-11-07 15:17:38
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-07 15:25:05
 */

import _ from 'lodash';
import { number } from '../../helper';

export const CUST_TYPE = {
  // 个人客户类型标识
  PERSON_CUST_TYPE: 'per',
  // 普通机构客户类型标识
  ORGANIZATION_CUST_TYPE: 'org',
  // 产品机构客户类型标识
  PRODUCT_CUST_TYPE: 'prod',
};

export const DEFAULT_VALUE = '--';
export const DEFAULT_PRIVATE_VALUE = '***';
export const LINK_WAY_TYPE = {
  // 手机号码的标识
  MOBILE_TYPE_CODE: '104123',
  // 电子邮箱的标识
  EMAIL_TYPE_CODE: '104124',
  // 微信的标识
  WECHAT_TYPE_CODE: '104131',
  // qq的标识
  QQ_TYPE_CODE: '104127',
  // 公司地址标识(办公地址)
  COMPANY_ADDRESS_TYPE_CODE: '117115',
};

// 根据传入的值（bool || null）决定返回的显示值
export const getViewTextByBool = (bool) => {
  if (_.isBoolean(bool)) {
    return bool ? '是' : '否';
  }
  return DEFAULT_VALUE;
};

// 获取数值显示数据
export const getViewTextByNum = (value) => {
  return _.isNumber(value) ? number.thousandFormat(value) : DEFAULT_VALUE;
};
