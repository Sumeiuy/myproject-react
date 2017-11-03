/**
 * @file utils/permission.js
 *  获取权限
 * @author 汪俊俊
 */
import _ from 'lodash';

import duty, { commission } from './duty';

let permissionList = [];

// 下面的配置统一到duty中去了
// const HTSC_RESPID = '1-46IDNZI'; // 首页指标查询匹配值

const permission = {
  // 初始化
  init(list) {
    permissionList = list;
  },

  // HTSC 首页指标查询 权限
  hasIndexViewPermission() {
    const index = _.findIndex(permissionList, item => (item.respId === duty.htsc_syzbcx));
    return index >= 0;
  },

  // 佣金调整资讯订阅权限
  hasCommissionADSubscribeAuthority() {
    // 资讯订阅需要的权限
    const resps = commission.subscribe;
    const index = _.findIndex(permissionList, item => _.includes(resps, item.respId));
    return index > -1;
  },

  // 佣金调整资讯退订权限
  hasCommissionADUnSubscribeAuthority() {
    // 资讯退订需要的权限
    const resps = commission.unsubscribe;
    const index = _.findIndex(permissionList, item => _.includes(resps, item.respId));
    return index > -1;
  },

  // 佣金调整批量佣金申请权限
  hasCommissionBatchAuthority() {
    // 批量佣金调整需要的权限
    const resps = commission.batch;
    const index = _.findIndex(permissionList, item => _.includes(resps, item.respId));
    return index > -1;
  },

  // 佣金调整单佣金调整申请权限
  hasCommissionSingleAuthority(empPostnList) {
    // 单佣金调整需要的权限(1)
    const resp1 = commission.single_1;
    const resp2 = commission.single_2;
    // FSP系统中的职位字段
    const pstnId = window.forReactPosition && window.forReactPosition.pstnId;
    // 是否拥有第一种权限
    const isInResp1 = _.findIndex(permissionList, item => _.includes(resp1, item.respId));
    // 是否拥有第二种权限
    const isInResp2 = _.findIndex(permissionList, item => _.includes(resp2, item.respId));
    // 找出目前登录人的职位名称
    const postInfo = _.filter(empPostnList, item => item.postnId === pstnId)[0];
    const postName = postInfo && postInfo.postnName;
    // 判断岗位名称
    let isServicePost = false;
    if (!_.isEmpty(postName)) {
      isServicePost = postName.indexOf('服务岗') > -1;
    }
    return (isInResp2 > -1) || (isInResp1 > -1 && isServicePost);
  },

  // 合作合约新建按钮权限
  // 检测是否有相应的职责、职位权限
  hasPermissionOfPostion(empInfo) {
    // 职责
    const allowPermission = duty.htsc_zhfw_yybzxg;
    // 岗位
    const permissionText = duty.string_yybfwg;
    // 从 empInfo 中取出 empRespList 职责列表，empPostnList 岗位列表
    const { empRespList = [], empPostnList = [] } = empInfo;
    // fsp 里的职位字段
    const fspPostnId = window.forReactPosition ? (window.forReactPosition.pstnId || '') : '';
    // 从职责列表中找出 职责名称 等于 需要检测的职责名称 的数组
    const filterResp = _.filter(empRespList, o => o.respId === allowPermission);
    // 根据 fspId 找出岗位列表中，找出 岗位 id 等于 fspId
    const filterPtId = _.filter(empPostnList, o => o.postnId === fspPostnId);
    // 根据找出的登陆人 id 找出 符合 岗位条件的数组
    const filterPostn = _.filter(filterPtId, o => o.postnName.indexOf(permissionText) !== -1);
    // 判断职责列表与岗位列表，都有数据则有权限
    const hasPermission = (filterResp.length > 0) && (filterPostn.length > 0);
    return hasPermission;
  },

  // 通道类型协议，根据传入的子类型和模板id，判断是否显示选择多用户和十档行情按钮
  protocolIsShowSwitch(templateId, subType) {
    if (templateId && subType) {
      return (templateId !== duty.ten_level_template_id && subType === duty.zjkcd_id);
    }
    return false;
  },
};

export default permission;
