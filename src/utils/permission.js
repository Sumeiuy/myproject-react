/**
 * @file utils/permission.js
 *  获取权限
 * @author 汪俊俊
 */
import _ from 'lodash';

import duty, { commission } from './duty';

let permissionList = [];

const HTSC_RESPID = '1-46IDNZI'; // HTSC 首页指标查询
const HTSC_HQ_MAMPID = '1-FCQM-27'; // HTSC 营销活动-总部执行岗
const HTSC_BO_MAMPID = '1-FCQM-35'; // HTSC 营销活动-分中心管理岗
const HTSC_BD_MAMPID = '1-FCQM-36'; // HTSC 营销活动-营业部执行岗
const HTSC_TK_MAMPID = '1-FCQM-38'; // HTSC 任务管理岗

const judgeAuthority = (list, id) => !!_.find(list, obj => (obj.respId === id));

const permission = {
  // 初始化
  init(list) {
    permissionList = list;
  },

  // HTSC 首页指标查询
  hasIndexViewPermission() {
    return judgeAuthority(permissionList, HTSC_RESPID);
  },

  // HTSC 营销活动-总部执行岗
  hasHqMampPermission() {
    return judgeAuthority(permissionList, HTSC_HQ_MAMPID);
  },

  // HTSC 营销活动-分中心管理岗
  hasBoMampPermission() {
    return judgeAuthority(permissionList, HTSC_BO_MAMPID);
  },

  // HTSC 营销活动-营业部执行岗
  hasBdMampPermission() {
    return judgeAuthority(permissionList, HTSC_BD_MAMPID);
  },

  // HTSC 任务管理岗
  hasTkMampPermission() {
    return judgeAuthority(permissionList, HTSC_TK_MAMPID);
  },

  // 目标客户池首页和列表页权限
  hasCustomerPoolPermission() {
    return permission.hasTkMampPermission();
  },

  // 目标客户池创建任务权限
  hasCreateTaskPermission() {
    return permission.hasTkMampPermission();
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

  // 通道类型协议，根据传入的子类型和模板id，以及是否需要，判断是否显示选择多用户和十档行情按钮
  protocolIsShowSwitch(templateId, subType, flag) {
    if (templateId && subType && flag) {
      return (templateId !== duty.ten_level_template_id &&
        (subType === duty.zjkcd_id || subType === duty.zjkcd_name));
    }
    return false;
  },

  // 通道类型协议，当前用户是否拥有新建按钮权限
  hasPermissionOfProtocolCreate(empInfo) {
    // 职责--HTSC 综合服务-营业部执行岗、HTSC 营业部服务岗
    const permissionYYBZXG = duty.htsc_zhfw_yybzxg;
    const permissionYYBFWG = duty.htsc_yybfwg;
    // 从 empInfo 中取出 empRespList 职责列表
    const { empRespList = [] } = empInfo;
    // 从职责列表中找出 职责名称对应的 id 等于 需要检测的职责名称 id 的数组
    const filterRespYYBZXG = _.filter(empRespList, o => o.respId === permissionYYBZXG);
    const filterRespYYBFWG = _.filter(empRespList, o => o.respId === permissionYYBFWG);
    // 判断两个职责列表，都有数据则有权限
    const hasPermission = (filterRespYYBZXG.length > 0) || (filterRespYYBFWG.length > 0);
    return hasPermission;
  },

  // 是否有权限查看管理者视图
  hasPermissionOfManagerView() {
    return permission.hasHqMampPermission()
      || permission.hasBoMampPermission()
      || permission.hasBdMampPermission();
  },
};

export default permission;
