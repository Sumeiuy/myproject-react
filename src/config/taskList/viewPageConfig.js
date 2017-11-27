/*
 * @fileOverview config/viewPageConfig.js
 * @author hongguangqing
 * @description 用于设置发起者视图，执行者视图，以及管理者视图的page Type
 * 以及各个子类型和状态配置项
 *
 * 现阶段子类型(subType)与状态(status)不做联动
 *
*/

const pageConfig = {
  // 执行者视图
  performerView: {
    pageName: '执行者视图',
    pageType: 'performerView', // 查询列表接口中的type值
    subType: [
      {
        show: true,
        label: '所有类型',
        value: '',
      },
      {
        show: true,
        label: '产品营销',
        value: '0103',
      },
      {
        show: true,
        label: '产品售后',
        value: '0102',
      },
      {
        show: true,
        label: '业务推荐',
        value: '0101',
      },
    ], // 子类型
    status: [
      {
        show: true,
        label: '所有状态',
        value: '',
      },
      {
        show: true,
        label: '审批中',
        value: '01',
      },
      {
        show: true,
        label: '结束',
        value: '02',
      },
      {
        show: true,
        label: '执行中',
        value: '03',
      },
      {
        show: true,
        label: '结果跟踪',
        value: '04',
      },
      {
        show: true,
        label: '被驳回',
        value: '05',
      },
    ],
    chooseMissionView: [
      {
        show: true,
        label: '发起者视图',
        value: 'initiator',
      },
      {
        show: true,
        label: '执行者视图',
        value: 'executor',
      },
      {
        show: true,
        label: '管理者视图',
        value: 'controller',
      },
    ],
  },
  // 创建者视图
  creatorView: {
    pageName: '自建任务列表',
    pageType: 'creatorView',
    type: [
      {
        show: true,
        label: '所有类型',
        value: '',
      },
      {
        show: true,
        label: '产品营销',
        value: 'ProdMarketing',
      },
      {
        show: true,
        label: '产品售后',
        value: 'AfterSales',
      },
      {
        show: true,
        label: '业务推荐',
        value: 'BusinessRecomm',
      },
      {
        show: true,
        label: '账户服务',
        value: 'AccoutService',
      },
      {
        show: true,
        label: '交易服务',
        value: 'TradeService',
      },
      {
        show: true,
        label: '活动关怀',
        value: 'ActiveCare',
      },
    ],
    status: [
      {
        show: true,
        label: '所有状态',
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
  },

};

export default pageConfig;
