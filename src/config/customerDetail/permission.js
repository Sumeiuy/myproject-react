/**
 * @Author: zhufeiyang
 * @Description: 客户360-客户属性
 * @Date: 2018-11-06 16:17:28
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-26 18:11:35
 */
import _ from 'lodash';
import { permission } from '../../helper';

export default function getCustomerDetailPermission(empInfo = {}) {
  const {
    hasCIHMPPermission, // HTSC 客户资料-总部管理岗
    hasCIBMPPermission, // HTSC 客户资料-分中心管理岗
    hasNPCIHMPPermission, // HTSC 客户资料（无隐私）-总部管理岗
    hasNPCIBMPPermission, // HTSC 客户资料（无隐私）-分中心管理岗
    hasCDMPermission, // HTSC 客户资料管理岗（无隐私）
    hasPRIVATEINFOCHECKPermission, // HTSC 隐私信息查询权限
    hasNPCTIQPermission, // HTSC 交易信息查询权限（非私密客户）
    hasPCTIQPermission, // HTSC 交易信息查询权限（含私密客户）
  } = permission;

  // 客户基本信息权限判定
  const basicInfoPermission =
    hasCIHMPPermission() ||
    hasCIBMPPermission() ||
    hasNPCIHMPPermission() ||
    hasNPCIBMPPermission() ||
    hasCDMPermission() ||
    empInfo.isMainEmp ||
    empInfo.isAssistantEmp || false;

  // 客户属性-tab-权限判定
  const custPropertyTabPermission =
    hasPRIVATEINFOCHECKPermission() || basicInfoPermission;

  // 客户属性-(非隐私信息)-权限判定
  const custPropertyInfoPermission = basicInfoPermission;
  // 客户属性-隐私信息-权限判定
  const custPropertyPrivateInfoPermission =
    hasCIHMPPermission() ||
    hasPRIVATEINFOCHECKPermission() ||
    empInfo.isMainEmp ||
    empInfo.isAssistantEmp || false;

  // 账户信息tab-(私密客户)-权限判定
  const accountInfoTabPrivatePermission =
    hasPCTIQPermission() ||
    empInfo.isMainEmp ||
    empInfo.isAssistantEmp || false;

  // 账户信息tab-权限判定
  const accountInfoTabPermission = (_.isEmpty(empInfo) || empInfo.isPrivateCustomer) ?
    accountInfoTabPrivatePermission : (hasNPCTIQPermission() || accountInfoTabPrivatePermission);

  // 业务办理tab-权限判定
  const businessHandTabPermission = basicInfoPermission;
  // 服务记录tab-权限判定
  const serviceRecordTabPermission = basicInfoPermission;
  // 服务关系tab-权限判定
  const serviceRelationshipTabPermission = basicInfoPermission;
  // 合约管理tab-权限判定
  const contractManagementTabPermission = basicInfoPermission;
  // 产品订单tab-权限判定
  const productOrderTabPermission = basicInfoPermission;
  // 理财优惠券tab-权限判定
  const discountCouponTabPermission = basicInfoPermission;
  // 客户画像tab-权限判定
  const customerProfileTabPermission = basicInfoPermission;

  // 信息编辑权限
  const infoEditPermission = empInfo.isMainEmp;
  return {
    basicInfoPermission,
    custPropertyInfoPermission,
    custPropertyPrivateInfoPermission,
    accountInfoTabPermission,
    custPropertyTabPermission,
    businessHandTabPermission,
    serviceRecordTabPermission,
    serviceRelationshipTabPermission,
    contractManagementTabPermission,
    productOrderTabPermission,
    discountCouponTabPermission,
    customerProfileTabPermission,
    infoEditPermission,
  };
}

