/**
 * @Author: sunweibin
 * @Date: 2018-07-09 14:47:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-26 18:45:34
 * @description 线上销户组件的配置项
 */

const config = {
  // 推送按钮的状态文字
  PUSHBTN: {
    display: '销户链接推送',
    disabled: '销户链接已推送',
    notDisplay: '',
  },

  // 流失去向
  LOSTDIRECTION: {
    // 投资其他
    invest: 'investOther',
    // 转户
    transfer: 'churnTransfer',
  },

  // 审批人弹出层表头
  APPROVAL_COLUMNS: [
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
  PUSHBTN,
  LOSTDIRECTION,
  APPROVAL_COLUMNS,
} = config;
