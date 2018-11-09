import _ from 'lodash';
import qs from 'query-string';
import { commission, keyMonitorAccount } from './config/auth';
import duty from './config/duty';
import channelType from './page/channelType';
import emp from './emp';

// 根据ID是否存在职责列表中
// 判断用户是否存在某个职责
const hasDuty = (list, id) => !!_.find(list, obj => (obj.respId === id));
// 判断用户是否含有某类权限集合collection中的一个
const hasDutyInCollection = (list, collection) => _.some(collection, item => hasDuty(list, item));

let dutyList = [];

const permission = {
  // 初始化
  init(list) {
    dutyList = list;
  },

  // HTSC 新功能体验岗
  hasNewFeatureInvestPermission() {
    return hasDuty(dutyList, duty.HTSC_NEW_FEATURE);
  },

  // HTSC 首页指标查询
  hasIndexViewPermission() {
    return hasDuty(dutyList, duty.HTSC_SYZBCX);
  },

  // HTSC 营销活动-总部执行岗
  hasHqMampPermission() {
    return hasDuty(dutyList, duty.HTSC_HQ_MAMPID);
  },
  // HTSC 营销活动-分中心管理岗
  hasBoMampPermission() {
    return hasDuty(dutyList, duty.HTSC_BO_MAMPID);
  },

  // HTSC 营销活动-营业部执行岗
  hasBdMampPermission() {
    return hasDuty(dutyList, duty.HTSC_BD_MAMPID);
  },

  // HTSC 任务管理岗
  hasTkMampPermission() {
    return hasDuty(dutyList, duty.HTSC_TK_MAMPID);
  },

  // HTSC 资讯管理岗
  hasZXMampPermission() {
    return hasDuty(dutyList, duty.HTSC_ZX_MAMPID);
  },

  // 目标客户池首页和列表页权限
  hasCustomerPoolPermission() {
    return permission.hasTkMampPermission() || permission.hasIndexViewPermission();
  },

  // 是否有权限查看管理者视图
  hasPermissionOfManagerView() {
    return permission.hasTkMampPermission();
  },

  // 判断自建任务的时候是否需要审批，是否可以进入下一步
  judgeCreateTaskApproval({ sendCustsServedByPostn, custNumsIsExceedUpperLimit }) {
    let needApproval = false;
    let isIncludeNotMineCust = false;
    let canGoNextStep = false;
    let needMissionInvestigation = false;

    if (!sendCustsServedByPostn || custNumsIsExceedUpperLimit) {
      // 包含非本人名下的客户
      isIncludeNotMineCust = true;
    }

    if (permission.hasTkMampPermission()) {
      // 如果是HTSC 任务管理岗
      if (isIncludeNotMineCust) {
        // 如果数量超过1000
        // 则代表客户里面包含非本人名下的客户，则需要审批
        // 如果包含非本人名下的客户，则需要审批
        needApproval = true;
        needMissionInvestigation = true;
      } else {
        needApproval = false;
      }
      canGoNextStep = true;
    } else if (isIncludeNotMineCust) {
      // 如果没有职责，但是有非本人名下的客户，则禁止进入下一步
      canGoNextStep = false;
    } else {
      // 没有职责，没有非本人名下的客户，则不需要审批，可以进入下一步
      needApproval = false;
      canGoNextStep = true;
    }

    return {
      needApproval,
      canGoNextStep,
      needMissionInvestigation,
      isIncludeNotMineCust,
    };
  },

  // 服务订购的权限判断
  hasServiceOrderDuty(respList) {
    return !!_.find(dutyList, o => _.includes(respList, o.respId));
  },

  // 佣金调整资讯订阅权限
  hasCommissionADSubscribeAuthority() {
    // 资讯订阅需要的权限
    const resps = commission.subscribe;
    return permission.hasServiceOrderDuty(resps);
  },

  // 佣金调整资讯退订权限
  hasCommissionADUnSubscribeAuthority() {
    // 资讯退订需要的权限
    const resps = commission.unsubscribe;
    return permission.hasServiceOrderDuty(resps);
  },

  // 佣金调整批量佣金申请权限
  hasCommissionBatchAuthority() {
    // 批量佣金调整需要的权限
    const resps = commission.batch;
    return permission.hasServiceOrderDuty(resps);
  },

  // 佣金调整单佣金调整申请权限
  hasCommissionSingleAuthority(empPostnList) {
    // 单佣金调整需要的权限(1)
    const resp1 = commission.single_1;
    const resp2 = commission.single_2;
    // FSP系统中的职位字段
    const pstnId = emp.getPstnId();
    // 是否拥有第一种权限
    const isInResp1 = permission.hasServiceOrderDuty(resp1);
    // 是否拥有第二种权限
    const isInResp2 = permission.hasServiceOrderDuty(resp2);
    // 找出目前登录人的职位名称
    const postInfo = _.filter(empPostnList, item => item.postnId === pstnId)[0];
    const postName = postInfo && postInfo.postnName;
    // 判断岗位名称
    let isServicePost = false;
    if (!_.isEmpty(postName)) {
      isServicePost = postName.indexOf(duty.STRING_FWG) > -1;
    }
    return isInResp2 || (isInResp1 && isServicePost);
  },

  // 合作合约新建按钮权限
  // 检测是否有相应的职责、职位权限
  hasPermissionOfPostion(empInfo) {
    // 职责
    const allowPermission = duty.HTSC_ZHFW_YYBZXG;
    // 岗位
    const permissionText = duty.STRING_YYBFWG;
    // 从 empInfo 中取出 empRespList 职责列表，empPostnList 岗位列表
    const { empRespList = [], empPostnList = [] } = empInfo;
    // fsp 里的职位字段
    const fspPostnId = emp.getPstnId();
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
      return (
        !channelType.isTenLevelTplId(templateId) &&
        channelType.isZJKCDChannel(subType)
      );
    }
    return false;
  },

  // 通道类型协议，当前用户是否拥有新建按钮权限
  hasPermissionOfProtocolCreate(empInfo) {
    // 职责--HTSC 综合服务-营业部执行岗、HTSC 营业部服务岗
    const permissionYYBZXG = duty.HTSC_ZHFW_YYBZXG;
    const permissionYYBFWG = duty.HTSC_YYBFWG;
    // 从 empInfo 中取出 empRespList 职责列表
    const { empRespList = [] } = empInfo;
    // 从职责列表中找出 职责名称对应的 id 等于 需要检测的职责名称 id 的数组
    const filterRespYYBZXG = _.filter(empRespList, o => o.respId === permissionYYBZXG);
    const filterRespYYBFWG = _.filter(empRespList, o => o.respId === permissionYYBFWG);
    // 判断两个职责列表，都有数据则有权限
    const hasPermission = (filterRespYYBZXG.length > 0) || (filterRespYYBFWG.length > 0);
    return hasPermission;
  },

  // 公务手机申请，当前用户是否拥有新建按钮权限
  hasPermissionOfPhoneApplyCreate(empInfo) {
    // 职责-- HTSC 分公司投顾管理岗
    const permissionFGSTGGLG = duty.HTSC_FGSTGGLG;
    // 从 empInfo 中取出 empRespList 职责列表
    const { empRespList = [] } = empInfo;
    // 从职责列表中找出 职责名称对应的 id 等于 需要检测的职责名称 id 的数组
    const filterRespFGSTGGLG = _.filter(empRespList, o => o.respId === permissionFGSTGGLG);
    // 判断两个职责列表，都有数据则有权限
    const hasPermission = filterRespFGSTGGLG.length > 0;
    return hasPermission;
  },

  // 股票期权申请，当前用户是否拥有新建按钮权限
  hasPermissionOfStockApplyCreate() {
    return hasDuty(dutyList, duty.HTSC_GPQQSQG);
  },

  // HTSC 交易信息查询权限（非私密客户）
  hasNPCTIQPermission() {
    return hasDuty(dutyList, duty.HTSC_TIQ_NPC);
  },

  // HTSC 交易信息查询权限（含私密客户）
  hasPCTIQPermission() {
    return hasDuty(dutyList, duty.HTSC_TIQ_PC);
  },

  // HTSC 客户资料-总部管理岗
  hasCIHMPPermission() {
    return hasDuty(dutyList, duty.HTSC_CI_HMP);
  },

  // HTSC 客户资料-分中心管理岗
  hasCIBMPPermission() {
    return hasDuty(dutyList, duty.HTSC_CI_BMP);
  },

  // HTSC 客户资料（无隐私）-总部管理岗
  hasNPCIHMPPermission() {
    return hasDuty(dutyList, duty.HTSC_NPCI_HMP);
  },

  // HTSC 客户资料（无隐私）-分中心管理岗
  hasNPCIBMPPermission() {
    return hasDuty(dutyList, duty.HTSC_NPCI_BMP);
  },

  // HTSC 开发-营业部执行岗
  hasKFYYBZXGPermission() {
    return hasDuty(dutyList, duty.HTSC_KF_YYBZXG);
  },

  // HTSC 综合服务-营业部执行岗
  hasZHFWYYBZXGPermission() {
    return hasDuty(dutyList, duty.HTSC_ZHFW_YYBZXG);
  },

  // HTSC 限制性账户审批岗
  hasXZXZHSPGPermission() {
    return hasDuty(dutyList, duty.HTSC_XZXZHSPG);
  },

  // HTSC 客户分配岗
  hasKHFPGPermission() {
    return hasDuty(dutyList, duty.HTSC_KHFPG);
  },

  // HTSC 客户资料管理岗（无隐私）
  hasCDMPermission() {
    return hasDuty(dutyList, duty.HTSC_CDM);
  },

  // 管理者视图客户总数下钻、进度条下钻、饼图下钻查看非本人名下客户360需要的职责
  // - HTSC 客户资料-分中心管理岗
  // - HTSC 客户资料-总部管理岗
  // - HTSC 客户资料（无隐私）-分中心管理岗
  // - HTSC 客户资料(无隐私）-总部管理岗
  // - HTSC 客户资料管理岗（无隐私）
  hasViewCust360PermissionForManagerView() {
    return permission.hasCIHMPPermission() ||
      permission.hasCIBMPPermission() ||
      permission.hasNPCIHMPPermission() ||
      permission.hasNPCIBMPPermission() ||
      permission.hasCDMPermission();
  },

  // ！！！目前和管理者视图查看360职责一样，但是为了防止以后经常改职责，还是保留两个方法
  // 客户列表查看非本人名下客户360需要的职责
  // - HTSC 客户资料-分中心管理岗
  // - HTSC 客户资料-总部管理岗
  // - HTSC 客户资料（无隐私）-分中心管理岗
  // - HTSC 客户资料(无隐私）-总部管理岗
  // - HTSC 客户资料管理岗（无隐私）
  hasViewCust360PermissionForCustList() {
    return permission.hasCIHMPPermission() ||
      permission.hasCIBMPPermission() ||
      permission.hasNPCIHMPPermission() ||
      permission.hasNPCIBMPPermission() ||
      permission.hasCDMPermission();
  },

  // 若登录人是该客户的主服务经理或登录人具有如下任意一个职责
  //  HTSC 客户资料-分中心管理岗
  //  HTSC 客户资料-总部管理岗
  //  HTSC 客户资料（无隐私）-分中心管理岗
  //  HTSC 客户资料(无隐私）-总部管理岗
  //  HTSC 客户资料管理岗（无隐私）
  // 点击客户号链接进入客户360-投资者评估管理-重点监控账户模块
  hasJumpTo360CustViewKeyMonitorAccountPermission() {
    return hasDutyInCollection(dutyList, keyMonitorAccount.jumpTo360DutyCollection);
  },

  // HTSC 融资类业务客户关联关系管理岗
  hasGLGXGLGPermission() {
    return hasDuty(dutyList, duty.HTSC_GLGXGLG);
  },

  // HTSC 隐私信息查询权限
  hasHTSCPrivateInfoCheck() {
    return hasDuty(dutyList, duty.HTSC_PRIVATEINFO_CHECK);
  },

  /**
   * 封装一下灰度发布的标记，fsp会提供一个grayFlag在window上，
   * 本地开发的时候可以在url上通过?grayFlag=true的方式手动测试，
   * 检测当前版本是不是需要支持灰度发布，以便控制代码里面的逻辑显示、隐藏、特殊处理等
   */
  isGrayFlag() {
    const nativeQuery = qs.parse(window.location.search);
    const grayFlag =
      window.grayFlag === true
      || nativeQuery.grayFlag === 'true'
      || this.hasNewFeatureInvestPermission();
    return grayFlag;
  },
};

export default permission;
