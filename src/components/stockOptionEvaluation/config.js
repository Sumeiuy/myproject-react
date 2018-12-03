/*
 * @Author: zhangjun
 * @Date: 2018-06-05 15:39:47
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-07-31 17:40:47
 */
import {
  customer, status, drafter, department, approver, applyTime
} from '../../config/busApplyFilters';

const config = {
  stockOptionApply: {
    pageName: '股票期权评估申请',
    pageType: '11', // 查询列表接口中的type值
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
    basicFilters: [
      customer,
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
    // 适当性评估表
    assessTable: [
      {
        assessEle: '诚信评估',
        aptitudeEle: '无不良诚信记录，或法律法规、部门规章和上交所业务规则禁止或者限制从事期权交易的情形。',
        assessResult: '符合条件',
      },
      {
        assessEle: '风险评估',
        aptitudeEle: '具有相应的风险承受能力(须在有效期内)。',
        riskGrade: '风险评级：',
        assessResult: '个人客户稳健型以下、普通机构客户积极型以下不予授予交易权限',
      },
      {
        assessEle: '风险评级时间',
        assessResult: '符合条件',
      },
      {
        assessEle: '基本情况\n(二选一)',
        aptitudeEleAge: '在22-65周岁之间',
        aptitudeEleDegree: '不在22-65岁(含)范围内需提供大专或以上的学历证明材料。',
        assessResultAge: '符合年龄条件',
        assessResultDegree1: '已审核通过',
        assessResultDegree2: '学历证明材料',
      },
      {
        assessEle: '投资经历评估\n(二选一)',
        aptitudeEleInv: '关联A股账户在我公司开立时间6个月以上并开立融资融券证券账户。',
        aptitudeEleExper: '关联A股账户在其他机构累计开立时间6个月以上，开立融资融券证券账户，或具有金融期货交易经历。',
        assessResultInv: '符合条件',
        assessResultaAcct: 'A股账户开立时间6个月以上',
        assessResultrzrqzq: '已开立融资融券证券账户',
        assessResultjrqhjy: '已提供金融期货交易证明',
      },
      {
        assessEle: '模拟交易经历评估',
        aptitudeEle: '具有相应的期权模拟交易经历。',
        assessResult1: '模拟交易经历符合',
        assessResult2: '权限',
      },
    ],
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

export const {
  stockOptionApply,
  approvalColumns,
} = config;
