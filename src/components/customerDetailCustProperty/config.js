/**
 * @Author: XuWenKang
 * @Description: 客户360，客户属性tab相关配置
 * @Date: 2018-11-07 15:17:38
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-16 09:12:46
 */

import _ from 'lodash';
import { number } from '../../helper';
import { rights } from '../customerPool/list/individualInfo/config';

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
const config = {
  MemberGradeColumns: [
    {
      title: '变更前等级',
      dataIndex: 'beforeChangeLevel',
      key: 'beforeChangeLevel',
      className: 'firstStyle',
    },
    {
      title: '变更后等级',
      dataIndex: 'afterChangeLevel',
      key: 'afterChangeLevel',
      className: 'publicStyle',
    },
    {
      title: '操作来源',
      dataIndex: 'source',
      key: 'source',
      className: 'publicStyle',
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
      className: 'lastStyle',
    },
  ],
  integralFlowColumns: [
    {
      title: '交易ID',
      dataIndex: 'tradeId',
      key: 'tradeId',
      className: 'firstStyle',
    },
    {
      title: '交易日期',
      dataIndex: 'tradeDate',
      key: 'tradeDate',
      className: 'publicStyle',
    },
    {
      title: '交易渠道',
      dataIndex: 'tradeChannel',
      key: 'tradeChannel',
      className: 'publicStyle',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      className: 'publicStyle',
    },
    {
      title: '子类型',
      dataIndex: 'subType',
      key: 'subType',
      className: 'publicStyle',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      className: 'publicStyle',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      className: 'publicStyle',
    },
    {
      title: '产品数量',
      dataIndex: 'productQuantity',
      key: 'productQuantity',
      align: 'right',
      className: 'lastStyle',
    },
    {
      title: '基本点数',
      dataIndex: 'basePoints',
      key: 'basePoints',
      align: 'right',
      className: 'lastStyle',
    },
    {
      title: '点数类型',
      dataIndex: 'pointType',
      key: 'pointType',
      className: 'publicStyle',
    },
    {
      title: '处理日期',
      dataIndex: 'processDate',
      key: 'processDate',
      className: 'publicStyle',
    },
    {
      title: '所有者',
      dataIndex: 'owners',
      key: 'owners',
      className: 'publicStyle',
    },
    {
      title: '取消的交易ID	',
      dataIndex: 'cancelledId',
      key: 'cancelledId',
      className: 'lastStyle',
    },
  ]
};
export default config;
export const {
  MemberGradeColumns,
  integralFlowColumns,
} = config;

