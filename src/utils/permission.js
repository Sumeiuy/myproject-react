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
    // 单佣金调整需要的权限
    const resp1 = commission.single_1;
    const resp2 = commission.single_2;
    const pstnId = window.forReactPosition && window.forReactPosition.pstnId;
    const isInResp1 = _.findIndex(permissionList, item => _.includes(resp1, item.respId));
    const isInResp2 = _.findIndex(permissionList, item => _.includes(resp2, item.respId));
    const postInfo = _.filter(empPostnList, item => item.postnId === pstnId);
    const postName = postInfo && postInfo.postnName;
    // 判断岗位名称
    let isServicePost = false;
    if (!_.isEmpty(postName)) {
      isServicePost = postName.indexOf('服务岗') > -1;
    }
    return (isInResp2 > -1) || (isInResp1 > -1 && isServicePost);
  },

};

export default permission;
