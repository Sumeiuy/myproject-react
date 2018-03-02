/*
 * @Description: 客户划转的配置文件
 * @Author: LiuJianShu
 * @Date: 2018-01-17 16:43:38
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2018-01-17 16:45:27
 */

const config = {
  transferType: [
    {
      show: true,
      label: '单客户划转',
      value: 'single',
    },
    {
      show: false,
      label: '批量导入',
      value: 'multi',
    },
  ],
};

export default config;
