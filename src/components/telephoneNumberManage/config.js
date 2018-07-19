/*
 * @Description: 公务手机和电话卡号管理配置文件
 * @Author: hongguangqing
 * @Date: 2018-04-18 10:26:38
 */
import { serviceManager, status, drafter, department, approver } from '../../config/busApplyFilters';

const config = {
  // 最大可以选择的服务经理的数量
  MAXSELECTNUM: 200,
  telephoneNumDistribute: {
    pageName: '公务手机分配',
    pageType: '09', // 查询列表接口中的type值
    statusOptions: [
      {
        show: true,
        label: '已分配',
        value: 'Y',
      },
      {
        show: true,
        label: '未分配',
        value: 'N',
      },
    ],
  },
  telephoneNumApply: {
    pageName: '公务手机申请',
    pageType: '09', // 查询列表接口中的type值
    statusOptions: [
      {
        show: true,
        label: '不限',
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
    headerFilters: {
      basicFilters: [
        serviceManager,
        status,
        drafter,
        department,
      ],
      moreFilters: [
        approver,
      ],
      moreFilterData: [
        { value: '审批人', key: 'approvalId' },
      ],
    },
  },
  approvalColumns: [
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
};

export default config;
