/**
 * @Author: sunweibin
 * @Date: 2018-04-14 16:29:04
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-26 14:55:34
 * @description 服务记录页面用到的页面工具或者配置
 */
import _ from 'lodash';

// 服务方式下拉选项配置
const serveWaySelectMap = [
  {
    key: 'HTSC Phone',
    value: '电话',
    children: null,
    descText: null,
  },
  {
    key: 'HTSC Email',
    value: '邮件',
    children: null,
    descText: null,
  },
  {
    key: 'HTSC SMS',
    value: '短信',
    children: null,
    descText: null,
  },
  {
    key: 'wx',
    value: '微信',
    children: null,
    descText: null,
  },
  {
    key: 'Interview',
    value: '面谈',
    children: null,
    descText: null,
  },
  {
    value: '涨乐财富通',
    children: null,
    key: 'ZLFins',
    descText: null,
  },
  {
    value: '其他',
    children: null,
    key: 'HTSC Other',
    descText: null,
  },
];

// 通过服务方式的name或者code
function getServeWayByCodeOrName(value) {
  return _.find(serveWaySelectMap, way => (way.value === value || way.key === value))
    || serveWaySelectMap[0];
}

// 通过服务方式的Label获取到code
function getServeWayCode(value) {
  // 针对后端传值 有可能是 serviceWayName 也有可能是serviceWayCode
  const serveWay = getServeWayByCodeOrName(value);
  return serveWay.key;
}
// 其它类型的客户反馈，容错处理，
// 在某些情况下，后端返回的feedbackList为空，没法展示服务记录界面
// 需要前端容错一下
const errorFeedback = {
  key: '99999',
  value: '其他',
  children: { key: '100000', value: '其他' },
};

// 新增服务记录时，客户反馈一级不给默认值，给一个请选择选项
const defaultFeedbackOption = '请选择';
const defaultFeedback = {
  key: defaultFeedbackOption,
  value: defaultFeedbackOption,
  children: {
    key: defaultFeedbackOption,
    value: defaultFeedbackOption,
  },
};

// 服务状态单选按钮组配置,目前只需要配置这两种状态类型
const serveStatusRadioGroupMap = [
  {
    key: '20',
    value: '处理中',
  },
  {
    key: '30',
    value: '完成',
  },
];

// 打电话时的服务记录
const PHONE = 'phone';

const exported = {
  serveWaySelectMap,
  errorFeedback,
  getServeWayCode,
  getServeWayByCodeOrName,
  serveStatusRadioGroupMap,
  PHONE,
  defaultFeedback,
  defaultFeedbackOption,
};

export default exported;
export {
  serveWaySelectMap,
  errorFeedback,
  getServeWayCode,
  getServeWayByCodeOrName,
  serveStatusRadioGroupMap,
  PHONE,
  defaultFeedback,
  defaultFeedbackOption,
};
