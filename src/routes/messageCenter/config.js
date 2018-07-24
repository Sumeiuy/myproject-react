/**
 * @Description: 消息中心配置项
 * @Author: Liujianshu
 * @Date: 2018-06-08 21:11:16
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-06-12 15:03:01
 */

const config = {
  abort: '终止',
  fail: '失败',
  // 分公司客户分配
  custAllot: 'HTSC New Batch Branch Assignment Inbox Type',
  // 营业部客户分配
  departmentCustAllot: 'HTSC Batch Division Assignment Inbox Type',
  // 主职位设置
  mainPosition: 'HTSC Primary Position Change Inbox Type',
  // 360 客户？请补充
  tgSign: 'HTSC FSP TGSign',
  // 降级客户处理，划转为零售
  demote: 'HTSC Branch Assignment Inbox Type',
  // 待确认
  taskList: 'HTSC Investment Advice Inbox Type',
  // 分公司人工划转
  filialeCustTransfer: 'HTSC Batch Branch Assignment Inbox Type',
  // 用户中心
  userCenter: 'HTSC TG Approval Inbox Type',
  // 我的反馈
  myFeedback: 'HTSC FeedBack Management Inbox Type',
};

export default config;
