// 资产降序排列
export const ASSET_DESC = 'desc';

// 客户男女code码
export const MALE_CODE = '109001';
export const FEMALE_CODE = '109002';

// 个人对应的code码
export const PER_CODE = 'per';
// 一般机构对应的code码
export const ORG_CODE = 'org';
// 产品机构对应的code码
export const PROD_CODE = 'prod';

// 男性客户的头像
export const MALE_ICON = 'gerenkehu';
// 女性客户的头像
export const FEMALE_ICON = 'nvxingtouxiang';
// 一般机构的头像
export const ORG_ICON = 'yibanjigou';
// 产品机构的头像
export const PROD_ICON = 'chanpinjigou';

// 风险等级配置
export const riskLevelConfig = {
  704010: {
    name: '激',
    title: '激进型',
  },
  704040: {
    name: '低',
    title: '保守型（最低类别）',
  },
  704030: {
    name: '保',
    title: '保守型',
  },
  704020: {
    name: '稳',
    title: '稳健型',
  },
  704025: {
    name: '谨',
    title: '谨慎型',
  },
  704015: {
    name: '积',
    title: '积极型',
  },
};

// 任务状态为未处理、处理中、已驳回时可打电话
export const CALLABLE_LIST = ['10', '20', '60'];

// 信息的完备，用于判断
export const COMPLETION = '完备';
export const NOTCOMPLETION = '不完备';

export const PHONE = 'phone';

export const MSG_ROUTEFORWARD = '您输入的表单中信息还未保存，如切换窗口信息将丢失，确定要切换吗？';

// 执行者视图首次引导提示第一步的dom的id名称
export const INTRO_FIRST_SEEP_IDNAME = 'introFirstStep';

// 执行者视图首次引导提示第二步的dom的id名称(客户名下有其他任务)
export const INTRO_SECOND_SEEP_IDNAME = 'introSecondStep';

// 执行者视图首次引导提示第二步的dom的id名称(客户名下无其他任务)
export const INTRO_SECOND_SEEP_IDNAME2 = 'introSecondStepByHasOtherTask';

// 表格titlelist
export const titleList = {
  custOtherTaskList: [
    {
      dataIndex: 'eventName',
      key: 'eventName',
      title: '任务名称',
      width: '28%',
    },
    {
      dataIndex: 'contents',
      key: 'contents',
      title: '服务策略',
      width: '36%',
    },
    {
      dataIndex: 'hint',
      key: 'hint',
      title: '任务提示',
      width: '36%',
    },
  ],
};
