/*
 * @fileOverview config/permissionOptions.js
 * @author hongguangqing
 * @description 用于存放用户权限申请下拉框选项的配置
*/

const permissionOptions = {
  // 头部查询条件-渠道
  subtypeOptions: [
    {
      value: 'ADD',
      label: '私密客户设置',
    },
    {
      value: 'CANCEL',
      label: '私密客户取消',
    },
    {
      value: 'DISTRIBUTE',
      label: '私密客户交易信息权限分配',
    },
  ],
  stateOptions: [
    {
      value: 'PROCESSING',
      label: '处理中',
    },
    {
      value: 'COMPLETE',
      label: '完成',
    },
    {
      value: 'END',
      label: '终止',
    },
  ],
};

export default permissionOptions;
