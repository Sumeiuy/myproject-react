/*
 * @fileOverview pageConfig.js
 * @author hongguangqing
 * @description 用于设置发起者视图，执行者视图，以及管理者视图的page Type
 * 以及各个子类型和状态配置项
 *
*/

const pageConfig = {
  // 执行者视图
  taskList: {
    pageName: '视图',
    pageType: 'taskList', // 查询列表接口中的type值
    viewType: [
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
    ], // 类型
    status: [
      {
        show: true,
        label: '所有状态',
        value: '',
      },
      {
        show: true,
        label: '审批中',
        value: '10',
      },
      {
        show: true,
        label: '驳回',
        value: '20',
      },
      {
        show: true,
        label: '终止',
        value: '30',
      },
      {
        show: true,
        label: '结束',
        value: '40',
      },
      {
        show: true,
        label: '执行中',
        value: '50',
      },
      {
        show: true,
        label: '结果跟踪',
        value: '60',
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

};

export default pageConfig;
