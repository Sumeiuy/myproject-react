/*
 * @Description: 公务手机和电话卡号管理配置文件
 * @Author: hongguangqing
 * @Date: 2018-04-18 10:26:38
 */

const config = {
  type: '09', // 公务手机和电话卡号管理type类型值
  statusOptions: [
    {
      show: true,
      label: '已分配',
      value: 'Y',
    },
    {
      show: true,
      label: '未分配',
      value: 'N',
    },
  ],
};

export default config;
