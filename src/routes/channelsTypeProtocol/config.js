/*
 * @Description: 通道类协议页面配置项
 * @Author: LiuJianShu
 * @Date: 2017-12-13 10:03:47
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-02-06 18:49:40
 */
import { config as channelTypeConfig } from '../../helper/page/channelType';

const config = {
  // 终止按钮
  btnEnd: 'FINISH',
  // 终止文字
  textEnd: 'falseOver',
  // 订购的值
  subscribeArray: ['Subscribe', '协议订购'],
  // 续订的值
  renewalArray: ['Renewal', '协议续订'],
  // 退订的值
  unSubscribeArray: ['Unsubscribe', '协议退订'],
  // 新增或删除下挂客户的值
  addDelArray: ['AddDel', '新增或删除下挂客户'],
  // 可以操作下挂客户的操作类型
  custOperateArray: ['协议订购', '新增或删除下挂客户', 'Subscribe', 'AddDel'],
  tenHQ: '紫金快车道十档行情',
  // 弹出层提示信息
  tipsMap: {
    // 退订时弹框提示语
    Unsubscribe: '锁定期不允许退出，是否确认要退出该协议',
    // 订购时弹框提示语
    Subscribe: '经对客户与服务产品三匹配结果，请确认客户是否已签署服务计划书及适当确认书！',
  },
  // 客户状态
  custStatusObj: {
    cannotDelete: ['开通失败', '退订完成', '退订处理中'],
    canDelete: ['开通处理中'],
    logicalDelete: ['开通完成'],
    canAdd: ['退订完成', '开通失败'],
  },
  doApproveOperate: {
    [channelTypeConfig.ZJKCD_ID]: '1', // 子类型为紫金快车道时对应的operate
    [channelTypeConfig.GSTD_ID]: '11', // 子类型为高速通道时对应的operate
  },

};

export default config;
