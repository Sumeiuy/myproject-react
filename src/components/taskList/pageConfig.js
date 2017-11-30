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
    status: [  // 创建者视图详情页面需要做对应的翻译
      {
        show: true,
        label: '全部',
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
        label: '我创建的任务',
        value: 'initiator',
      },
      {
        show: true,
        label: '我执行的任务',
        value: 'executor',
      },
      {
        show: true,
        label: '我部门的任务',
        value: 'controller',
      },
    ],
  },

};

export default pageConfig;
