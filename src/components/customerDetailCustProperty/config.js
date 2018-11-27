/**
 * @Author: XuWenKang
 * @Description: 客户360，客户属性tab相关配置
 * @Date: 2018-11-07 15:17:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 20:32:53
 */

import _ from 'lodash';
import moment from 'moment';
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

// 根据传入的参数判断是否需要显示title，如果值等于默认值则不显示
export const checkIsNeedTitle = value =>
  (value !== DEFAULT_VALUE && value !== DEFAULT_PRIVATE_VALUE && !_.isEmpty(value));

export default config;
export const {
  MemberGradeColumns,
  integralFlowColumns,
} = config;

export const newMemberGradeColumns = _.map(MemberGradeColumns, (items) => {
  const { dataIndex } = items;
  let newItems = {...items};
  if( dataIndex === 'time'){
    newItems = {
      ...items,
      render: text => {
        const data =  moment(text).format('YYYY-MM-DD hh:mm:ss');
        return data;
      }
    };
  };
  return newItems;
});


// 财务信息TAB的key
export const FINANCE_INFO_KEY = 'financeInfo';
// 合作业务TAB的key
export const COOPERATION_KEY = 'cooperation';
// 营销与服务TAB的key
export const MARKETING_KEY = 'marketing';
// 会员信息TAB的key
export const MEMBER_INFO_KEY = 'memberInfo';
// 关系信息TAB的key
export const RELATION_INFO_KEY = 'relationInfo';

// 客户属性页面tab的map
export const custPropertyTabMapData = {
  // 财务信息TAB
  [FINANCE_INFO_KEY]: '财务信息',
  // 合作业务TAB
  [COOPERATION_KEY]: '合作业务',
  // 营销与服务TAB
  [MARKETING_KEY]: '营销与服务',
  // 会员信息TAB
  [MEMBER_INFO_KEY]: '会员信息',
  // 关系信息TAB
  [RELATION_INFO_KEY]: '关系信息',
};

// 财务信息使用到的正则，第一位数组不能为0，小数点后最多两位，包含小数点最多17位
export const FINCE_REG = /(^0\.\d{0,2}$)|(^[1-9](\d{0,16}$|(\d{0,14}\.\d$)|(\d{0,13}\.\d{0,2}$)))|^0{1}$/;

// 添加联系方式的表单主要选项的下拉框
export const MAIN_FLAG_OPTIONS = [
  {
    label: 'N',
    value: 'N',
  },
  {
    label: 'Y',
    value: 'Y',
  },
];

// Form表单的style
export const FORM_STYLE = {
  width: '200px',
};
