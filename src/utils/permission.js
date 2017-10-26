/**
 * @file utils/permission.js
 *  获取权限
 * @author 汪俊俊
 */
import _ from 'lodash';

// import duty, { commission } from './duty';
import duty from './duty';

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
    // const resps = commission.subscribe;
  },

  // 佣金调整资讯退订权限
  hasCommissionADUnSubscribeAuthority() {
    // 资讯退订需要的权限
    // const resps = commission.unsubscribe;
  },

  // 佣金调整批量佣金申请权限
  hasCommissionBatchAuthority() {
    // 批量佣金调整需要的权限
    // const resps = commission.batch;
  },

  // 佣金调整单佣金调整申请权限
  hasCommissionSingleAuthority() {
    // 单佣金调整需要的权限
    // const resp1 = commission.single_1;
    // const resp2 = commission.single_2;
  },

};

export default permission;
