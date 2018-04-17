/**
 * @Description: 任务绑定客户反馈部分配置项
 * @Author: Liujianshu
 * @Date: 2018-04-16 13:25:09
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-04-16 13:33:33
 */

const config = {
  // 角色可选项配置
  roleType: [
    {
      name: '服务经理可选项',
      key: '0',
    },
    {
      name: '客户可选项',
      key: '1',
    },
  ],
  // tab切换选项
  tabList: [
    {
      tabName: 'MOT任务',
      key: '1',
    },
    {
      tabName: '自建任务',
      key: '2',
    },
  ],
};

export default config;
