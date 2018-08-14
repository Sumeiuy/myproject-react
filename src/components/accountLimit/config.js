/**
 * @Description: 账户限制管理配置项
 * @Author: Liujianshu
 * @Date: 2018-07-31 16:51:05
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-08-03 14:07:38
 */
import busApplyFilters from '../../config/busApplyFilters';

const { operationType, status, drafter, department, approver, applyTime } = busApplyFilters;
// 限制设置的code
const setCode = '1301';
// 限制解除的code
const relieveCode = '1302';
const config = {
  timeFormatStr: 'YYYY-MM-DD',
  setCode,
  relieveCode,
  // 限制的条数
  limitCount: 200,
  // 限制提醒信息
  limitMessage: '一个申请单客户列表客户数不可超过200条',
  // 页面名称-中文
  pageName: '账户限制管理',
  // 页面名称-英文
  pageValue: 'accountLimitPage',
  // 页面类型
  pageType: '13', // 查询列表接口中的type值
  basicFilters: [
    operationType,
    status,
    drafter,
    department,
    approver,
    applyTime,
  ],
  // 子类型数组
  operateTypeArray: [
    {
      show: true,
      label: '限制设置',
      value: setCode,
    },
    {
      show: true,
      label: '限制解除',
      value: relieveCode,
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
      },
      {
        dataIndex: 'empName',
        key: 'empName',
        title: '服务经理',
      },
      {
        dataIndex: 'limit',
        key: 'limit',
        title: '当前账户限制',
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
        title: '所属营业部',
        dataIndex: 'occupation',
        key: 'occupation',
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
  tips: {
    validateError: '该申请单数据导入失败，请点击下载报错信息查看报错信息，如有需要，请重新发起流程。',
    otherError: '该申请单流程提交失败，如有需要，请重新发起流程或联系运维人员核查处理。',
  },
};

export default config;
