/**
 * @Author: sunweibin
 * @Date: 2018-01-22 15:55:02
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-22 16:08:42
 * @description 通道类型协议特有的辅助函数
 */

//  通道类型协议特有的配置
const config = {
  TEN_LEVEL_TEMPLATE_ID: '1-43OZSYG', // 十档行情模板ID
  ZJKCD_ID: '507070', // 紫金快车道子类型ID
  ZJKCD_NAME: '紫金快车道协议',  // 紫金快车道子类型名称
  GSTD_ID: '507050', // 高速通道子类型ID
  GSTD_NAME: '高速通道类协议', // 高速通道子类型名称
};

const channelType = {
  /**
   * 判断是否通道类型协议下的高速通道类型协议
   * @param {String} type 类型ID
   */
  isGSChannel(type) {
    return type === config.GSTD_ID;
  },
  /**
   * 判断是否通道类型协议下的紫金快车道协议
   * @param {String} type 类型ID
   */
  isZJKCDChannel(type) {
    return type === config.ZJKCD_ID || type === config.ZJKCD_NAME;
  },
  /**
   * 判断是否十档行情模板ID
   * @param {String} type 类型ID
   */
  isTenLevelTplId(type) {
    return type === config.TEN_LEVEL_TEMPLATE_ID;
  },
};

export { config };
export default channelType;
