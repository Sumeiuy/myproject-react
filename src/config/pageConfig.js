/*
 * @fileOverview config/pageConfig.js
 * @author sunweibin
 * @description 用于设置合作合约、佣金调整、私密客户的page Type
 * 以及各个子类型和状态配置项
 *
 * 现阶段子类型(subType)与状态(status)不做联动
 *
*/

const pageConfig = {
  // 权限分配
  permission: {
    pageName: '权限申请',
    pageType: '01', // 查询列表接口中的type值
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '私密客户设置',
        value: '0103',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
          {
            show: true,
            label: '驳回',
            value: '',
          },
        ], // 状态
      },
      {
        show: true,
        label: '私密客户取消',
        value: '0102',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '私密客户交易信息权限分配',
        value: '0101',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
      },
    ], // 子类型
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '流程发起',
        value: '流程发起',
      },
      {
        show: true,
        label: '营业部负责人审批',
        value: '营业部负责人审批',
      },
      {
        show: true,
        label: '分公司负责人审批',
        value: '分公司负责人审批',
      },
      {
        show: true,
        label: '经纪及财富管理部业务处理',
        value: '经纪及财富管理部业务处理',
      },
      {
        show: true,
        label: '重新提交',
        value: '重新提交',
      },
      {
        show: true,
        label: '终止办结',
        value: '终止办结',
      },
      {
        show: true,
        label: '正常办结',
        value: '正常办结',
      },
    ],
  },
  // 佣金调整
  commission: {
    pageName: '佣金调整',
    pageType: '02',
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '佣金调整',
        value: '0201',
        status: [
          {
            show: true,
            label: '待营业部负责人审核',
            value: '',
          },
          {
            show: true,
            label: '返回创建者',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '已失败',
            value: '',
          },
          {
            show: true,
            label: '佣金待处理',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '批量佣金调整',
        value: '0202',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '资讯订阅',
        value: '0203',
        status: [
          {
            show: true,
            label: '待营业部负责人审核',
            value: '',
          },
          {
            show: true,
            label: '返回创建者',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '已失败',
            value: '',
          },
        ],
      },
      {
        show: true,
        label: '资讯退订',
        value: '0204',
        status: [
          {
            show: true,
            label: '待营业部负责人审核',
            value: '',
          },
          {
            show: true,
            label: '返回创建者',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '已失败',
            value: '',
          },
        ],
      },
    ],
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '待营业部负责人审核',
        value: '待营业部负责人审核',
      },
      {
        show: true,
        label: '返回创建者',
        value: '返回创建者',
      },
      {
        show: true,
        label: '佣金待处理',
        value: '佣金待处理',
      },
      {
        show: true,
        label: '处理中',
        value: '处理中',
      },
      {
        show: true,
        label: '完成',
        value: '完成',
      },
      {
        show: true,
        label: '已失败',
        value: '已失败',
      },
    ],
  },
  // 合作合约
  contract: {
    pageName: '合作合约',
    pageType: '03',
    subType: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '限售股解禁',
        value: '0301',
        status: [
          {
            show: true,
            label: '处理中',
            value: '',
          },
          {
            show: true,
            label: '完成',
            value: '',
          },
          {
            show: true,
            label: '终止',
            value: '',
          },
        ],
      },
    ],
    status: [
      {
        show: true,
        label: '全部',
        value: '',
      },
      {
        show: true,
        label: '处理中',
        value: '处理中',
      },
      {
        show: true,
        label: '完成',
        value: '完成',
      },
      {
        show: true,
        label: '终止',
        value: '终止',
      },
    ],
  },
};

export default pageConfig;
