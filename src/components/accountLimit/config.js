/**
 * @Description: 账户限制管理配置项
 * @Author: Liujianshu
 * @Date: 2018-07-31 16:51:05
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-08-03 14:07:38
 */
import {
  operationType,
  status,
  drafter,
  department,
  approver,
  applyTime,
} from '../../config/busApplyFilters';

// 限制设置的code
const SET_CODE = '1301';
// 限制解除的code
const RELIEVE_CODE = '1302';
const config = {
  TIME_FORMAT_STRING: 'YYYY-MM-DD',
  SET_CODE,
  RELIEVE_CODE,
  STRING_LIMIT_LENGTH: 100,
  // 限制的条数
  LIMIT_COUNT: 200,
  // 页面名称-中文
  PAGE_NAME: '账户限制管理',
  // 页面名称-英文
  PAGE_VALUE: 'accountLimitPage',
  // 页面类型
  PAGE_TYPE: '13', // 查询列表接口中的type值
  basicFilters: [
    operationType,
    status,
    drafter,
    applyTime,
  ],
  moreFilters: [
    department,
    approver,
  ],
  moreFilterData: [
    { value: '部门', key: 'orgId' },
    { value: '审批人', key: 'approvalId' },
  ],
  // 子类型数组
  operateTypeArray: [
    {
      show: true,
      label: '限制设置',
      value: SET_CODE,
    },
    {
      show: true,
      label: '限制解除',
      value: RELIEVE_CODE,
    },
  ],
  bankConfirmArray: [
    {
      label: '是',
      value: 'true',
    },
    {
      label: '否',
      value: 'false',
    },
  ],
  // 状态数组
  statusArray: [
    {
      show: true,
      label: '全部',
      value: '',
    },
    {
      show: true,
      label: '处理中',
      value: '01',
    },
    {
      show: true,
      label: '完成',
      value: '02',
    },
    {
      show: true,
      label: '终止',
      value: '03',
    },
    {
      show: true,
      label: '驳回',
      value: '04',
    },
  ],
  // 表格标题
  tableTitle: {
    custList: [
      {
        dataIndex: 'custName',
        key: 'custName',
        title: '客户',
        width: 160,
      },
      {
        dataIndex: 'empName',
        key: 'empName',
        title: '服务经理',
        width: 160,
      },
      {
        dataIndex: 'limit',
        key: 'limit',
        title: '当前账户限制',
        width: 270,
      },
    ],
    approvalList: [
      {
        title: '工号',
        dataIndex: 'login',
        key: 'login',
      }, {
        title: '姓名',
        dataIndex: 'empName',
        key: 'empName',
      }, {
        title: '所属部门',
        dataIndex: 'occupation',
        key: 'occupation',
      },
    ],
    moreList: [
      {
        dataIndex: 'managerId',
        key: 'managerId',
        title: '业务对接人',
        width: 190,
      },
      {
        dataIndex: 'limitAmount',
        key: 'limitAmount',
        title: '禁止转出金额(元)',
        width: 160,
      },
    ],
  },
  // 附件类型
  attachmentMap: [
    {
      type: 'khsqcl',
      title: '客户申请材料',
      show: true,
      limitCount: 1,
      length: 0,
      required: true,
    },
    {
      type: 'yhqrjccl',
      title: '银行确认解除材料',
      show: true,
      limitCount: 1,
      length: 0,
      required: true,
    },
    {
      type: 'yhtzyj',
      title: '银行通知邮件',
      show: false,
      limitCount: 1,
      length: 0,
      required: true,
    },
  ],
  errorArray: ['validateError', 'otherError'],
  EDIT_MESSAGE: '当前页有正处于编辑的数据，请取消或确认后再进行操作。',
  tips: {
    validateError: '该申请单数据导入失败，请点击下载报错信息查看报错信息，如有需要，请重新发起流程。',
    otherError: '该申请单流程提交失败，如有需要，请重新发起流程或联系运维人员核查处理。',
  },
};

export default config;
