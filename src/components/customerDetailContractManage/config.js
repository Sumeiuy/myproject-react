/**
 * @Description: 客户360-合约管理-配置文件
 * @Author: Liujianshu-K0240007
 * @Date: 2018-11-20 16:25:46
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-22 09:47:22
 */
import _ from 'lodash';

// 进入页面的 默认 tab
export const DEFAULT_ACTIVE_TAB = 'protocol';

// 格式化的短日期格式
export const FORMAT_TIME = 'YYYY-MM-DD';

// 格式化的长日期格式
export const FORMAT_TIME_ALL = 'YYYY-MM-DD HH:mm:ss';

// tab 选项
export const CONTRACT_MANAGE_TABS = {
  protocol: '协议',
  contract: '合约',
  agreement: '合同',
};

// 非投顾协议的子类型
// 高速通道协议、紫金快车道协议、套利软件
export const NOT_TOUGU_SUBTYPE_LIST = ['507050', '507070', '507095'];

// 协议表格的 columns
export const PROTOCOL_COLUMNS = [
  {
    key: 'id',
    dataIndex: 'id',
    title: '协议编号',
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: '协议类型',
  },
  {
    key: 'subType',
    dataIndex: 'subType',
    title: '子类型',
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: '状态',
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '协议名称',
  },
  {
    key: 'node',
    dataIndex: 'node',
    title: '当前处理节点',
  },
  {
    key: 'handlerName',
    dataIndex: 'handlerName',
    title: '当前处理人',
  },
  {
    key: 'startTime',
    dataIndex: 'startTime',
    title: '开始日期',
  },
  {
    key: 'endTime',
    dataIndex: 'endTime',
    title: '结束日期',
  },
  {
    key: 'orgName',
    dataIndex: 'orgName',
    title: '服务营业部',
  },
  {
    key: 'operation',
    dataIndex: 'operation',
    title: '操作',
  },
];

// 合约表格的 columns
export const CONTRACT_COLUMNS = [
  {
    key: 'id',
    dataIndex: 'id',
    title: '编号',
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: '类别',
  },
  {
    key: 'subType',
    dataIndex: 'subType',
    title: '子类型',
  },
  {
    key: 'startTime',
    dataIndex: 'startTime',
    title: '开始日期',
  },
  {
    key: 'endTime',
    dataIndex: 'endTime',
    title: '结束日期',
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: '状态',
  },
  {
    key: 'createTime',
    dataIndex: 'createTime',
    title: '创建时间',
  },
  {
    key: 'creatorName',
    dataIndex: 'creatorName',
    title: '创建者',
  },
  {
    key: 'approvalFlow',
    dataIndex: 'approvalFlow',
    title: '审批流程',
  },
];

// 合同表格的 columns
export const AGREEMENT_COLUMNS = [
  {
    key: 'id',
    dataIndex: 'id',
    title: '合同编号',
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '合同名称',
  },
  {
    key: 'amount',
    dataIndex: 'amount',
    title: '合同金额(万元)',
    render: text => _.isFinite(Number(text)) ? (text / 10000).toFixed(2) : '--',
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: '合同状态',
  },
  {
    key: 'startTime',
    dataIndex: 'startTime',
    title: '生效事件',
  },
  {
    key: 'endTime',
    dataIndex: 'endTime',
    title: '结束时间',
  },
  {
    key: 'content',
    dataIndex: 'content',
    title: '合同内容',
  },
  {
    key: 'remark',
    dataIndex: 'remark',
    title: '备注',
  },
];
