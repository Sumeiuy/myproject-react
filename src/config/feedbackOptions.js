/*
 * @fileOverview config/feedbacOoptions.js
 * @author hongguangqing
 * @description 用于存放用户反馈处理下拉框选项的配置
*/

const feedbackOptions = {
  // 头部查询条件-渠道
  feedbackChannel: [
    {
      value: 'MCRM',
      label: 'MCRM',
      children: [
        {
          value: 'mission',
          label: '任务中心',
        },
        {
          value: 'product',
          label: '产品中心',
        },
        {
          value: 'customer',
          label: '客户中心',
        },
        {
          value: 'profile',
          label: '我的',
        },
      ],
    },
    {
      value: 'FSP',
      label: 'FSP',
      children: [
        {
          value: 'JXST',
          label: '绩效视图',
        },
        {
          value: 'KHZX',
          label: '客户中心',
        },
        {
          value: 'RWZX',
          label: '任务中心',
        },
        {
          value: 'CPXS',
          label: '产品销售',
        },
        {
          value: 'ZCPZ',
          label: '资产配置',
        },
        {
          value: 'TJCX',
          label: '统计查询',
        },
        {
          value: 'ZXZX',
          label: '资讯中心',
        },
        {
          value: 'ZSK',
          label: '知识库',
        },
        {
          value: 'YWSQ',
          label: '业务申请',
        },
      ],
    },
  ],
  typeOptions: [
    {
      value: 'DEFECT',
      label: '问题',
    },
    {
      value: 'SUGGESTION',
      label: '建议',
    },
  ],
  questionTagOptions: [
    {
      value: 'USE',
      label: '使用方法',
    },
    {
      value: 'SUGGEST',
      label: '改进建议',
    },
    {
      value: 'SPECIFICATION',
      label: '产品规格限制',
    },
    {
      value: 'FUNCTION',
      label: '产品功能缺陷',
    },
    {
      value: 'EXPERIENCE',
      label: '用户体验问题',
    },
    {
      value: 'OTHER',
      label: '其他产品问题',
    },
  ],
  stateOptions: [
    {
      value: 'PROCESSING',
      label: '解决中',
    },
    {
      value: 'CLOSED',
      label: '关闭',
    },
  ],
  operatorOptions: [
    {
      value: 'ALL',
      label: '全部',
    },
    {
      value: 'SELF',
      label: '本人',
    },
  ],
  allOperatorOptions: [
    {
      value: '011105',
      label: '李定国',
    },
    {
      value: '011200',
      label: '毛权',
    },
    {
      value: '011199',
      label: '赵洪兵',
    },
    {
      value: '010490',
      label: '王可',
    },
    {
      value: '004790',
      label: '王娟',
    },
    {
      value: '006073',
      label: '赵国辉',
    },
  ],
};

export default feedbackOptions;
